// Temporary test endpoint - DELETE after verifying env variables work
export default function handler(req, res) {
  const hasAdminEmail = !!process.env.ADMIN_EMAIL;
  const hasAdminPassword = !!process.env.ADMIN_PASSWORD;

  res.status(200).json({
    envLoaded: hasAdminEmail && hasAdminPassword,
    hasAdminEmail,
    hasAdminPassword,
    adminEmailValue: process.env.ADMIN_EMAIL ? '***@***.com (set)' : 'NOT SET',
    note: 'DELETE this file after testing - it exposes env variable status'
  });
}
