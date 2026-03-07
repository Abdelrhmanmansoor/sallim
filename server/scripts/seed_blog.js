import 'dotenv/config'
import mongoose from 'mongoose'
import Post from '../models/Post.js'
import connectDB from '../config/db.js'

const seoPosts = [
    {
        title: "أفضل 5 طرق لجذب العملاء في الأعياد",
        slug: "top-5-ways-to-attract-customers-eid",
        content: "في مواسم الأعياد، تزداد المنافسة بين الشركات. من الضروري تقديم قيمة مضافة لعملائك عن طريق إنشاء بطاقات تهنئة حصرية، إرسال هدايا ترويجية، وتقديم خصومات. باستخدام سَلِّم، يمكنك إنشاء بطاقات العيد بشعارك خلال دقائق، مما يعزز ولاء عملائك.",
        author: "خبير سيو سَلِّم",
        status: "published",
        category: "نصائح أعمال",
        views: 0
    },
    {
        title: "أهمية الهوية البصرية للشركات في التواصل",
        slug: "importance-of-visual-identity-companies",
        content: "دائماً ما يترك الانطباع الأول أثراً كبيراً. التواصل עם العملاء بهويتك البصرية من خلال رسائل مخصصة يجعل علامتك التجارية محفورة في أذهانهم. تعرف كيف تساعدك منصة سَلِّم في المحافظة على تناسق ألوان وشعار شركتك في كل بطاقة تهنئة.",
        author: "خبير سيو سَلِّم",
        status: "published",
        category: "الهوية التجارية",
        views: 0
    },
    {
        title: "كيف تساهم رسائل التهنئة في زيادة المبيعات؟",
        slug: "how-greetings-increase-sales",
        content: "إن إظهار التقدير للعملاء في المناسبات يبني علاقة عاطفية مع علامتك التجارية. العميل المخلص سيشتري مرة أخرى ويوصي بخدماتك للآخرين. استغل نماذج التهنئة المتنوعة في سَلِّم لبناء هذه العلاقة الثابتة مع جمهورك.",
        author: "خبير سيو سَلِّم",
        status: "published",
        category: "تسويق",
        views: 0
    },
    {
        title: "دليلك الشامل لإنشاء بطاقة إلكترونية احترافية",
        slug: "comprehensive-guide-create-ecard",
        content: "إنشاء البطاقات الإلكترونية لا يتطلب خبرة تصميم بفضل أدوات اليوم. في هذا المقال نشرح لك خطوة بخطوة كيف توظف منصة سَلِّم لاختيار قالب مناسب، إضافة نصوص مؤثرة، ورفع شعارك لتصميم معايدة تليق بشركتك.",
        author: "خبير سيو سَلِّم",
        status: "published",
        category: "شروحات",
        views: 0
    },
    {
        title: "لماذا سَلِّم هي الخيار الأفضل لإصدار بطاقات العيد؟",
        slug: "why-sallim-is-best-for-eid-cards",
        content: "تقدم سَلِّم مميزات متكاملة لا توجد في أي منصة أخرى: إدارة سهلة، دعم لإضافة أسماء المستلمين تلقائياً عبر روابط، إمكانيات بريميوم، وتقارير شاملة للشركات لمعرفة حجم وصول الرسائل. انضم إلينا اليوم وغير أسلوب شركتك في المشاركة.",
        author: "خبير سيو سَلِّم",
        status: "published",
        category: "منصة سَلِّم",
        views: 0
    }
];

async function seed() {
    try {
        await connectDB();
        console.log("Connected to MongoDB. Inserting posts...");

        for (const post of seoPosts) {
            await Post.findOneAndUpdate(
                { slug: post.slug },
                post,
                { upsert: true, new: true }
            );
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding posts:", err);
        process.exit(1);
    }
}

seed();
