import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import EidiyaGame from '../components/EidiyaGame'

export default function StandaloneEidiyaGamePage() {
    const { gameId } = useParams()
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: '#fafafa', position: 'relative' }}>
            {/* Absolute back button to Home */}
            <button
                onClick={() => navigate(`/`)}
                style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontFamily: "'Tajawal', sans-serif",
                    fontWeight: 600,
                    color: '#171717',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                <ArrowLeft size={20} />
                خروج من اللعبة
            </button>

            {/* Main Game Container */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '100px 24px 60px',
            }}>
                <EidiyaGame gameId={gameId} />
            </div>
        </div>
    )
}
