const nodemailer = require("nodemailer");
const fs = require("fs");

exports.sendEmail = async ({
  to,
  subject = "Thank you for choosing incture.",
  text,
  filePath,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const pdfAttachment = {
      filename: "Invoice.pdf",
      content: fs.createReadStream(filePath),
    };

    const mailOptions = {
      from: `${process.env.SMTP_USERNAME} <${"Incture"}>`,
      to: to,
      subject: subject,
      text: text,
      attachments: [pdfAttachment],
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
