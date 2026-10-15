const DEFAULT_ACCOUNTS_URL = 'https://accounts.zoho.com';
const DEFAULT_DESK_API_URL = 'https://desk.zoho.com';

function getZohoConfig() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const orgId = process.env.ZOHO_DESK_ORG_ID;
  const departmentId = process.env.ZOHO_DESK_DEPARTMENT_ID;

  if (!clientId || !clientSecret || !refreshToken || !orgId || !departmentId) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    orgId,
    departmentId,
    accountsUrl: (process.env.ZOHO_ACCOUNTS_URL || DEFAULT_ACCOUNTS_URL).replace(/\/$/, ''),
    deskApiUrl: (process.env.ZOHO_DESK_API_URL || DEFAULT_DESK_API_URL).replace(/\/$/, ''),
  };
}

async function getAccessToken(config) {
  const body = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  });

  const response = await fetch(`${config.accountsUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const payload = await response.json();

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error || 'Unable to obtain a Zoho access token');
  }

  return payload.access_token;
}

/**
 * Creates a Zoho Desk ticket from a website contact form submission.
 * The OAuth refresh token must include the Desk.tickets.CREATE scope.
 */
export async function createZohoDeskTicket(contact) {
  const config = getZohoConfig();
  if (!config) {
    return { success: false, configured: false, message: 'Zoho Desk is not configured' };
  }

  const accessToken = await getAccessToken(config);
  // OAuth may return Zoho's generic API domain, which is not the Zoho Desk API
  // endpoint. Desk tickets must always use the Desk data-centre URL.
  const response = await fetch(`${config.deskApiUrl}/api/v1/tickets`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      orgId: config.orgId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contact: { lastName: contact.name, email: contact.email, phone: contact.phone },
      subject: `Website inquiry: ${contact.subjectLabel}`,
      description: [
        `Message: ${contact.message}`,
        contact.referralSource ? `Referral source: ${contact.referralSource}` : null,
        contact.cdscNumber ? `CDSC / ID number: ${contact.cdscNumber}` : null,
        `Website submission ID: ${contact.id}`,
      ].filter(Boolean).join('\n'),
      departmentId: config.departmentId,
      channel: 'Web',
      priority: 'Medium',
    }),
    cache: 'no-store',
  });
  const responseText = await response.text();
  let payload;
  try {
    payload = JSON.parse(responseText);
  } catch {
    throw new Error(`Zoho Desk API error (${response.status}): ${responseText.slice(0, 200)}`);
  }
  if (!response.ok || !payload.id) {
    throw new Error(payload.message || 'Zoho Desk rejected the ticket');
  }

  return { success: true, configured: true, id: payload.id, ticketNumber: payload.ticketNumber };
}
