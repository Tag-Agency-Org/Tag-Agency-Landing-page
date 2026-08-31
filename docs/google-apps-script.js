const SHEET_NAME = "Website Leads";
const REQUIRED_HEADERS = [
  "Timestamp",
  "Full Name",
  "Business Name",
  "Phone Number",
  "Email Address",
  "Industry",
  "Monthly Advertising Budget",
  "Primary Requirement",
  "Message",
  "Consent",
  "Page URL",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "UTM Content",
  "UTM Term",
  "Referrer URL",
  "Lead Status",
  "Notes"
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const errors = validatePayload_(payload);

    if (errors.length) {
      return json_({ success: false, errors: errors }, 400);
    }

    const sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      clean_(payload.fullName),
      clean_(payload.businessName),
      clean_(payload.phone),
      clean_(payload.email),
      clean_(payload.industry),
      clean_(payload.monthlyBudget),
      clean_(payload.primaryRequirement),
      clean_(payload.message),
      clean_(payload.consent),
      clean_(payload.pageUrl),
      clean_(payload.utmSource),
      clean_(payload.utmMedium),
      clean_(payload.utmCampaign),
      clean_(payload.utmContent),
      clean_(payload.utmTerm),
      clean_(payload.referrerUrl),
      "New Lead",
      ""
    ]);

    return json_({ success: true, message: "Lead captured" }, 200);
  } catch (error) {
    return json_({ success: false, message: "Unexpected error", detail: String(error) }, 500);
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  const raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function validatePayload_(payload) {
  const errors = [];
  if (!clean_(payload.fullName)) errors.push("Full name is required");
  if (!clean_(payload.phone)) errors.push("Phone number is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean_(payload.email))) errors.push("Valid email address is required");
  return errors;
}

function clean_(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 2000);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const currentHeaders = sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).getValues()[0];
  const needsHeaders = REQUIRED_HEADERS.some((header, index) => currentHeaders[index] !== header);
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setValues([REQUIRED_HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function json_(body, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ statusCode: statusCode }, body)))
    .setMimeType(ContentService.MimeType.JSON);
}
