import {
  checkRateLimit,
  cleanLongText,
  cleanString,
  isLikelyEmail,
  isRecord,
  jsonError,
  jsonOk,
  parseJsonBody
} from "@/lib/api";

function redactEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) {
    return email;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}

export async function POST(request: Request) {
  try {
    const limited = checkRateLimit(request, "launch-help", 5, 10 * 60_000);
    if (limited) {
      return limited;
    }

    const { data: body, error } = await parseJsonBody(request, 12_000);
    if (error) {
      return error;
    }

    if (!isRecord(body)) {
      return jsonError("Invalid request body.");
    }

    if (cleanString(body.company, 120)) {
      return jsonOk({ ok: true });
    }

    const name = cleanString(body.name, 80);
    const email = cleanString(body.email, 160).toLowerCase();
    const websiteName = cleanString(body.websiteName, 120);
    const domainStatus = cleanString(body.domainStatus, 80);
    const apiKeyStatus = cleanString(body.apiKeyStatus, 80);
    const budget = cleanString(body.budget, 80);
    const notes = cleanLongText(body.notes, 1600);
    const consent = body.consent === true;

    if (!name) {
      return jsonError("Enter your name.");
    }

    if (!isLikelyEmail(email)) {
      return jsonError("Enter a valid email address.");
    }

    if (!consent) {
      return jsonError("Confirm that we can contact you about this request.");
    }

    const submission = {
      name,
      email,
      websiteName,
      domainStatus,
      apiKeyStatus,
      budget,
      notes,
      receivedAt: new Date().toISOString()
    };

    const webhookUrl = process.env.LAUNCH_HELP_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LAUNCH_HELP_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.LAUNCH_HELP_WEBHOOK_SECRET}` }
            : {})
        },
        body: JSON.stringify(submission)
      });

      if (!webhookResponse.ok) {
        return jsonError("Unable to send launch request. Please try email instead.", 502, "SERVER_ERROR");
      }
    } else if (
      process.env.NODE_ENV === "production" &&
      process.env.ALLOW_LOCAL_LEAD_LOG !== "true"
    ) {
      return jsonError(
        "Launch request intake is not configured. Please use the email fallback.",
        503,
        "SERVER_ERROR"
      );
    } else {
      console.info("Launch help request received", {
        ...submission,
        email: redactEmail(email),
        notes: notes ? "[redacted]" : ""
      });
    }

    return jsonOk({
      ok: true,
      message:
        "Thanks. Your request was received. Replace this API route with your email, CRM, or database integration when ready."
    });
  } catch {
    return jsonError("Unable to submit launch help request.", 500, "SERVER_ERROR");
  }
}
