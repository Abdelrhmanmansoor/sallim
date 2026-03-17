/**
 * Shared admin authentication middleware.
 * Verifies the X-Admin-Key header against ADMIN_SECRET_KEY env var.
 * Used by all admin-only routes.
 */
const isAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key']
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ success: false, error: 'غير مصرح لك للوصول' })
  }
  next()
}

export default isAdmin
