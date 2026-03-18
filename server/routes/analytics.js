import express from 'express';
import Analytics from '../models/Analytics.js';
import Card from '../models/Card.js';
import isAdmin from '../middleware/adminAuth.js';

const router = express.Router();

// Protect all analytics routes — admin only
router.use(isAdmin);

// GET /api/analytics/realtime - Real-time stats
router.get('/realtime', async (req, res) => {
  try {
    const stats = req.io ? await getAdminStats(req.io) : await getAdminStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Analytics realtime error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
});

// GET /api/analytics/activity - Recent activity feed
router.get('/activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const activities = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .populate('cardId', 'name image');
    
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Analytics activity error:', error);
    res.status(500).json({ success: false, message: 'Error fetching activity' });
  }
});

// GET /api/analytics/revenue - Revenue data with date range
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const revenueData = await Analytics.aggregate([
      {
        $match: {
          type: 'purchase',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          total: { $sum: '$metadata.amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({ success: true, data: revenueData });
  } catch (error) {
    console.error('Analytics revenue error:', error);
    res.status(500).json({ success: false, message: 'Error fetching revenue data' });
  }
});

// GET /api/analytics/cards - Card performance
router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    const cardStats = await Promise.all(
      cards.map(async (card) => {
        const downloads = await Analytics.countDocuments({ cardId: card._id, type: 'download' });
        const purchases = await Analytics.countDocuments({ cardId: card._id, type: 'purchase' });
        const editorEntries = await Analytics.countDocuments({ cardId: card._id, type: 'editor_entry' });
        
        return {
          _id: card._id,
          name: card.name,
          price: card.price,
          image: card.image,
          enabled: card.enabled !== false,
          downloads,
          purchases,
          editorEntries
        };
      })
    );

    res.json({ success: true, data: cardStats });
  } catch (error) {
    console.error('Analytics cards error:', error);
    res.status(500).json({ success: false, message: 'Error fetching card stats' });
  }
});

// PATCH /api/analytics/cards/:cardId - Update card (price, name, enabled)
router.patch('/cards/:cardId', async (req, res) => {
  try {
    const { name, price, enabled } = req.body;
    const { cardId } = req.params;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (enabled !== undefined) updateData.enabled = enabled;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ success: false, message: 'البطاقة غير موجودة' });
    }

    res.json({ success: true, data: card });
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ success: false, message: 'Error updating card' });
  }
});

// GET /api/analytics/sales - Sales transactions
router.get('/sales', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    const matchQuery = { type: 'purchase' };
    if (status) {
      matchQuery['metadata.status'] = status;
    }

    const [sales, total] = await Promise.all([
      Analytics.find(matchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email')
        .populate('cardId', 'name image'),
      Analytics.countDocuments(matchQuery)
    ]);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Analytics sales error:', error);
    res.status(500).json({ success: false, message: 'Error fetching sales' });
  }
});

// Helper function to get admin stats
async function getAdminStats(io) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayVisits, todayPurchases, monthRevenue] = await Promise.all([
    Analytics.countDocuments({ type: 'visit', createdAt: { $gte: todayStart } }),
    Analytics.countDocuments({ type: 'purchase', createdAt: { $gte: todayStart } }),
    Analytics.aggregate([
      { $match: { type: 'purchase', createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$metadata.amount' } } }
    ])
  ]);

  const conversionRate = todayVisits > 0 ? ((todayPurchases / todayVisits) * 100).toFixed(2) : 0;

  // Get active users and editors from Socket.io if available
  let activeUsers = 0;
  let activeEditors = 0;
  
  if (io && io.sockets) {
    const connectedSockets = await io.sockets.fetchSockets();
    activeUsers = connectedSockets.length;
    
    // Count users in editor (would need to track this state)
    // For now, we'll use a simplified approach
  }

  return {
    activeUsers,
    activeEditors,
    totalVisitsToday: todayVisits,
    purchasesToday: todayPurchases,
    conversionRate: parseFloat(conversionRate),
    revenueToday: await getRevenue(todayStart, now),
    revenueWeek: await getRevenue(weekStart, now),
    revenueMonth: monthRevenue[0]?.total || 0
  };
}

async function getRevenue(startDate, endDate) {
  const result = await Analytics.aggregate([
    { $match: { type: 'purchase', createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: '$metadata.amount' } } }
  ]);
  return result[0]?.total || 0;
}

export default router;