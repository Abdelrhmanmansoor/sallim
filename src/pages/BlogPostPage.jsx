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
            <div className="pt-16 pb-20 min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
                <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin mb-4" />
                <p className="text-[#64748b]">جاري تحميل المقال...</p>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="pt-16 pb-20 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#f8fafc]">
                <h2 className="text-2xl font-bold mb-4 text-[#0f172a]">عذراً! المقال غير موجود</h2>
                <p className="text-[#64748b] mb-8">{error}</p>
                <button onClick={() => navigate('/blog')} className="btn-primary">
                    <ArrowRight className="w-4 h-4 ml-2" /> العودة للمدونة
                </button>
            </div>
        )
    }

    return (
        <div className="pt-28 pb-20 min-h-screen relative bg-[#f8fafc]">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <Link to="/blog" className="inline-flex items-center text-[#64748b] hover:text-[#0f172a] mb-8 transition-colors text-sm font-medium">
                    <ArrowRight className="w-4 h-4 ml-2" /> العودة للقائمة
                </Link>

                {/* Article Header */}
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#1e293b]/5 border border-[#1e293b]/10 text-[#2563eb] text-xs font-bold mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-[#0f172a]">{post.title}</h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748b]">
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
                <article className="prose prose-blue max-w-none prose-lg">
                    <div className="whitespace-pre-wrap leading-relaxed text-[#0f172a] font-normal">
                        {post.content}
                    </div>
                </article>

                {/* Footer actions */}
                <div className="mt-16 pt-8 border-t border-[#e2e8f0] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={handleShare} className="w-10 h-10 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#cbd5e1] flex items-center justify-center transition-colors text-[#64748b]">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-[#64748b] text-sm">
                        تم النشر في: {formatDate(post.createdAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}
