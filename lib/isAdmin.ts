/**
 * Checks if the given email address belongs to an admin user.
 * Admin emails are read from the NEXT_PUBLIC_ADMIN_EMAILS environment variable
 * (a comma-separated list).
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  if (!adminEmails.trim()) return false;

  const adminList = adminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminList.includes(email.toLowerCase());
}
