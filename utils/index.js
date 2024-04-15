const dayjs = require("dayjs");
const UUID = require("uuid");

/* Get skip data count */
exports.getSkipCount = (page, perPageCount) => {
  if (page > 0) {
    return (page - 1) * perPageCount;
  }
  return 0;
};

/* Get current date object */
exports.getDateObject = () => {
  return dayjs();
};

/* Format date */
exports.getFormattedDate = (date, format = "YYYY-MM-DD") => {
  return dayjs(date).format(format);
};

/* Generate UUID */
exports.generateUUID = () => {
  return UUID.v4();
};

/* Get PDF content */
exports.getPDFContent = ({
  title = "Incture invoice",
  teamSize,
  invoices,
  name,
  email,
  companyName,
  accountantSalary,
  savings,
  ROIPercentage,
}) => {
  let content = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      />
      <title>${title}</title>
      <style>
        * {
          font-family: "Roboto", sans-serif;
        }
        header {
          padding: 16px 8px;
          border-bottom: 1px solid #eee;
        }
        .content {
          padding: 0px 20px;
        }
        .content .title {
          color: rgb(0, 136, 212);
          text-align: center;
        }
  
        .date {
          text-align: right;
        }
  
        .basicInfo {
          margin-top: 40px;
        }
        .basicInfo table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
          border: 1px solid #eee;
        }
        .basicInfo table thead tr th {
          padding: 18px 0px;
          background-color: rgb(0, 136, 212);
          color: white;
          font-size: 18px;
          font-weight: 500;
          border: 1px solid #eee;
          border-collapse: collapse;
        }
        .basicInfo table tbody tr td {
          padding: 18px 0px;
          border: 1px solid #eee;
        }
        .ROI {
          font-weight: 700;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <header>
        <img
          src="https://incture.com/wp-content/uploads/2022/02/Incture-Logo-Blue-150x34-px.svg"
          alt="Incture"
        />
      </header>
      <main class="content">
        <h2 class="title">Invoice</h2>
        <p class="date">
          <span class="label">Date</span>
          <span class="seperator">:</span>
          <span class="value">${dayjs().format("DD/MM/YYYY")}</span>
        </p>
        <section class="basicInfo">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company name</th>
                <th>Email</th>
                <th>Invoices</th>
                <th>Team size</th>
                <th>Avg Salary</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${name}</td>
                <td>${companyName}</td>
                <td>${email}</td>
                <td>${invoices}</td>
                <td>${teamSize}</td>
                <td>${accountantSalary}</td>
                <td>${savings}</td>
              </tr>
              <tr>
                <td colspan="5"></td>
                <td class="ROI">ROI</td>
                <td>${ROIPercentage} %</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </body>
  </html>  
  `;
  return content;
};

/* Calculate ROI and Savings */
exports.calculateROIAndSavings = ({
  invoices,
  teamSize: apteam,
  accountantSalary: avgsal,
}) => {
  invoices = +invoices;
  apteam = +apteam;
  avgsal = +avgsal;

  const costManual = apteam * avgsal;
  const tenPercentManualCost = costManual / 10;
  let costAuto = 0;

  if (invoices >= 0 && invoices <= 50000) {
    costAuto = tenPercentManualCost + 50000 + 50000 + 15000;
  } else if (invoices > 50000 && invoices <= 200000) {
    costAuto = tenPercentManualCost + 60000 + 120000 + 15000;
  } else if (invoices > 200000 && invoices <= 500000) {
    costAuto = tenPercentManualCost + 70000 + 250000 + 20000 + 65000;
  } else if (invoices > 500000 && invoices <= 1000000) {
    costAuto = tenPercentManualCost + 80000 + 400000 + 20000 + 75000;
  } else if (invoices >= 1000000 && invoices <= 2000000) {
    costAuto = tenPercentManualCost + 90000 + 600000 + 20000 + 90000;
  }

  const savings = costManual - costAuto;
  const savingsPercent = Math.round((savings / costManual) * 100);
  const investmentValue = costAuto - tenPercentManualCost;
  const roiPercent = Math.round((savings / investmentValue) * 100);

  return {
    savings: Number.isFinite(savings) ? savings : 0,
    savingsPercent: Number.isFinite(savingsPercent) ? savingsPercent : 0,
    roiPercent: Number.isFinite(roiPercent) ? roiPercent : 0,
  };
};
