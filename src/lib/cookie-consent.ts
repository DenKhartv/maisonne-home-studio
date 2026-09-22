export const COOKIE_CONSENT_KEY = "maisonne-cookie-consent";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
};

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as CookieConsent).necessary === true &&
      typeof (parsed as CookieConsent).analytics === "boolean"
    ) {
      return parsed as CookieConsent;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCookieConsent(consent: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}
