import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBlogPostBySlug } from '../utils/api'
import { Loader2, ArrowRight, Calendar, User, Eye, ImageIcon, Share2 } from 'lucide-react'

export default function BlogPostPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadPost() {
            try {
                const res = await getBlogPostBySlug(slug)
                setPost(res.data)
            } catch (err) {
                setError('تعذر العثور على المقال')
            } finally {
                setLoading(false)
            }
        }
        loadPost()
    }, [slug])

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                text: 'اقرأ هذا المقال على سَلِّم',
                url: window.location.href,
            }).catch(console.error)
        }
    }

    if (loading) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#3b82f6] animate-spin mb-4" />
                <p className="text-white/50">جاري تحميل المقال...</p>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-2xl font-bold mb-4">عذراً! المقال غير موجود</h2>
                <p className="text-white/40 mb-8">{error}</p>
                <button onClick={() => navigate('/blog')} className="btn-primary">
                    <ArrowRight className="w-4 h-4 ml-2" /> العودة للمدونة
                </button>
            </div>
        )
    }

    return (
        <div className="pt-28 pb-20 min-h-screen relative">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3b82f6]/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Link to="/blog" className="inline-flex items-center text-white/50 hover:text-white mb-8 transition-colors text-sm font-medium">
                    <ArrowRight className="w-4 h-4 ml-2" /> العودة للقائمة
                </Link>

                {/* Article Header */}
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#3b82f6] text-xs font-bold mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">{post.title}</h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} قراءة</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                {post.imageUrl && (
                    <div className="w-full aspect-[21/9] md:aspect-[2.5/1] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Article Content */}
                <article className="prose prose-invert prose-blue max-w-none prose-lg">
                    <div className="whitespace-pre-wrap leading-relaxed text-white/80 font-normal">
                        {post.content}
                    </div>
                </article>

                {/* Footer actions */}
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors text-white/70">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-white/40 text-sm">
                        تم النشر في: {formatDate(post.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}
