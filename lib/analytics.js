const SESSION_STORAGE_KEY = 'aib-analytics-session-id';

const getSessionId = () => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
};

const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
};

export const trackAnalyticsEvent = async ({
  eventType,
  pageUrl,
  elementId = '',
  metadata = {},
  referrer = '',
}) => {
  if (typeof window === 'undefined' || !eventType || !pageUrl) return;

  const payload = {
    eventType,
    pageUrl,
    elementId,
    metadata,
    sessionId: getSessionId(),
    referrer: referrer || document.referrer || '',
  };

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: safeStringify(payload),
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackPageView = async (pageUrl) => {
  await trackAnalyticsEvent({
    eventType: 'page_view',
    pageUrl,
  });
};

export const trackButtonClick = async (elementId, pageUrl, metadata = {}) => {
  await trackAnalyticsEvent({
    eventType: 'button_click',
    pageUrl,
    elementId,
    metadata,
  });
};

export const trackLinkClick = async (elementId, pageUrl, metadata = {}) => {
  await trackAnalyticsEvent({
    eventType: 'link_click',
    pageUrl,
    elementId,
    metadata,
  });
};

export const trackDownload = async (elementId, pageUrl, metadata = {}) => {
  await trackAnalyticsEvent({
    eventType: 'download',
    pageUrl,
    elementId,
    metadata,
  });
};

export const trackFormSubmit = async (formId, pageUrl, metadata = {}) => {
  await trackAnalyticsEvent({
    eventType: 'form_submit',
    pageUrl,
    elementId: formId,
    metadata,
  });
};

export const trackScrollDepth = async (depth, pageUrl) => {
  await trackAnalyticsEvent({
    eventType: 'scroll_depth',
    pageUrl,
    elementId: `scroll_${depth}`,
    metadata: { depth },
  });
};

export const trackSessionStart = async (pageUrl) => {
  await trackAnalyticsEvent({
    eventType: 'session_start',
    pageUrl,
  });
};

export const trackSessionEnd = async (pageUrl) => {
  await trackAnalyticsEvent({
    eventType: 'session_end',
    pageUrl,
  });
};