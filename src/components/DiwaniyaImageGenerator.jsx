import { Download, Share2, MessageCircle, Twitter, Instagram, Facebook } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useState } from 'react';

export default function DiwaniyaImageGenerator({ diwaniya, greeting }) {
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const generateImage = async () => {
        setGenerating(true);
        const element = document.getElementById('diwaniya-card');
        
        try {
            const canvas = await html2canvas(element, {
                width: 1080,
                height: 1080,
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            const image = canvas.toDataURL('image/png');
            setGeneratedImage(image);
            setGenerating(false);
        } catch (error) {
            console.error('Error generating image:', error);
            setGenerating(false);
        }
    };

    const downloadImage = () => {
        if (!generatedImage) {
            generateImage().then(() => {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `تهنئة-العيد-${diwaniya.ownerName}.png`;
                    link.click();
                }, 500);
            });
        } else {
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `تهنئة-العيد-${diwaniya.ownerName}.png`;
            link.click();
        }
    };

    const shareToWhatsApp = () => {
        const text = `🎉 عيدكم مبارك! 🎉\n\n"${greeting.message}"\n\nأرسل تهنئتك: ${window.location.origin}/eid/${diwaniya.username}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const shareToTwitter = () => {
        const text = `🎉 عيدكم مبارك! 🎉\n\n"${greeting.message}"\n\nأرسل تهنئتك: ${window.location.origin}/eid/${diwaniya.username}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    };

    const shareToInstagram = () => {
        alert('لمشاركة على Instagram، قم بتحميل الصورة ثم مشاركتها من التطبيق');
    };

    return (
        <div>
            {/* Hidden card for image generation */}
            <div
                id="diwaniya-card"
                style={{
                    position: 'fixed',
                    top: '-9999px',
                    left: '-9999px',
                    width: '1080px',
                    height: '1080px',
                    background: '#fff',
                    direction: 'rtl',
                    fontFamily: "'Tajawal', sans-serif"
                }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #171717 0%, #2d2d2d 100%)',
                    padding: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '400px',
                        height: '400px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '50%',
                        transform: 'translate(200px, -200px)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '50%',
                        transform: 'translate(-150px, 150px)'
                    }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '12px 32px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '100px',
                            marginBottom: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            <span style={{ fontSize: '20px', color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>
                                ديوانية العيد
                            </span>
                        </div>
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: 700,
                            color: '#fff',
                            marginBottom: '12px',
                            lineHeight: 1.2
                        }}>
                            {diwaniya.ownerName}
                        </h1>
                        <p style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            /{diwaniya.username}
                        </p>
                    </div>

                    {/* Greeting */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '48px 64px',
                        maxWidth: '800px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 1
                    }}>
                        <div style={{
                            fontSize: '32px',
                            color: '#fff',
                            lineHeight: 1.8,
                            fontWeight: 500
                        }}>
                            "{greeting.message}"
                        </div>
                        {greeting.senderName && !greeting.isAnonymous && (
                            <div style={{
                                marginTop: '24px',
                                fontSize: '20px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontWeight: 600
                            }}>
                                — {greeting.senderName}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', zIndex: 1 }}>
                        <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.6)' }}>
                            أرسل تهنئتك الآن
                        </p>
                        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '12px' }}>
                            {window.location.origin}/eid/{diwaniya.username}
                        </p>
                    </div>
                </div>
            </div>

            {/* Share Buttons */}
            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <button
                    onClick={downloadImage}
                    disabled={generating}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#171717',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        border: 'none',
                        cursor: generating ? 'not-allowed' : 'pointer',
                        transition: 'all 200ms ease',
                        opacity: generating ? 0.7 : 1
                    }}
                >
                    <Download size={18} />
                    {generating ? 'جاري الإنشاء...' : 'تحميل الصورة'}
                </button>

                <button
                    onClick={shareToWhatsApp}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#25D366',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                    }}
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </button>

                <button
                    onClick={shareToTwitter}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#1DA1F2',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                    }}
                >
                    <Twitter size={18} />
                    X (Twitter)
                </button>

                <button
                    onClick={shareToFacebook}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#1877F2',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                    }}
                >
                    <Facebook size={18} />
                    Facebook
                </button>

                <button
                    onClick={shareToInstagram}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#E4405F',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 600,
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                    }}
                >
                    <Instagram size={18} />
                    Instagram
                </button>
            </div>
        </div>
    );
}