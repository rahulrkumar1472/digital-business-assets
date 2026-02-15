export type StoredLead = {
  leadId?: string;
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  website?: string;
  consentWeekly?: boolean;
};

const leadKey = "dba_lead";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredLead(): StoredLead | null {
  if (!isBrowser()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(leadKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredLead;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function storeLead(lead: StoredLead) {
  if (!isBrowser()) {
    return;
  }
  const existing = getStoredLead() || {};
  const merged = { ...existing, ...lead };
  window.localStorage.setItem(leadKey, JSON.stringify(merged));
}

export function requireLead() {
  return getStoredLead();
}
