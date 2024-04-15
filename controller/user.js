const {
  getSkipCount,
  getDateObject,
  generateUUID,
  getPDFContent,
  calculateROIAndSavings,
} = require("../utils");
const {
  FAILED,
  SUCCESS,
  MAXIMUM_RECORDS_PER_PAGE,
  RECORDS_PER_PAGE,
} = require("../config/constants");
const { getUsers, insertUser, deleteUser } = require("../model/user");
const { createPDF } = require("../service/pdfGenerator");
const path = require("path");
const { sendEmail } = require("../service/email");

exports.getUsers = async (req, res, next) => {
  try {
    let { page, pageSize, filter } = req.query;
    pageSize =
      isNaN(pageSize) ||
      isNaN(pageSize) ||
      Number(pageSize) > MAXIMUM_RECORDS_PER_PAGE
        ? RECORDS_PER_PAGE
        : pageSize;
    page = isNaN(page) ? 0 : getSkipCount(page, pageSize);

    let response = await getUsers({ page, pageSize, filter });

    return res.send({
      status: SUCCESS,
      message: "",
      data: response,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    let { body } = req;

    let id = generateUUID();
    let fileName = `${id}.pdf`;

    let { savings, savingsPercent, roiPercent } = calculateROIAndSavings(body);

    let user = {
      ...body,
      _id: id,
      createdAt: getDateObject().toDate(),
      invoices: +body["invoices"],
      teamSize: +body["teamSize"],
      accountantSalary: +body["accountantSalary"],
      ROIPercentage: roiPercent,
      savingsPerentage: savingsPercent,
      savings: savings,
      invoice: fileName,
      status: "A",
    };

    let pdfContent = getPDFContent(user);
    let file = await createPDF(pdfContent, fileName);
    let filePath = path.join(__dirname, `../public/pdf/${fileName}`);

    if (file) {
      let response = await insertUser(user);
      if (response) {
        await sendEmail({
          to: user.email,
          filePath: file,
          text: `Dear ${user.name} thank you choosing us here is your invoice. We are waiting to work with you.`,
        });
        return res.send({
          status: SUCCESS,
          message: "Invoice has been successfully sent to your email.",
        });
      }
    }

    return res.send({
      status: FAILED,
      message: "Failed to insert user details",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    let { id } = req.query;
    let response = await deleteUser(id);
    if (response) {
      return res.send({
        status: SUCCESS,
        message: "User details successfully deleted.",
      });
    }
    return res.send({
      status: FAILED,
      message: "Failed to delete user details.",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getROI = (req, res, next) => {
  try {
    let { body } = req;
    let { savings, savingsPercent, roiPercent } = calculateROIAndSavings(body);
    res.send({
      status: 1,
      data: {
        savings: savings,
        savingsPerentage: savingsPercent,
        ROIPercentage: roiPercent,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
