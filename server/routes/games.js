import express from 'express';
import EidiyaGame from '../models/EidiyaGame.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// @route   POST /api/v1/games
// @desc    Create a new Eidiya Game
// @access  Public (or semi-protected)
router.post('/', async (req, res) => {
    try {
        const { ownerName, title, questions, settings } = req.body;

        if (!ownerName || !questions || questions.length === 0) {
            return res.status(400).json({ success: false, error: 'الرجاء إدخال اسمك وإضافة أسئلة للعبة.' });
        }

        // Generate unique short game ID
        const gameId = nanoid(8);

        const newGame = new EidiyaGame({
            gameId,
            ownerName,
            title: title || 'تحدي العيدية',
            questions,
            settings: settings || {}
        });

        await newGame.save();

        res.status(201).json({
            success: true,
            data: {
                gameId: newGame.gameId,
                url: `/game/${newGame.gameId}`
            }
        });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء اللعبة.' });
    }
});

// @route   GET /api/v1/games/:gameId
// @desc    Get game details (excluding correct answers for security)
// @access  Public
router.get('/:gameId', async (req, res) => {
    try {
        const game = await EidiyaGame.findOne({ gameId: req.params.gameId });
        if (!game) {
            return res.status(404).json({ success: false, error: 'اللعبة غير موجودة.' });
        }

        // Sanitize questions to hide correctAnswerIndex
        const sanitizedQuestions = game.questions.map((q, idx) => ({
            _id: q._id,
            index: idx,
            questionText: q.questionText,
            answers: q.answers,
            rewardAmount: q.rewardAmount
        }));

        res.json({
            success: true,
            data: {
                gameId: game.gameId,
                ownerName: game.ownerName,
                title: game.title,
                description: game.description,
                settings: game.settings,
                questions: sanitizedQuestions
            }
        });
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحميل اللعبة.' });
    }
});

// @route   POST /api/v1/games/:gameId/submit
// @desc    Submit an answer and check if it's correct
// @access  Public
router.post('/:gameId/submit', async (req, res) => {
    try {
        const { questionIndex, answerIndex } = req.body;

        const game = await EidiyaGame.findOne({ gameId: req.params.gameId });
        if (!game) {
            return res.status(404).json({ success: false, error: 'اللعبة غير موجودة' });
        }

        const question = game.questions[questionIndex];
        if (!question) {
            return res.status(400).json({ success: false, error: 'السؤال غير صالح' });
        }

        const isCorrect = question.correctAnswerIndex === answerIndex;

        res.json({
            success: true,
            data: {
                isCorrect,
                correctAnswerIndex: question.correctAnswerIndex, // Return the correct one after answering
                rewardAmount: isCorrect ? question.rewardAmount : 0
            }
        });
    } catch (error) {
        console.error('Error checking answer:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحقق من الإجابة' });
    }
});

// @route   POST /api/v1/games/:gameId/finish
// @desc    Finish game and save player score
// @access  Public
router.post('/:gameId/finish', async (req, res) => {
    try {
        const { playerName, score, totalEarned } = req.body;

        if (!playerName) {
            return res.status(400).json({ success: false, error: 'يجب إدخال اسم اللاعب.' });
        }

        const game = await EidiyaGame.findOne({ gameId: req.params.gameId });
        if (!game) {
            return res.status(404).json({ success: false, error: 'اللعبة غير موجودة.' });
        }

        // Add to leaderboard
        game.players.push({
            playerName,
            score,
            totalEarned,
            status: 'completed',
            completedAt: new Date()
        });

        await game.save();

        res.json({ success: true, message: 'تم حفظ نتيجتك بنجاح.' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء حفظ النتيجة.' });
    }
});

// @route   GET /api/v1/games/:gameId/leaderboard
// @desc    Get top players for a specific game
// @access  Public
router.get('/:gameId/leaderboard', async (req, res) => {
    try {
        const game = await EidiyaGame.findOne({ gameId: req.params.gameId });
        if (!game) {
            return res.status(404).json({ success: false, error: 'اللعبة غير موجودة.' });
        }

        // Sort players by score (descending) and then totalEarned (descending)
        const sortedPlayers = game.players
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return b.totalEarned - a.totalEarned;
            })
            .map(p => ({
                playerName: p.playerName,
                score: p.score,
                totalEarned: p.totalEarned,
                completedAt: p.completedAt
            }));

        res.json({
            success: true,
            data: sortedPlayers
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب لوحة الصدارة.' });
    }
});

export default router;
