import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Analytics from './models/Analytics.js';

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      // Allow anonymous connections for analytics
      socket.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      socket.user = null;
      next();
    }
  });

  // Active sessions tracker
  const activeSessions = new Map();
  const activeEditors = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    const sessionId = socket.handshake.query.sessionId || socket.id;

    // Track active session
    activeSessions.set(sessionId, {
      socketId: socket.id,
      userId: socket.user?.id,
      connectedAt: new Date(),
      lastActivity: new Date()
    });

    // Emit updated active users count
    io.emit('active_users_count', activeSessions.size);

    // Send initial stats to admin
    sendAdminStats(socket);

    // User entered editor
    socket.on('editor_enter', async (data) => {
      activeEditors.set(sessionId, {
        ...activeEditors.get(sessionId),
        cardId: data.cardId,
        cardName: data.cardName,
        enteredAt: new Date()
      });

      // Log analytics
      await Analytics.create({
        type: 'editor_entry',
        userId: socket.user?.id,
        cardId: data.cardId,
        cardName: data.cardName,
        sessionId,
        ipAddress: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent']
      });

      // Notify admin
      io.emit('live_activity', {
        type: 'editor_entry',
        userId: socket.user?.id || null,
        cardName: data.cardName,
        time: new Date().toISOString()
      });

      sendAdminStats(socket);
    });

    // User left editor
    socket.on('editor_leave', () => {
      activeEditors.delete(sessionId);
      sendAdminStats(socket);
    });

    // Card download event
    socket.on('card_download', async (data) => {
      await Analytics.create({
        type: 'download',
        userId: socket.user?.id,
        cardId: data.cardId,
        cardName: data.cardName,
        sessionId,
        ipAddress: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent'],
        metadata: data.metadata || {}
      });

      // Notify admin
      io.emit('live_activity', {
        type: 'download',
        userId: socket.user?.id || null,
        cardName: data.cardName,
        time: new Date().toISOString()
      });
    });

    // Purchase event
    socket.on('purchase', async (data) => {
      await Analytics.create({
        type: 'purchase',
        userId: socket.user?.id,
        cardId: data.cardId,
        cardName: data.cardName,
        sessionId,
        ipAddress: socket.handshake.address,
        userAgent: socket.handshake.headers['user-agent'],
        metadata: {
          amount: data.amount,
          currency: data.currency || 'SAR',
          transactionId: data.transactionId
        }
      });

      // Notify admin
      io.emit('live_activity', {
        type: 'purchase',
        userId: socket.user?.id || null,
        cardName: data.cardName,
        amount: data.amount,
        time: new Date().toISOString()
      });

      sendAdminStats(socket);
    });

    // Heartbeat for activity tracking
    socket.on('heartbeat', () => {
      if (activeSessions.has(sessionId)) {
        activeSessions.get(sessionId).lastActivity = new Date();
      }
    });

    // Admin request for stats
    socket.on('admin_request_stats', async () => {
      const stats = await getAdminStats();
      socket.emit('admin_stats', stats);
    });

    // Admin request for live activity feed
    socket.on('admin_request_activity', async () => {
      const activities = await getRecentActivities();
      socket.emit('live_activities', activities);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      activeSessions.delete(sessionId);
      activeEditors.delete(sessionId);
      io.emit('active_users_count', activeSessions.size);
      sendAdminStats(socket);
    });
  });

  // Helper function to get admin stats
  async function getAdminStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayVisits, todayPurchases, weekRevenue, monthRevenue] = await Promise.all([
      Analytics.countDocuments({ type: 'visit', createdAt: { $gte: todayStart } }),
      Analytics.countDocuments({ type: 'purchase', createdAt: { $gte: todayStart } }),
      Analytics.aggregate([
        { $match: { type: 'purchase', createdAt: { $gte: weekStart } } },
        { $group: { _id: null, total: { $sum: '$metadata.amount' } } }
      ]),
      Analytics.aggregate([
        { $match: { type: 'purchase', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$metadata.amount' } } }
      ])
    ]);

    const conversionRate = todayVisits > 0 ? ((todayPurchases / todayVisits) * 100).toFixed(2) : 0;

    return {
      activeUsers: activeSessions.size,
      activeEditors: activeEditors.size,
      totalVisitsToday: todayVisits,
      purchasesToday: todayPurchases,
      conversionRate: parseFloat(conversionRate),
      revenueToday: await getRevenue(todayStart, now),
      revenueWeek: weekRevenue[0]?.total || 0,
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

  async function sendAdminStats(socket) {
    const stats = await getAdminStats();
    io.emit('admin_stats', stats);
  }

  async function getRecentActivities(limit = 20) {
    return await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email');
  }

  return io;
}