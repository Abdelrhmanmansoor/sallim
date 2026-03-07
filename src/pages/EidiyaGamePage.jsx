import { useState } from 'react'
import { BsWhatsapp, BsTwitterX, BsArrowLeft, BsStars, BsCoin, BsClock, BsLightning } from 'react-icons/bs'

// ═══════════════════════════════════════════════════════════════════════════════
//   MEGA QUESTION BANK - 85+ Saudi Eid Situations
// ═══════════════════════════════════════════════════════════════════════════════

const megaQuestionBank = {
  
  // ═══════════════════════════════════════════
  // CATEGORY 1: صباح العيد (8 questions)
  // ═══════════════════════════════════════════
  morning: {
    title: "صباح العيد",
    emoji: "🌅",
    color: "#f59e0b",
    questions: [
      {
        q: "الساعة كم صحيت يوم العيد؟",
        emoji: "⏰",
        options: [
          { text: "قبل الفجر! لازم أكون جاهز", points: 30, trait: "disciplined" },
          { text: "مع أذان الفجر", points: 25, trait: "spiritual" },
          { text: "الساعة 8 الصبح", points: 15, trait: "normal" },
          { text: "الظهر وبعدين 😴", points: 0, trait: "lazy" },
        ]
      },
      {
        q: "أول شي سويته لما فتحت عيونك؟",
        emoji: "👀",
        options: [
          { text: "قلت أذكار الصباح", points: 30, trait: "spiritual" },
          { text: "فتحت الجوال أشوف الرسايل", points: 15, trait: "connected" },
          { text: "رحت الحمام على طول", points: 20, trait: "practical" },
          { text: "رجعت نمت 5 دقايق 😂", points: 5, trait: "lazy" },
        ]
      },
      {
        q: "وش لبست يوم العيد؟",
        emoji: "👔",
        options: [
          { text: "ثوب جديد + شماغ + بشت", points: 30, trait: "traditional" },
          { text: "ثوب جديد بس", points: 25, trait: "smart" },
          { text: "ثوب قديم نظيف", points: 15, trait: "practical" },
          { text: "بنطلون وتيشيرت 🤷", points: 5, trait: "casual" },
        ]
      },
      {
        q: "هل حلقت أو رتبت شعرك؟",
        emoji: "💈",
        options: [
          { text: "رحت الحلاق من قبل العيد", points: 30, trait: "prepared" },
          { text: "حلقت في البيت الصبح", points: 20, trait: "practical" },
          { text: "مسحت شعري بالماي وخلاص", points: 10, trait: "lazy" },
          { text: "طلعت زي ما أنا 😂", points: 0, trait: "careless" },
        ]
      },
      {
        q: "وش كان فطورك يوم العيد؟",
        emoji: "🍳",
        options: [
          { text: "فطور كامل مع العيلة", points: 30, trait: "family" },
          { text: "تمر وقهوة", points: 25, trait: "traditional" },
          { text: "أي شي لقيته بالثلاجة", points: 15, trait: "practical" },
          { text: "ما فطرت، رحت على طول", points: 10, trait: "rushed" },
        ]
      },
      {
        q: "مين أول واحد عيدت عليه؟",
        emoji: "🤗",
        options: [
          { text: "أمي وأبوي", points: 30, trait: "respectful" },
          { text: "جدي وجدتي", points: 30, trait: "respectful" },
          { text: "إخواني وأخواتي", points: 25, trait: "family" },
          { text: "الناس بالواتساب 📱", points: 10, trait: "digital" },
        ]
      },
      {
        q: "هل صليت صلاة العيد؟",
        emoji: "🕌",
        options: [
          { text: "إي في المسجد مع الجماعة", points: 30, trait: "spiritual" },
          { text: "صليتها في البيت", points: 20, trait: "spiritual" },
          { text: "للأسف فاتتني", points: 10, trait: "honest" },
          { text: "نسيت إن اليوم عيد 💀", points: 0, trait: "forgetful" },
        ]
      },
      {
        q: "هل ساعدت أمك في تجهيزات العيد؟",
        emoji: "🏠",
        options: [
          { text: "إي! ساعدتها في كل شي", points: 30, trait: "helpful" },
          { text: "ساعدت شوي", points: 20, trait: "moderate" },
          { text: "قالت ما تبي مساعدة", points: 15, trait: "passive" },
          { text: "كنت نايم 😅", points: 5, trait: "lazy" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 2: الزيارات العائلية (12 questions)
  // ═══════════════════════════════════════════
  family: {
    title: "الزيارات والأقارب",
    emoji: "👨‍👩‍👧‍👦",
    color: "#10b981",
    questions: [
      {
        q: "كم بيت زرت يوم العيد؟",
        emoji: "🏠",
        options: [
          { text: "فوق 10 بيوت! 🏃", points: 30, trait: "social" },
          { text: "5-10 بيوت", points: 25, trait: "active" },
          { text: "2-4 بيوت", points: 15, trait: "selective" },
          { text: "بيت واحد أو ما طلعت", points: 5, trait: "introverted" },
        ]
      },
      {
        q: "خالتك سألتك 'متى بتتزوج؟' وش قلت؟",
        emoji: "💍",
        options: [
          { text: "إن شاء الله قريب يا خالة", points: 25, trait: "diplomatic" },
          { text: "لما ألقى النصيب", points: 20, trait: "honest" },
          { text: "غيرت الموضوع بسرعة", points: 15, trait: "avoidant" },
          { text: "وأنتِ متى بتوقفين السؤال؟ 😂", points: 10, trait: "savage" },
        ]
      },
      {
        q: "جدتك أصرت تاكل عندها وأنت شبعان، وش سويت؟",
        emoji: "🍚",
        options: [
          { text: "أكلت كل شي عشان خاطرها", points: 30, trait: "respectful" },
          { text: "أكلت شوي وشكرتها", points: 25, trait: "balanced" },
          { text: "اعتذرت بلطف", points: 15, trait: "honest" },
          { text: "هربت قبل ما تجيب الأكل 😂", points: 5, trait: "sneaky" },
        ]
      },
      {
        q: "قريبك اللي ما تطيقه جا يسلم، وش سويت؟",
        emoji: "😬",
        options: [
          { text: "سلمت عليه بحرارة واحترام", points: 30, trait: "mature" },
          { text: "سلمت عليه على السريع", points: 20, trait: "practical" },
          { text: "تظاهرت إني مشغول", points: 10, trait: "avoidant" },
          { text: "رحت الحمام لين راح 🚽", points: 5, trait: "childish" },
        ]
      },
      {
        q: "طفل صغير ضربك أو عضك، وش ردة فعلك؟",
        emoji: "👶",
        options: [
          { text: "ضحكت ولعبت معاه", points: 30, trait: "patient" },
          { text: "ابتسمت وتجاهلته", points: 20, trait: "calm" },
          { text: "ناديت أمه تاخذه", points: 15, trait: "practical" },
          { text: "عطيته نظرة تخوف 👁️", points: 5, trait: "scary" },
        ]
      },
      {
        q: "كم ساعة قضيت في بيت جدك/جدتك؟",
        emoji: "👴",
        options: [
          { text: "أكثر من 4 ساعات", points: 30, trait: "family" },
          { text: "2-4 ساعات", points: 25, trait: "balanced" },
          { text: "ساعة أو أقل", points: 15, trait: "busy" },
          { text: "ما رحت لهم 😔", points: 5, trait: "disconnected" },
        ]
      },
      {
        q: "قريبتك تتكلم عن أخبار ما تهمك، وش سويت؟",
        emoji: "🗣️",
        options: [
          { text: "سمعتها باهتمام", points: 30, trait: "polite" },
          { text: "تظاهرت بالاهتمام", points: 20, trait: "diplomatic" },
          { text: "قلت 'آها آها' وأنا سرحان", points: 15, trait: "honest" },
          { text: "قاطعتها وغيرت الموضوع", points: 5, trait: "rude" },
        ]
      },
      {
        q: "شفت قريب ما تعرفه، وش سويت؟",
        emoji: "🤔",
        options: [
          { text: "سلمت عليه وتعرفت عليه", points: 30, trait: "social" },
          { text: "سلمت بشكل عام", points: 20, trait: "polite" },
          { text: "ابتسمت من بعيد", points: 15, trait: "shy" },
          { text: "تجاهلته تماماً", points: 5, trait: "antisocial" },
        ]
      },
      {
        q: "الأطفال طلبوا تلعب معاهم، وش سويت؟",
        emoji: "🎮",
        options: [
          { text: "لعبت معاهم وانبسطت", points: 30, trait: "playful" },
          { text: "لعبت شوي عشان خاطرهم", points: 25, trait: "kind" },
          { text: "اعتذرت بلطف", points: 15, trait: "busy" },
          { text: "قلت لهم روحوا العبوا بعيد 😅", points: 5, trait: "grumpy" },
        ]
      },
      {
        q: "أحد بدأ يتكلم في السياسة، وش سويت؟",
        emoji: "📰",
        options: [
          { text: "غيرت الموضوع بذكاء", points: 30, trait: "wise" },
          { text: "سكت وسمعت", points: 20, trait: "neutral" },
          { text: "شاركت برأيي", points: 15, trait: "bold" },
          { text: "قمت ورحت مكان ثاني", points: 10, trait: "avoidant" },
        ]
      },
      {
        q: "نسيت اسم قريبك، وش سويت؟",
        emoji: "😳",
        options: [
          { text: "سألت أحد بالسر", points: 20, trait: "smart" },
          { text: "قلت 'هلا والله' بدون اسم", points: 25, trait: "smooth" },
          { text: "اعترفت إني نسيت", points: 30, trait: "honest" },
          { text: "قلت اسم غلط 💀", points: 5, trait: "unlucky" },
        ]
      },
      {
        q: "شفت خلاف بين قريبين، وش سويت؟",
        emoji: "⚡",
        options: [
          { text: "حاولت أصلح بينهم", points: 30, trait: "peacemaker" },
          { text: "بعدت عن الموقف", points: 20, trait: "wise" },
          { text: "قعدت أتفرج 👀", points: 10, trait: "curious" },
          { text: "صورت الموقف 📱😂", points: 0, trait: "immature" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 3: العيديات (10 questions)
  // ═══════════════════════════════════════════
  eidiya: {
    title: "العيديات والفلوس",
    emoji: "💰",
    color: "#d4af37",
    questions: [
      {
        q: "كم كان مجموع عيدياتك هالسنة؟",
        emoji: "💵",
        options: [
          { text: "فوق 1000 ريال 🤑", points: 30, trait: "lucky" },
          { text: "500-1000 ريال", points: 25, trait: "good" },
          { text: "100-500 ريال", points: 15, trait: "okay" },
          { text: "أقل من 100 😢", points: 5, trait: "unlucky" },
        ]
      },
      {
        q: "أعلى عيدية وحدة كم كانت؟",
        emoji: "👑",
        options: [
          { text: "500 ريال أو أكثر", points: 30, trait: "blessed" },
          { text: "200-500 ريال", points: 25, trait: "good" },
          { text: "50-200 ريال", points: 15, trait: "normal" },
          { text: "أقل من 50 ريال", points: 5, trait: "modest" },
        ]
      },
      {
        q: "أحد عطاك 10 ريال، وش كان إحساسك؟",
        emoji: "🪙",
        options: [
          { text: "شكرته من قلبي", points: 30, trait: "grateful" },
          { text: "قلت شكراً بس من جوا 😐", points: 20, trait: "honest" },
          { text: "ابتسامة صفرا", points: 15, trait: "diplomatic" },
          { text: "رفضت آخذها 😂", points: 5, trait: "proud" },
        ]
      },
      {
        q: "وش سويت بأول عيدية أخذتها؟",
        emoji: "🤲",
        options: [
          { text: "حطيتها في المحفظة للادخار", points: 30, trait: "saver" },
          { text: "اشتريت فيها شي", points: 20, trait: "spender" },
          { text: "عطيتها أخوي الصغير", points: 25, trait: "generous" },
          { text: "ضاعت مني 💀", points: 0, trait: "careless" },
        ]
      },
      {
        q: "هل تحسب عيدياتك ولا تصرفها على طول؟",
        emoji: "🧮",
        options: [
          { text: "أحسبها وأدخرها", points: 30, trait: "organized" },
          { text: "أحسبها بس أصرفها", points: 20, trait: "aware" },
          { text: "ما أحسبها وأصرفها", points: 10, trait: "careless" },
          { text: "تخلص قبل ما أحسبها 😂", points: 5, trait: "spender" },
        ]
      },
      {
        q: "أحد نسي يعطيك عيدية، وش سويت؟",
        emoji: "🤨",
        options: [
          { text: "ما قلت شي، عادي", points: 30, trait: "humble" },
          { text: "ذكرته بطريقة غير مباشرة", points: 20, trait: "smart" },
          { text: "قعدت قدامه لين يتذكر 👁️", points: 15, trait: "persistent" },
          { text: "مديت يدي مباشرة 😂", points: 10, trait: "bold" },
        ]
      },
      {
        q: "هل عطيت أحد عيدية هالسنة؟",
        emoji: "🎁",
        options: [
          { text: "إي! كثير أطفال", points: 30, trait: "generous" },
          { text: "بس أطفال إخواني", points: 20, trait: "selective" },
          { text: "واحد أو اثنين", points: 15, trait: "minimal" },
          { text: "أنا اللي آخذ مو أعطي 😎", points: 5, trait: "taker" },
        ]
      },
      {
        q: "كم كانت العيدية اللي تعطيها للأطفال؟",
        emoji: "👶",
        options: [
          { text: "50 ريال أو أكثر", points: 30, trait: "generous" },
          { text: "20-50 ريال", points: 25, trait: "fair" },
          { text: "10-20 ريال", points: 15, trait: "modest" },
          { text: "5 ريال أو أقل 😅", points: 5, trait: "stingy" },
        ]
      },
      {
        q: "وش خطتك للعيديات؟",
        emoji: "📋",
        options: [
          { text: "أدخرها كلها", points: 30, trait: "saver" },
          { text: "أشتري شي أحتاجه", points: 25, trait: "practical" },
          { text: "أصرفها على نفسي", points: 15, trait: "selfcare" },
          { text: "ما عندي خطة، تروح بسرعة 😂", points: 5, trait: "impulsive" },
        ]
      },
      {
        q: "لو خيروك: عيدية كبيرة أو زيارات كثيرة؟",
        emoji: "⚖️",
        options: [
          { text: "الزيارات أهم من الفلوس", points: 30, trait: "family" },
          { text: "الاثنين مهمين", points: 25, trait: "balanced" },
          { text: "العيدية الكبيرة صراحة 💰", points: 15, trait: "honest" },
          { text: "ولا واحد، أبي أقعد في البيت 😴", points: 5, trait: "antisocial" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 4: الأكل والحلويات (8 questions)
  // ═══════════════════════════════════════════
  food: {
    title: "الأكل والحلويات",
    emoji: "🍰",
    color: "#ec4899",
    questions: [
      {
        q: "كم صحن حلا أكلت يوم العيد؟",
        emoji: "🍪",
        options: [
          { text: "صحن واحد بس", points: 20, trait: "controlled" },
          { text: "2-3 صحون", points: 25, trait: "moderate" },
          { text: "فوق 5 صحون", points: 15, trait: "indulgent" },
          { text: "وقفت العد 🤰", points: 10, trait: "foodie" },
        ]
      },
      {
        q: "وش أكثر حلا حبيته؟",
        emoji: "😋",
        options: [
          { text: "معمول وكليجا", points: 25, trait: "traditional" },
          { text: "شوكولاتة وحلويات غربية", points: 20, trait: "modern" },
          { text: "كيك وقاتو", points: 20, trait: "sweet" },
          { text: "كل شي! ما أقدر أختار", points: 25, trait: "foodie" },
        ]
      },
      {
        q: "لما قالوا 'الغدا جاهز' كنت وين؟",
        emoji: "🍽️",
        options: [
          { text: "أول واحد على السفرة 🏃", points: 15, trait: "hungry" },
          { text: "انتظرت الكبار يبدون", points: 30, trait: "respectful" },
          { text: "كنت آكل حلا، ما عندي جوع", points: 10, trait: "full" },
          { text: "كنت نايم 😴", points: 5, trait: "sleepy" },
        ]
      },
      {
        q: "هل ساعدت في ترتيب السفرة؟",
        emoji: "🍴",
        options: [
          { text: "إي! من البداية للنهاية", points: 30, trait: "helpful" },
          { text: "ساعدت شوي", points: 20, trait: "moderate" },
          { text: "بس في الأكل مو الترتيب 😅", points: 10, trait: "honest" },
          { text: "أنا ضيف!", points: 5, trait: "lazy" },
        ]
      },
      {
        q: "كم كوب شاي/قهوة شربت؟",
        emoji: "☕",
        options: [
          { text: "فوق 10 أكواب", points: 20, trait: "caffeine" },
          { text: "5-10 أكواب", points: 25, trait: "social" },
          { text: "2-4 أكواب", points: 25, trait: "moderate" },
          { text: "ما أشرب قهوة/شاي", points: 15, trait: "healthy" },
        ]
      },
      {
        q: "أكلت لين تعبت؟",
        emoji: "🤢",
        options: [
          { text: "لا، وقفت بالوقت المناسب", points: 30, trait: "controlled" },
          { text: "شوي زيادة بس عادي", points: 20, trait: "normal" },
          { text: "إي، ندمت بعدها 😅", points: 15, trait: "indulgent" },
          { text: "ما قدرت أتحرك من مكاني 💀", points: 5, trait: "extreme" },
        ]
      },
      {
        q: "وش أحسن أكلة عيد أكلتها هالسنة؟",
        emoji: "🏆",
        options: [
          { text: "كبسة العيد", points: 25, trait: "traditional" },
          { text: "مندي أو مضبي", points: 25, trait: "meat" },
          { text: "مشاوي", points: 25, trait: "bbq" },
          { text: "بيتزا دومينوز 🍕😂", points: 10, trait: "modern" },
        ]
      },
      {
        q: "هل أخذت أكل معك من بيوت الأقارب؟",
        emoji: "📦",
        options: [
          { text: "إي! علب كاملة", points: 25, trait: "practical" },
          { text: "شوية حلا بس", points: 20, trait: "moderate" },
          { text: "لا، كأني استحي", points: 15, trait: "shy" },
          { text: "هم اللي أصروا علي", points: 25, trait: "loved" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 5: السوشيال ميديا (8 questions)
  // ═══════════════════════════════════════════
  social_media: {
    title: "السوشيال ميديا",
    emoji: "📱",
    color: "#6366f1",
    questions: [
      {
        q: "كم رسالة تهنئة رسلت بالواتساب؟",
        emoji: "💬",
        options: [
          { text: "فوق 100 رسالة", points: 30, trait: "connected" },
          { text: "50-100 رسالة", points: 25, trait: "social" },
          { text: "10-50 رسالة", points: 20, trait: "selective" },
          { text: "أقل من 10", points: 10, trait: "minimal" },
        ]
      },
      {
        q: "هل كانت تهانيك شخصية أو منسوخة؟",
        emoji: "📋",
        options: [
          { text: "كلها شخصية ومختلفة", points: 30, trait: "thoughtful" },
          { text: "المقربين شخصية، الباقي منسوخة", points: 25, trait: "smart" },
          { text: "كلها منسوخة 😅", points: 15, trait: "practical" },
          { text: "ما رسلت أحد", points: 5, trait: "antisocial" },
        ]
      },
      {
        q: "نزلت ستوري يوم العيد؟",
        emoji: "📸",
        options: [
          { text: "إي! أكثر من 10 ستوريات", points: 20, trait: "active" },
          { text: "2-5 ستوريات", points: 25, trait: "moderate" },
          { text: "ستوري واحد بس", points: 25, trait: "minimal" },
          { text: "ما نزلت شي", points: 15, trait: "private" },
        ]
      },
      {
        q: "صورت مع الأهل والأقارب؟",
        emoji: "📷",
        options: [
          { text: "صور كثيرة جماعية", points: 30, trait: "family" },
          { text: "كم صورة بس", points: 25, trait: "moderate" },
          { text: "سلفي لحالي 😂", points: 15, trait: "solo" },
          { text: "ما صورت شي", points: 10, trait: "private" },
        ]
      },
      {
        q: "أحد رسلك تهنئة منسوخة، وش سويت؟",
        emoji: "🔄",
        options: [
          { text: "رديت بتهنئة شخصية", points: 30, trait: "kind" },
          { text: "رديت بنفس الطريقة، نسخ ولصق", points: 20, trait: "practical" },
          { text: "رديت بإيموجي 👍", points: 15, trait: "lazy" },
          { text: "ما رديت", points: 5, trait: "rude" },
        ]
      },
      {
        q: "كم ساعة قضيت على جوالك يوم العيد؟",
        emoji: "⏱️",
        options: [
          { text: "أقل من ساعة", points: 30, trait: "present" },
          { text: "1-3 ساعات", points: 25, trait: "balanced" },
          { text: "3-6 ساعات", points: 15, trait: "connected" },
          { text: "فوق 6 ساعات 📱", points: 5, trait: "addicted" },
        ]
      },
      {
        q: "رديت على كل التهاني اللي وصلتك؟",
        emoji: "✉️",
        options: [
          { text: "إي! كل واحد لحاله", points: 30, trait: "dedicated" },
          { text: "أغلبهم", points: 25, trait: "good" },
          { text: "المهمين بس", points: 15, trait: "selective" },
          { text: "نسيت أرد 😅", points: 5, trait: "forgetful" },
        ]
      },
      {
        q: "هل استخدمت فلتر عيد في صورك؟",
        emoji: "✨",
        options: [
          { text: "إي! يحلي الصور", points: 20, trait: "fun" },
          { text: "مرة أو مرتين", points: 25, trait: "moderate" },
          { text: "لا، أفضل الصور الطبيعية", points: 25, trait: "natural" },
          { text: "ما ألقيت فلتر حلو", points: 15, trait: "picky" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 6: المواقف المحرجة (8 questions)
  // ═══════════════════════════════════════════
  awkward: {
    title: "المواقف المحرجة",
    emoji: "😳",
    color: "#ef4444",
    questions: [
      {
        q: "أكلت شي وطلع مو لذيذ قدام اللي سواه، وش سويت؟",
        emoji: "🤮",
        options: [
          { text: "كملت وقلت لذيذ", points: 25, trait: "polite" },
          { text: "توقفت بس ما قلت شي", points: 20, trait: "neutral" },
          { text: "قلت بصراحة مو حلو", points: 15, trait: "honest" },
          { text: "وجهي فضحني 😅", points: 20, trait: "expressive" },
        ]
      },
      {
        q: "انفجرت تضحك في وقت غلط، وش سويت؟",
        emoji: "😂",
        options: [
          { text: "اعتذرت وتمالكت نفسي", points: 25, trait: "mature" },
          { text: "حولتها لكحة 😅", points: 20, trait: "creative" },
          { text: "كملت ضحك وخلاص", points: 15, trait: "carefree" },
          { text: "طلعت من المكان", points: 20, trait: "embarrassed" },
        ]
      },
      {
        q: "أحد سألك سؤال محرج قدام الناس، وش سويت؟",
        emoji: "🙈",
        options: [
          { text: "جاوبت بكل ثقة", points: 30, trait: "confident" },
          { text: "غيرت الموضوع بذكاء", points: 25, trait: "smart" },
          { text: "ضحكت وما جاوبت", points: 20, trait: "avoidant" },
          { text: "احمر وجهي 😳", points: 15, trait: "shy" },
        ]
      },
      {
        q: "جاك اتصال وأنت في جلسة، وش سويت؟",
        emoji: "📞",
        options: [
          { text: "رفضت ورديت بعدين", points: 30, trait: "polite" },
          { text: "رديت بسرعة وقفلت", points: 20, trait: "busy" },
          { text: "طلعت أرد برا", points: 25, trait: "considerate" },
          { text: "رديت وتكلمت عادي 😬", points: 10, trait: "rude" },
        ]
      },
      {
        q: "أحد جاب سيرة شخص تكرهه، وش سويت؟",
        emoji: "😒",
        options: [
          { text: "ما قلت شي سيء عنه", points: 30, trait: "mature" },
          { text: "غيرت الموضوع", points: 25, trait: "smart" },
          { text: "سكت وسمعت بس", points: 20, trait: "neutral" },
          { text: "فضفضت كل اللي عندي 😈", points: 5, trait: "gossip" },
        ]
      },
      {
        q: "وقعت أو تعثرت قدام الناس، وش سويت؟",
        emoji: "🤕",
        options: [
          { text: "ضحكت على نفسي وكملت", points: 30, trait: "confident" },
          { text: "قمت بسرعة وتظاهرت إن شي ما صار", points: 25, trait: "proud" },
          { text: "احمر وجهي وانحرجت", points: 15, trait: "shy" },
          { text: "لمت الأرض! 😂", points: 20, trait: "funny" },
        ]
      },
      {
        q: "عطست بصوت عالي في جلسة هادية، وش سويت؟",
        emoji: "🤧",
        options: [
          { text: "قلت الحمدلله وسكيت", points: 30, trait: "polite" },
          { text: "اعتذرت بهدوء", points: 25, trait: "considerate" },
          { text: "ضحكت على نفسي", points: 20, trait: "lighthearted" },
          { text: "تجاهلت الموضوع", points: 15, trait: "casual" },
        ]
      },
      {
        q: "شفت أحد يتفاخر بإنجازاته، وش حسيت؟",
        emoji: "🏆",
        options: [
          { text: "فرحت له من قلبي", points: 30, trait: "supportive" },
          { text: "قلت ماشاء الله", points: 25, trait: "polite" },
          { text: "حسيت بشوية غيرة", points: 15, trait: "honest" },
          { text: "قلت 'إي إي طيب' وغيرت الموضوع", points: 10, trait: "jealous" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 7: الأخلاق والقيم (8 questions)
  // ═══════════════════════════════════════════
  values: {
    title: "الأخلاق والقيم",
    emoji: "⭐",
    color: "#8b5cf6",
    questions: [
      {
        q: "شفت شخص وحيد يوم العيد، وش سويت؟",
        emoji: "😢",
        options: [
          { text: "رحت سلمت عليه وقعدت معاه", points: 30, trait: "compassionate" },
          { text: "عيدت عليه من بعيد", points: 20, trait: "kind" },
          { text: "ما انتبهت له", points: 10, trait: "oblivious" },
          { text: "قلت أكيد يحب العزلة", points: 5, trait: "assumptive" },
        ]
      },
      {
        q: "أحد تكلم بسوء عن غائب، وش سويت؟",
        emoji: "🗣️",
        options: [
          { text: "دافعت عنه", points: 30, trait: "loyal" },
          { text: "غيرت الموضوع", points: 25, trait: "wise" },
          { text: "سكت بس ما شاركت", points: 15, trait: "neutral" },
          { text: "شاركت في الكلام 😔", points: 0, trait: "gossip" },
        ]
      },
      {
        q: "هل تصدقت أو ساعدت محتاج يوم العيد؟",
        emoji: "🤲",
        options: [
          { text: "إي! أكثر من مرة", points: 30, trait: "charitable" },
          { text: "مرة واحدة", points: 25, trait: "good" },
          { text: "نويت بس ما سويت", points: 10, trait: "intention" },
          { text: "ما فكرت فيها 😔", points: 5, trait: "neglectful" },
        ]
      },
      {
        q: "سامحت أحد زعلك هالسنة؟",
        emoji: "🕊️",
        options: [
          { text: "إي! العيد فرصة للتسامح", points: 30, trait: "forgiving" },
          { text: "سامحت بس ما نسيت", points: 20, trait: "human" },
          { text: "لسه ما سامحته", points: 10, trait: "grudge" },
          { text: "ما في أحد يستاهل", points: 15, trait: "proud" },
        ]
      },
      {
        q: "شكرت أمك على تعبها يوم العيد؟",
        emoji: "❤️",
        options: [
          { text: "إي! وعطيتها هدية", points: 30, trait: "grateful" },
          { text: "قلت لها شكراً", points: 25, trait: "appreciative" },
          { text: "ساعدتها بدل ما أشكرها", points: 30, trait: "practical" },
          { text: "نسيت 😔", points: 5, trait: "forgetful" },
        ]
      },
      {
        q: "اتصلت على أحد ما شفته من زمان؟",
        emoji: "📱",
        options: [
          { text: "إي! أكثر من واحد", points: 30, trait: "connected" },
          { text: "واحد أو اثنين", points: 25, trait: "selective" },
          { text: "بس رسالة واتساب", points: 15, trait: "minimal" },
          { text: "ما اتصلت على أحد", points: 5, trait: "disconnected" },
        ]
      },
      {
        q: "دعيت لأحد من قلبك يوم العيد؟",
        emoji: "🤲",
        options: [
          { text: "إي! لكثير ناس", points: 30, trait: "spiritual" },
          { text: "للمقربين بس", points: 25, trait: "selective" },
          { text: "دعاء عام", points: 15, trait: "general" },
          { text: "نسيت الدعاء 😔", points: 5, trait: "forgetful" },
        ]
      },
      {
        q: "كيف كنت مع الخادمات والخدم يوم العيد؟",
        emoji: "🤝",
        options: [
          { text: "محترم ولطيف جداً", points: 30, trait: "kind" },
          { text: "معاملتهم جيد", points: 25, trait: "respectful" },
          { text: "تعامل عادي", points: 15, trait: "neutral" },
          { text: "ما فكرت فيهم 😔", points: 5, trait: "neglectful" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 8: مواقف خاصة (8 questions)
  // ═══════════════════════════════════════════
  special: {
    title: "مواقف خاصة",
    emoji: "🎭",
    color: "#14b8a6",
    questions: [
      {
        q: "لو رجع فيك الوقت، وش بتغير بعيدك؟",
        emoji: "⏰",
        options: [
          { text: "ما بغير شي، كان perfect", points: 30, trait: "content" },
          { text: "أزور ناس أكثر", points: 25, trait: "social" },
          { text: "أكون أكثر حضور", points: 20, trait: "aware" },
          { text: "أنام أقل 😅", points: 15, trait: "honest" },
        ]
      },
      {
        q: "وش أحلى لحظة صارت لك يوم العيد؟",
        emoji: "✨",
        options: [
          { text: "لما شفت فرحة أهلي", points: 30, trait: "family" },
          { text: "لما أخذت عيدية كبيرة 💰", points: 20, trait: "materialistic" },
          { text: "لما ضحكت مع الأصحاب", points: 25, trait: "social" },
          { text: "لما رجعت البيت ونمت 😂", points: 10, trait: "introverted" },
        ]
      },
      {
        q: "هل بكيت أو تأثرت يوم العيد؟",
        emoji: "🥲",
        options: [
          { text: "إي، من الفرحة", points: 30, trait: "emotional" },
          { text: "تأثرت بس ما بكيت", points: 25, trait: "sensitive" },
          { text: "لا، كان عادي", points: 15, trait: "stable" },
          { text: "أنا ما أبكي أصلاً 😎", points: 10, trait: "tough" },
        ]
      },
      {
        q: "فكرت في أحد متوفي يوم العيد؟",
        emoji: "🕯️",
        options: [
          { text: "إي، ودعيت له", points: 30, trait: "remembering" },
          { text: "مر على بالي", points: 25, trait: "thoughtful" },
          { text: "لا، حاولت ما أحزن", points: 15, trait: "protective" },
          { text: "ما عندي أحد متوفي الحمدلله", points: 20, trait: "blessed" },
        ]
      },
      {
        q: "اشتقت لأحد ما قدرت تشوفه؟",
        emoji: "💔",
        options: [
          { text: "إي، واتصلت عليه", points: 30, trait: "connected" },
          { text: "إي، بس ما قدرت أتواصل", points: 20, trait: "busy" },
          { text: "شوي بس", points: 15, trait: "manageable" },
          { text: "لا، شفت كل اللي أبيهم", points: 25, trait: "fulfilled" },
        ]
      },
      {
        q: "حطيت نية للسنة الجاية؟",
        emoji: "🎯",
        options: [
          { text: "إي! عندي أهداف واضحة", points: 30, trait: "motivated" },
          { text: "فكرت فيها بشكل عام", points: 25, trait: "planning" },
          { text: "ما فكرت بعد", points: 15, trait: "present" },
          { text: "نفس الشي كل سنة 😅", points: 10, trait: "routine" },
        ]
      },
      {
        q: "كيف بتقيم عيدك من 10؟",
        emoji: "📊",
        options: [
          { text: "9-10 ممتاز!", points: 30, trait: "satisfied" },
          { text: "7-8 جيد جداً", points: 25, trait: "positive" },
          { text: "5-6 متوسط", points: 15, trait: "moderate" },
          { text: "أقل من 5 😔", points: 5, trait: "unsatisfied" },
        ]
      },
      {
        q: "وش الدرس اللي تعلمته هالعيد؟",
        emoji: "📚",
        options: [
          { text: "قيمة العائلة والتواصل", points: 30, trait: "wise" },
          { text: "الصحة أهم من كل شي", points: 25, trait: "aware" },
          { text: "لازم أكون أكثر اجتماعية", points: 20, trait: "learning" },
          { text: "ما تعلمت شي جديد 😅", points: 10, trait: "static" },
        ]
      },
    ]
  },
}

// ═══ Game Modes ═══
const gameModes = [
  {
    id: 'quick',
    name: 'السريع',
    emoji: '⚡',
    questions: 7,
    description: '7 أسئلة سريعة',
    time: '2 دقيقة',
    color: '#f59e0b'
  },
  {
    id: 'normal',
    name: 'العادي',
    emoji: '🎮',
    questions: 14,
    description: '14 سؤال متنوع',
    time: '5 دقائق',
    color: '#10b981'
  },
  {
    id: 'deep',
    name: 'المتعمق',
    emoji: '🧠',
    questions: 21,
    description: '21 سؤال شامل',
    time: '8 دقائق',
    color: '#6366f1'
  },
  {
    id: 'extreme',
    name: 'المجنون',
    emoji: '🔥',
    questions: 30,
    description: '30 سؤال! كل شي',
    time: '12 دقيقة',
    color: '#ef4444'
  },
]

// ═══ Get Questions Based on Mode ═══
const getQuestionsByMode = (mode) => {
  const allQuestions = []
  const categories = Object.keys(megaQuestionBank)
  
  const questionsPerCategory = Math.ceil(mode.questions / categories.length)
  
  categories.forEach(cat => {
    const catData = megaQuestionBank[cat]
    const shuffled = [...catData.questions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, questionsPerCategory)
    
    selected.forEach(q => {
      allQuestions.push({
        ...q,
        category: catData.title,
        categoryEmoji: catData.emoji,
        categoryColor: catData.color
      })
    })
  })
  
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, mode.questions)
}

// ═══ Personality Analysis ═══
const analyzePersonality = (traits) => {
  const traitCounts = {}
  traits.forEach(t => {
    if (t) traitCounts[t] = (traitCounts[t] || 0) + 1
  })
  
  return Object.entries(traitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(t => t[0])
}

// ═══ Get Result ═══
const getResult = (score, maxScore, traits) => {
  const percentage = (score / maxScore) * 100
  const personality = analyzePersonality(traits)

  const personalityTexts = {
    disciplined: "منضبط", spiritual: "روحاني", social: "اجتماعي", family: "عائلي",
    respectful: "محترم", grateful: "شاكر", generous: "كريم", foodie: "ذواقة",
    patient: "صبور", honest: "صادق", mature: "ناضج", compassionate: "رحيم",
    wise: "حكيم", positive: "إيجابي", loyal: "وفي", balanced: "متوازن",
    thoughtful: "مفكر", kind: "طيب", confident: "واثق", funny: "مرح",
    traditional: "تقليدي", modern: "عصري", practical: "عملي", organized: "منظم"
  }

  const topTraits = personality.slice(0, 3).map(t => personalityTexts[t] || t).join(" • ")

  if (percentage >= 90) return {
    tier: "S",
    title: "🏆 أسطورة العيد!",
    amount: "2000",
    emoji: "👑",
    color: "#d4af37",
    gradient: "linear-gradient(135deg, #d4af37, #f5d67b)",
    message: "ماشاء الله! أنت قدوة في العيد والحياة!",
    personality: topTraits,
    badge: "أسطورة العيد الذهبية",
    tip: "علّم الجيل الجاي فنون العيد!"
  }
  if (percentage >= 80) return {
    tier: "A+",
    title: "⭐ نجم العيد الساطع!",
    amount: "1000",
    emoji: "🌟",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    message: "أداء استثنائي! الكل يحبك ويقدرك!",
    personality: topTraits,
    badge: "نجم العيد",
    tip: "استمر على هالمستوى الرهيب!"
  }
  if (percentage >= 70) return {
    tier: "A",
    title: "✨ ممتاز بكل المقاييس!",
    amount: "500",
    emoji: "✨",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    message: "أداء رائع! أنت شخص مميز!",
    personality: topTraits,
    badge: "متميز",
    tip: "شوية تحسين وتوصل للقمة!"
  }
  if (percentage >= 60) return {
    tier: "B+",
    title: "👍 جيد جداً!",
    amount: "300",
    emoji: "👍",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    message: "أداء جيد! في مجال للتطوير.",
    personality: topTraits,
    badge: "جيد جداً",
    tip: "ركز على العلاقات أكثر!"
  }
  if (percentage >= 50) return {
    tier: "B",
    title: "😊 لا بأس!",
    amount: "200",
    emoji: "😊",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    message: "أداء متوسط، ممكن تتحسن!",
    personality: topTraits,
    badge: "محتمل",
    tip: "السنة الجاية راح تكون أحسن!"
  }
  if (percentage >= 40) return {
    tier: "C",
    title: "😅 محتاج تشتغل على نفسك!",
    amount: "100",
    emoji: "😅",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    message: "في بعض النقاط تحتاج اهتمام.",
    personality: topTraits,
    badge: "قيد التطوير",
    tip: "اقرأ عن فن التعامل مع الأقارب!"
  }
  if (percentage >= 30) return {
    tier: "D",
    title: "🙃 وش هالمستوى؟",
    amount: "50",
    emoji: "🙃",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f87171)",
    message: "صراحة محتاج تعيد حساباتك!",
    personality: topTraits,
    badge: "يحتاج جهد",
    tip: "شاهد يوتيوب 'كيف تكون اجتماعي'!"
  }
  return {
    tier: "F",
    title: "💀 حالة طوارئ!",
    amount: "10",
    emoji: "🆘",
    color: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #f87171)",
    message: "السنة الجاية اختفي من الخارطة 😂",
    personality: topTraits,
    badge: "حالة ميؤوس منها 😂",
    tip: "ابدأ من الصفر، في أمل!"
  }
}

export default function EidiyaGamePage() {
  const [phase, setPhase] = useState('mode') // mode | playing | result | claim
  const [selectedMode, setSelectedMode] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [traits, setTraits] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [showNext, setShowNext] = useState(false)
  const [claimFrom, setClaimFrom] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [categoryIntro, setCategoryIntro] = useState(null)

  const startGame = (mode) => {
    setSelectedMode(mode)
    setQuestions(getQuestionsByMode(mode))
    setPhase('playing')
    setCurrentQ(0)
    setScore(0)
    setTraits([])
    setCategoryIntro(null)
  }

  const handleAnswer = (points, trait) => {
    setSelectedOption(points)
    setScore(prev => prev + points)
    setTraits(prev => [...prev, trait])
    setShowNext(true)
  }

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      const nextQ = currentQ + 1
      const currentCat = questions[currentQ]?.category
      const nextCat = questions[nextQ]?.category
      
      if (currentCat !== nextCat) {
        setCategoryIntro(questions[nextQ])
        setTimeout(() => setCategoryIntro(null), 1200)
      }
      
      setCurrentQ(nextQ)
      setSelectedOption(null)
      setShowNext(false)
    } else {
      setPhase('result')
      setShowConfetti(true)
    }
  }

  const maxScore = questions.length * 30
  const result = questions.length ? getResult(score, maxScore, traits) : null
  const progress = questions.length ? ((currentQ + 1) / questions.length) * 100 : 0
  const currentQuestion = questions[currentQ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            🎁 لعبة العيدية
          </h1>
          <p className="text-gray-600 text-lg">
            اكتشف شخصيتك العيدية واستحق عيديتك!
          </p>
        </div>

        {/* ═══ MODE SELECTION ═══ */}
        {phase === 'mode' && (
          <div className="space-y-4">
            {gameModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => startGame(mode)}
                className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-right flex items-center gap-4 border-2 hover:border-opacity-100 border-transparent hover:border-gray-300"
                style={{ borderColor: mode.color + '20' }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: mode.color + '15' }}
                >
                  {mode.emoji}
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold mb-1"
                    style={{ color: mode.color, fontFamily: 'Tajawal, sans-serif' }}
                  >
                    {mode.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{mode.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BsClock size={16} />
                  <span>{mode.time}</span>
                </div>
              </button>
            ))}
            
            <p className="text-center text-gray-400 text-sm mt-6">
              كل مرة تلعب، الأسئلة تتغير عشوائياً! 🎲
            </p>
          </div>
        )}

        {/* ═══ PLAYING PHASE ═══ */}
        {phase === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {selectedMode?.emoji} {selectedMode?.name} • السؤال {currentQ + 1}/{questions.length}
                </span>
                <span className="text-sm font-bold" style={{ color: selectedMode?.color }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-400"
                  style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${selectedMode?.color || '#d4af37'}, #f5d67b)`
                  }}
                />
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex justify-center">
              <span 
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ 
                  backgroundColor: currentQuestion.categoryColor + '15',
                  color: currentQuestion.categoryColor,
                  border: `1px solid ${currentQuestion.categoryColor}30`
                }}
              >
                {currentQuestion.categoryEmoji} {currentQuestion.category}
              </span>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="text-6xl text-center mb-6">
                {currentQuestion.emoji}
              </div>
              <h2 
                className="text-xl font-bold text-center mb-8 leading-relaxed"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {currentQuestion.q}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !selectedOption && handleAnswer(opt.points, opt.trait)}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 text-right ${
                      selectedOption === opt.points 
                        ? 'text-black shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      backgroundColor: selectedOption === opt.points ? selectedMode?.color : '',
                      opacity: selectedOption !== null && selectedOption !== opt.points ? 0.4 : 1
                    }}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {showNext && (
              <button
                onClick={nextQuestion}
                className="w-full py-4 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {currentQ < questions.length - 1 ? 'التالي ←' : 'النتيجة! 🎉'}
              </button>
            )}
          </div>
        )}

        {/* ═══ RESULT PHASE ═══ */}
        {phase === 'result' && result && (
          <div className="text-center space-y-6">
            {/* Tier Badge */}
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-black text-white shadow-xl"
              style={{ background: result.gradient }}
            >
              {result.tier}
            </div>

            <div className="text-6xl mb-4">{result.emoji}</div>
            <h1 
              className="text-3xl font-bold mb-3"
              style={{ color: result.color, fontFamily: 'Tajawal, sans-serif' }}
            >
              {result.title}
            </h1>
            <p className="text-gray-600 text-lg mb-6">{result.message}</p>

            {/* Stats Row */}
            <div className="flex justify-center gap-8 mb-6 p-4 bg-white rounded-xl shadow">
              <div>
                <p className="text-3xl font-bold" style={{ color: result.color }}>{score}</p>
                <p className="text-xs text-gray-500">نقاطك</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <p className="text-3xl font-bold text-gray-400">{maxScore}</p>
                <p className="text-xs text-gray-500">الأقصى</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <p className="text-3xl font-bold" style={{ color: result.color }}>{Math.round((score/maxScore)*100)}%</p>
                <p className="text-xs text-gray-500">النسبة</p>
              </div>
            </div>

            {/* Amount */}
            <div 
              className="bg-white rounded-3xl p-8 shadow-lg mb-6 border-2"
              style={{ borderColor: result.color + '30' }}
            >
              <p className="text-gray-500 mb-2">عيديتك المستحقة:</p>
              <div 
                className="text-6xl font-black mb-2"
                style={{ 
                  background: result.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Tajawal, sans-serif'
                }}
              >
                {result.amount}
              </div>
              <p className="text-gray-600 text-xl">ريال سعودي</p>
            </div>

            {/* Personality */}
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">شخصيتك العيدية:</p>
              <p 
                className="text-lg font-semibold text-gray-800 mb-4"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                {result.personality}
              </p>
              <p 
                className="text-sm"
                style={{ color: result.color }}
              >
                💡 {result.tip}
              </p>
            </div>

            {/* Buttons */}
            <button 
              onClick={() => setPhase('claim')}
              className="w-full py-4 rounded-xl font-black text-white hover:shadow-lg transition-shadow"
              style={{ background: result.gradient, fontFamily: 'Tajawal, sans-serif' }}
            >
              <span className="flex items-center justify-center gap-2">
                <BsCoin size={20} />
                طالب بعيديتك!
              </span>
            </button>

            <button 
              onClick={() => { setPhase('mode'); setShowConfetti(false) }}
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              العب مرة ثانية
            </button>
          </div>
        )}

        {/* ═══ CLAIM PHASE ═══ */}
        {phase === 'claim' && result && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">💰</div>
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                طالب بعيديتك!
              </h2>
              <p className="text-gray-600">
                ممن تريد المطالبة بـ {result.amount} ريال؟
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6">
              {['أبوي', 'أمي', 'جدي', 'جدتي', 'خالي', 'خالتي', 'عمي', 'عمتي', 'أخوي', 'أختي', 'زوجي', 'صديقي'].map((name) => (
                <button
                  key={name}
                  onClick={() => setClaimFrom(name)}
                  className={`p-3 rounded-lg font-semibold transition-colors ${
                    claimFrom === name ? 'text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: claimFrom === name ? result.color : '' }}
                >
                  {name}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="أو اكتب اسم..."
              value={claimFrom}
              onChange={(e) => setClaimFrom(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-gray-400 outline-none text-right mb-6"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />

            {claimFrom && (
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const text = encodeURIComponent(`يا ${claimFrom}! 🎁\n\nسويت اختبار العيدية وطلعت:\n${result.title}\n\nمستواي: ${result.tier}\nأستاهل: ${result.amount} ريال! 💰\n\nوش رايك تعطيني عيديتي؟ 😂\n\nجرب: ${window.location.href}`)
                    window.open(`https://wa.me/?text=${text}`, '_blank')
                  }} 
                  className="w-full py-4 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <BsWhatsapp size={20} />
                  واتساب
                </button>

                <button 
                  onClick={() => {
                    const text = encodeURIComponent(`سويت اختبار العيدية! 🎁\n\nمستواي: ${result.tier} ${result.emoji}\nأستاهل: ${result.amount} ريال!\n\nجرب:`)
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`, '_blank')
                  }} 
                  className="w-full py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  <BsTwitterX size={20} />
                  شارك في X
                </button>
              </div>
            )}

            <button 
              onClick={() => setPhase('result')}
              className="w-full py-3 rounded-xl font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              ← رجوع
            </button>
          </div>
        )}
        
      </div>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-5%',
                fontSize: `${16 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '💰', '🌟', '💵', '🎊', '👑', '⭐', '🏆'][i % 9]}
            </div>
          ))}
        </div>
      )}

      {/* Category Intro Overlay */}
      {categoryIntro && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-40 animate-fade">
          <div className="text-center">
            <div className="text-8xl mb-4">{categoryIntro.categoryEmoji}</div>
            <h2 
              className="text-3xl font-black"
              style={{ color: categoryIntro.categoryColor, fontFamily: 'Tajawal, sans-serif' }}
            >
              {categoryIntro.category}
            </h2>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}