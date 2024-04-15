const JOI = require("joi");

const restrictedMailDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "zohocorp.com",
];
const restrictedMail = ["Gmail", "Yahoo", "Outlook", "Zoho"];

const getInvalidMailMessage = () => {
  if (restrictedMail.length == 1) return restrictedMail[0];
  let lastElement = restrictedMail[restrictedMail.length - 1];
  let firstNElements = restrictedMail.slice(0, lastElement.length - 1);
  return `${firstNElements.join(", ")} or ${lastElement}`;
};

exports.getUsersSchema = {
  query: {
    page: JOI.number().allow("", null).label("Page"),
    pageSize: JOI.number().allow("", null).label("Page size"),
    filter: JOI.string().allow("", null).label("Filter"),
  },
};

exports.addUserSchema = {
  body: {
    name: JOI.string().required().label("Name"),
    companyName: JOI.string().required().label("Company name"),
    email: JOI.string()
      .email()
      .required()
      .custom((value, helpers) => {
        const domain = value.split("@")[1];
        if (restrictedMailDomains.includes(domain)) {
          throw Error(
            `Invalid email. Please use an email address from a provider other than ${getInvalidMailMessage()}`
          );
        }
        return value;
      }, "Custom email restriction")
      .label("Email"),
    invoices: JOI.number().required("Invoices"),
    teamSize: JOI.number().required("Team size"),
    accountantSalary: JOI.number().required("Average Accountant salary"),
    ROIPercentage: JOI.number().required("ROI %"),
    savings: JOI.number().required("Savings"),
    savingsPerentage: JOI.number().required("Savings percentage"),
  },
};

exports.deleteUserSchema = {
  query: {
    id: JOI.string().required().label("Id"),
  },
};

exports.getROISchema = {
  body: {
    invoices: JOI.number().required("Invoices"),
    teamSize: JOI.number().required("Team size"),
    accountantSalary: JOI.number().required("Average Accountant salary"),
  },
};
