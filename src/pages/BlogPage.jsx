import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBlogPosts } from '../utils/api'
import { Loader2, Calendar, Eye, ArrowLeft, Image as ImageIcon } from 'lucide-react'

export default function BlogPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await getBlogPosts()
                setPosts(res.data || [])
            } catch (err) {
                setError('حدث خطأ أثناء جلب المقالات')
            } finally {
                setLoading(false)
            }
        }
        loadPosts()
    }, [])

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
    }

    return (
        <div className="pt-8 pb-20 min-h-screen relative overflow-hidden bg-[#f8fafc]">
            {/* Background decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2563eb]/5 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b]/5 border border-[#1e293b]/10 text-[#64748b] text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse"></span>
                        المدونة والأخبار
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#0f172a]">آخر <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-purple-600">التحديثات والمقالات</span></h1>
                    <p className="text-[#64748b] text-lg max-w-2xl mx-auto leading-relaxed">
                        اكتشف أحدث الميزات، النصائح المفيدة، وأخبار منصة سَلِّم.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin mb-4" />
                        <p className="text-[#64748b]">جاري تحميل المقالات...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-secondary-light">إعادة المحاولة</button>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-[#e2e8f0] rounded-3xl shadow-sm">
                        <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ImageIcon className="w-8 h-8 text-[#94a3b8]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#0f172a]">لا توجد مقالات حالياً</h3>
                        <p className="text-[#64748b]">يرجى العودة لاحقاً للحصول على أحدث التحديثات.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <Link key={post._id} to={`/blog/${post.slug}`} className="group bg-white border border-[#e2e8f0] shadow-sm rounded-3xl overflow-hidden hover:border-[#cbd5e1] hover:shadow-md transition-all hover:-translate-y-1 block flex flex-col">
                                <div className="aspect-[16/10] bg-[#f8fafc] relative overflow-hidden shrink-0">
                                    {post.imageUrl ? (
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
                                            <ImageIcon className="w-10 h-10 text-[#cbd5e1]" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#e2e8f0] text-[#0f172a] shadow-sm text-xs font-medium">
                                        {post.category}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-[#64748b] text-[11px] mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>{post.views}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#0f172a] mb-3 line-clamp-2 group-hover:text-[#2563eb] transition-colors">{post.title}</h3>
                                    <p className="text-[#64748b] text-sm leading-[1.8] line-clamp-3 mb-6 mt-auto">
                                        {post.content.replace(/<[^>]+>/g, '') /* Simple strip tags */}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f1f5f9]">
                                        <span className="text-[#64748b] text-sm font-medium">{post.author}</span>
                                        <span className="text-[#2563eb] text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
