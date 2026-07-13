// ── localStorage Contact Storage ──────────────────────────────────────────────

const STORAGE_KEY = 'suncity_contacts';

export function loadContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function persistContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

/**
 * Upsert a contact. If a contact with same NIK already exists, update it.
 * Otherwise append as new.
 */
export function upsertContact(contacts, newContact) {
  if (newContact.nik && contacts.find((c) => c.nik === newContact.nik)) {
    return contacts.map((c) => (c.nik === newContact.nik ? newContact : c));
  }
  return [...contacts, newContact];
}
