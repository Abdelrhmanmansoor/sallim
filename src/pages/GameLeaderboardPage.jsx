import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStandaloneGameLeaderboard, getStandaloneGame } from '../utils/api';
import { Trophy, Medal, ArrowLeft, Loader2, Share2, Sparkles, User, Crown, Award } from 'lucide-react';

export default function GameLeaderboardPage() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [gameData, setGameData] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true);
                const [leaderboardRes, gameRes] = await Promise.all([
                    getStandaloneGameLeaderboard(gameId),
                    getStandaloneGame(gameId)
                ]);

                if (leaderboardRes.success) setLeaderboard(leaderboardRes.data);
                if (gameRes.success) setGameData(gameRes.data);

                // Get current player from localStorage
                const playerKey = `game_${gameId}_player`;
                const playerData = localStorage.getItem(playerKey);
                if (playerData) {
                    const player = JSON.parse(playerData);
                    setCurrentPlayer(player);
                }
            } catch (err) {
                console.error(err);
                setError('حدث خطأ أثناء تحميل الترتيب');
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, [gameId]);

    // Find current player's rank
    const currentPlayerRank = currentPlayer ? leaderboard.findIndex(p => p.playerName === currentPlayer.playerName) : -1;
    const currentPlayerData = currentPlayerRank >= 0 ? leaderboard[currentPlayerRank] : null;

    const handleShare = () => {
        const text = encodeURIComponent(`🏆 ترتيب أبطال تحدي العيدية من ${gameData?.ownerName || 'سَلِّم'}!\nشوف الترتيب وشارك الآن:\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                <Loader2 size={48} color="#FF8C00" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: "'Tajawal', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
                    <h2 style={{ fontSize: '24px', color: '#dc2626', marginBottom: '16px' }}>{error}</h2>
                    <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: '#171717', color: '#fff', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    const currency = gameData?.settings?.currency || 'ريال';

    return (
        <div style={{ fontFamily: "'Tajawal', sans-serif", background: '#fafafa', minHeight: '100vh', paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{ background: '#171717', padding: 'clamp(40px, 8vw, 60px) 24px', textAlign: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate(`/`)}
                    style={{ position: 'absolute', top: 'clamp(16px, 3vw, 24px)', right: 'clamp(16px, 3vw, 24px)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, transition: 'all 200ms ease', fontSize: '14px' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <ArrowLeft size={16} /> رجوع
                </button>
                
                <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                    <Trophy size={28} color="#FFD700" />
                </div>

                <h1 style={{ fontSize: 'clamp(24px, 6vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
                    لوحة الصدارة
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(14px, 3vw, 18px)', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.5 }}>
                    {gameData?.title} مُقدمة من {gameData?.ownerName}
                </p>
                
                <button
                    onClick={handleShare}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '100px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,211,102,0.3)', transition: 'all 200ms ease' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,211,102,0.3)'
                    }}
                >
                    <Share2 size={18} /> شارك الترتيب مع العائلة
                </button>
            </header>

            {/* Current Player Card - Shows prominently if player exists */}
            {currentPlayerData && currentPlayerRank >= 0 && (
                <div style={{
                    maxWidth: '600px',
                    margin: '-40px auto 20px',
                    padding: '0 24px',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                        borderRadius: '20px',
                        padding: '28px',
                        color: '#fff',
                        boxShadow: '0 10px 40px rgba(255,140,0,0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: 'absolute',
                            top: '-30px',
                            right: '-30px',
                            width: '120px',
                            height: '120px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: '-30px',
                            width: '100px',
                            height: '100px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        background: 'rgba(255,255,255,0.2)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '4px', fontWeight: 600 }}>
                                            🎮 مستواك الحالي
                                        </div>
                                        <div style={{ fontSize: '20px', fontWeight: 800 }}>
                                            {currentPlayerData.playerName}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1 }}>
                                        #{currentPlayerRank + 1}
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>
                                        ترتيبك
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                padding: '20px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '28px' }}>💰</span>
                                        <span style={{ fontSize: '16px', fontWeight: 600 }}>عيديتك المستحقة:</span>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '28px', fontWeight: 900, lineHeight: 1 }}>
                                            {currentPlayerData.totalEarned}
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{currency}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Leaderboard List */}
            <main style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
                {leaderboard.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #e5e5e5' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>😴</div>
                        <h3 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: '#171717', marginBottom: '12px' }}>
                            لا يوجد مشاركين حتى الآن
                        </h3>
                        <p style={{ fontSize: '15px', color: '#737373', marginBottom: '32px', lineHeight: 1.6 }}>
                            كن أول من يلعب التحدي ويحصد العيدية!
                        </p>
                        <button
                            onClick={() => navigate(`/game/${gameId}`)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,140,0,0.3)', transition: 'all 200ms ease' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,140,0,0.4)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,140,0,0.3)'
                            }}
                        >
                            <Sparkles size={18} /> ابدأ اللعب
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {leaderboard.map((player, index) => {
                            const isTop3 = index < 3;
                            const medals = ['🥇', '🥈', '🥉'];

                            return (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '20px 24px',
                                        background: '#fff',
                                        borderRadius: '16px',
                                        border: isTop3 ? '2px solid transparent' : '1px solid #e5e5e5',
                                        boxShadow: isTop3 ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 200ms ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = isTop3 ? 'translateY(-4px)' : 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = isTop3 ? '0 12px 32px rgba(0,0,0,0.12)' : '0 8px 20px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isTop3 ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.02)';
                                    }}
                                >
                                    {/* Top 3 accent bars */}
                                    {isTop3 && (
                                        <>
                                            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '4px', background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }} />
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', background: index === 0 ? 'linear-gradient(90deg, rgba(255,215,0,0.05) 0%, transparent 100%)' : index === 1 ? 'linear-gradient(90deg, rgba(192,192,192,0.05) 0%, transparent 100%)' : 'linear-gradient(90deg, rgba(205,115,50,0.05) 0%, transparent 100%)' }} />
                                        </>
                                    )}

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                                        <div style={{ 
                                            width: '52px', 
                                            height: '52px', 
                                            borderRadius: '50%', 
                                            background: isTop3 ? '#fff9c4' : '#f5f5f5', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            fontSize: '24px', 
                                            fontWeight: 800, 
                                            color: '#171717',
                                            border: isTop3 ? `2px solid ${index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}` : 'none'
                                        }}>
                                            {isTop3 ? medals[index] : index + 1}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>{player.playerName}</h3>
                                            <div style={{ fontSize: '14px', color: '#737373', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Medal size={14} /> أتم {player.score} سؤال
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'left', position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '26px', fontWeight: 800, color: isTop3 ? '#FF8C00' : '#171717', lineHeight: 1 }}>
                                            {player.totalEarned}
                                        </div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#737373' }}>{currency}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}