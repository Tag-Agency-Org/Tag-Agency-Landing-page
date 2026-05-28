const RECIPIENT_EMAIL = "your-email@gmail.com";
const EMAIL_SUBJECT_PREFIX = "New TAG Agency Website Lead";

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const errors = validatePayload_(payload);

    if (errors.length) {
      return json_({ success: false, errors: errors }, 400);
    }

    const subject = `${EMAIL_SUBJECT_PREFIX}: ${clean_(payload.fullName)}`;
    const body = buildEmailBody_(payload);

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: subject,
      htmlBody: body.replace(/\n/g, "<br>"),
      name: "TAG Agency Website"
    });

    return json_({ success: true, message: "Lead emailed" }, 200);
  } catch (error) {
    return json_({ success: false, message: "Unexpected error", detail: String(error) }, 500);
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function validatePayload_(payload) {
  const errors = [];
  if (!clean_(payload.fullName)) errors.push("Full name is required");
  if (!clean_(payload.phone)) errors.push("Phone number is required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean_(payload.email))) errors.push("Valid email address is required");
  if (clean_(payload.consent).toLowerCase() !== "yes" && payload.consent !== true) errors.push("Consent is required");
  return errors;
}

function buildEmailBody_(payload) {
  return [
    "New website lead received from TAG Agency landing page.",
    "",
    `Submitted Date: ${clean_(payload.submittedDate) || new Date().toISOString()}`,
    `Full Name: ${clean_(payload.fullName)}`,
    `Business Name: ${clean_(payload.businessName)}`,
    `Phone Number: ${clean_(payload.phone)}`,
    `Email Address: ${clean_(payload.email)}`,
    `Industry: ${clean_(payload.industry)}`,
    `Monthly Advertising Budget: ${clean_(payload.monthlyBudget)}`,
    `Primary Requirement: ${clean_(payload.primaryRequirement)}`,
    "",
    "Message / Current Challenge:",
    clean_(payload.message),
    "",
    `Consent: ${clean_(payload.consent)}`,
    "",
    "Tracking:",
    `Page URL: ${clean_(payload.pageUrl)}`,
    `UTM Source: ${clean_(payload.utmSource)}`,
    `UTM Medium: ${clean_(payload.utmMedium)}`,
    `UTM Campaign: ${clean_(payload.utmCampaign)}`,
    `UTM Content: ${clean_(payload.utmContent)}`,
    `UTM Term: ${clean_(payload.utmTerm)}`,
    `Referrer URL: ${clean_(payload.referrerUrl)}`
  ].join("\n");
}

function clean_(value) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 2000);
}

function json_(body, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ statusCode: statusCode }, body)))
    .setMimeType(ContentService.MimeType.JSON);
}
