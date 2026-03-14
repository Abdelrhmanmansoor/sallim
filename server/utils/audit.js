import AuditLog from '../models/AuditLog.js'

export function getAuditRequestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  }
}

export async function safeAuditLog(payload) {
  try {
    await AuditLog.create(payload)
  } catch (error) {
    console.error('Audit log write failed:', error.message)
  }
}
