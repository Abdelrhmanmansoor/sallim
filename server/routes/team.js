import { Router } from 'express'
import crypto from 'crypto'
import CompanyTeam from '../models/CompanyTeam.js'
import Card from '../models/Card.js'
import { protectCompanyRoute } from './company.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// ═══ Invite Team Member ═══
router.post('/invite', protectCompanyRoute, async (req, res) => {
  try {
    const { name, email, role, permissions, invitedBy } = req.body

    if (!name || !email || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'الاسم والبريد الإلكتروني والدور مطلوبة' 
      })
    }

    // Check if team member already exists
    const existing = await CompanyTeam.findOne({
      company: req.company._id,
      email: email.toLowerCase()
    })

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        error: 'هذا البريد الإلكتروني مسجل بالفعل في الفريق' 
      })
    }

    // Generate random password
    const password = crypto.randomBytes(12).toString('hex')

    // Create team member
    const teamMember = await CompanyTeam.create({
      company: req.company._id,
      name,
      email: email.toLowerCase(),
      password,
      role,
      permissions: permissions || getDefaultPermissions(role),
      status: 'pending',
      invitedBy: req.company._id,
      invitedAt: new Date()
    })

    // Generate invite token
    teamMember.generateInviteToken()
    await teamMember.save()

    // TODO: Send invite email
    // await sendTeamInviteEmail(email, teamMember.inviteToken, password)

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'create',
      entity: 'team_member',
      entityId: teamMember._id,
      description: `دعوة فريق جديد: ${name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    // Don't send password in response for security
    const { password: _, ...memberData } = teamMember.toObject()

    res.status(201).json({
      success: true,
      message: 'تم إرسال الدعوة بنجاح',
      data: memberData
    })
  } catch (error) {
    console.error('Invite team member error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إرسال الدعوة' })
  }
})

// ═══ Get All Team Members ═══
router.get('/', protectCompanyRoute, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, role } = req.query

    const query = { company: req.company._id }
    if (status) query.status = status
    if (role) query.role = role

    const teamMembers = await CompanyTeam
      .find(query)
      .select('-password -inviteToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await CompanyTeam.countDocuments(query)

    res.json({
      success: true,
      data: {
        teamMembers,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get team members error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب أعضاء الفريق' })
  }
})

// ═══ Get Single Team Member ═══
router.get('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const teamMember = await CompanyTeam.findOne({
      _id: req.params.id,
      company: req.company._id
    }).select('-password -inviteToken')

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'العضو غير موجود' })
    }

    // Get member stats
    const cardsCreated = await Card.countDocuments({ createdBy: teamMember._id })

    res.json({
      success: true,
      data: {
        ...teamMember.toObject(),
        cardsCreated
      }
    })
  } catch (error) {
    console.error('Get team member error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب بيانات العضو' })
  }
})

// ═══ Update Team Member ═══
router.put('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const { name, role, permissions, status } = req.body

    const teamMember = await CompanyTeam.findOne({
      _id: req.params.id,
      company: req.company._id
    })

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'العضو غير موجود' })
    }

    const updates = {}
    if (name) updates.name = name
    if (role) {
      updates.role = role
      updates.permissions = permissions || getDefaultPermissions(role)
    }
    if (status) updates.status = status

    const updated = await CompanyTeam.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password -inviteToken')

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'update',
      entity: 'team_member',
      entityId: teamMember._id,
      description: `تحديث عضو فريق: ${teamMember.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث العضو بنجاح',
      data: updated
    })
  } catch (error) {
    console.error('Update team member error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث العضو' })
  }
})

// ═══ Delete Team Member ═══
router.delete('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const teamMember = await CompanyTeam.findOne({
      _id: req.params.id,
      company: req.company._id
    })

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'العضو غير موجود' })
    }

    await CompanyTeam.findByIdAndDelete(req.params.id)

    // Remove from company's team members list
    const company = await Company.findById(req.company._id)
    company.teamMembers = company.teamMembers.filter(id => id.toString() !== req.params.id)
    await company.save()

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'delete',
      entity: 'team_member',
      entityId: teamMember._id,
      description: `حذف عضو فريق: ${teamMember.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم حذف العضو بنجاح'
    })
  } catch (error) {
    console.error('Delete team member error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في حذف العضو' })
  }
})

// ═══ Resend Invite ═══
router.post('/:id/resend', protectCompanyRoute, async (req, res) => {
  try {
    const teamMember = await CompanyTeam.findOne({
      _id: req.params.id,
      company: req.company._id
    })

    if (!teamMember) {
      return res.status(404).json({ success: false, error: 'العضو غير موجود' })
    }

    if (teamMember.status === 'active') {
      return res.status(400).json({ 
        success: false, 
        error: 'هذا العضو مفعل بالفعل' 
      })
    }

    // Generate new invite token
    teamMember.generateInviteToken()
    teamMember.invitedAt = new Date()
    await teamMember.save()

    // TODO: Resend invite email
    // await sendTeamInviteEmail(teamMember.email, teamMember.inviteToken, password)

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'send',
      entity: 'team_member',
      entityId: teamMember._id,
      description: `إعادة إرسال دعوة: ${teamMember.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم إعادة إرسال الدعوة بنجاح'
    })
  } catch (error) {
    console.error('Resend invite error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إعادة الإرسال' })
  }
})

// Helper function to get default permissions based on role
function getDefaultPermissions(role) {
  const defaults = {
    editor: {
      createCards: true,
      editCards: true,
      deleteCards: false,
      viewAnalytics: true,
      manageTemplates: false,
      manageTeam: false,
      viewWallet: false,
      createCampaigns: true
    },
    viewer: {
      createCards: false,
      editCards: false,
      deleteCards: false,
      viewAnalytics: true,
      manageTemplates: false,
      manageTeam: false,
      viewWallet: false,
      createCampaigns: false
    },
    admin: {
      createCards: true,
      editCards: true,
      deleteCards: true,
      viewAnalytics: true,
      manageTemplates: true,
      manageTeam: true,
      viewWallet: true,
      createCampaigns: true
    }
  }

  return defaults[role] || defaults.editor
}

export default router