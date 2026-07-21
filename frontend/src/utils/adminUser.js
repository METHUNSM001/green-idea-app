// This list mirrors backend/config.py's ADMIN_EMAIL_ALIASES. It only
// controls what the UI *shows* here (e.g. the admin panel link) - the
// backend is the actual authority on what an admin token can do.
const ADMIN_EMAIL_ALIASES = [
  "smmethun2006@gmail.com",
  "smmethun2006@gmil.com",
  "tsmmethun2006@gmail.com",
];

export function isAdminUser(user) {
  return Boolean(user?.is_admin) || ADMIN_EMAIL_ALIASES.includes((user?.email || "").toLowerCase());
}
