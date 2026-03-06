import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsWhatsapp, BsTwitterX, BsArrowLeft, BsStars, BsCoin, BsShare, BsLightning, BsHeart, BsEmojiLaughing, BsTrophy, BsClock, BsFire } from 'react-icons/bs'

// ═══════════════════════════════════════════════════════════════════════════════
//   MEGA QUESTION BANK - 100+ Saudi Eid Situations
// ═══════════════════════════════════════════════════════════════════════════════

const megaQuestionBank = {
  
  // ═══════════════════════════════════════════
  // CATEGORY 1: صباح العيد (10 questions)
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
          { text: "رجعت نمت 5 دقايق (صارت ساعة) 😂", points: 5, trait: "lazy" },
        ]
      },
      {
        q: "كم أخذت وقت تتجهز؟",
        emoji: "🪞",
        options: [
          { text: "ساعة كاملة - لازم أطلع perfect", points: 20, trait: "perfectionist" },
          { text: "نص ساعة تقريباً", points: 25, trait: "balanced" },
          { text: "ربع ساعة بالكثير", points: 20, trait: "efficient" },
          { text: "5 دقايق وطلعت 😎", points: 10, trait: "careless" },
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
        q: "كيف كان مزاجك الصبح؟",
        emoji: "😊",
        options: [
          { text: "سعيد ومتحمس!", points: 30, trait: "positive" },
          { text: "عادي، يوم زي أي يوم", points: 15, trait: "neutral" },
          { text: "مريت بس عشان العيديات 💰", points: 20, trait: "honest" },
          { text: "زهقان وأبي أرجع أنام", points: 5, trait: "grumpy" },
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
  // CATEGORY 2: الزيارات العائلية (15 questions)
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
      {
        q: "قريبك يتفاخر بإنجازاته، وش حسيت؟",
        emoji: "🏆",
        options: [
          { text: "فرحت له من قلبي", points: 30, trait: "supportive" },
          { text: "قلت ماشاء الله", points: 25, trait: "polite" },
          { text: "حسيت بشوية غيرة", points: 15, trait: "honest" },
          { text: "قلت 'إي إي طيب' وغيرت الموضوع", points: 10, trait: "jealous" },
        ]
      },
      {
        q: "عمتك جابت لك هدية ما تحبها، وش سويت؟",
        emoji: "🎁",
        options: [
          { text: "شكرتها بحرارة", points: 30, trait: "grateful" },
          { text: "قلت شكراً وابتسمت", points: 25, trait: "polite" },
          { text: "سألتها وش هي بصراحة", points: 10, trait: "direct" },
          { text: "وجهي فضحني 😅", points: 15, trait: "expressive" },
        ]
      },
      {
        q: "أحد طلب منك توصيلة وأنت تعبان، وش سويت؟",
        emoji: "🚗",
        options: [
          { text: "وصلته بكل سرور", points: 30, trait: "generous" },
          { text: "وصلته بس تضايقت شوي", points: 20, trait: "helpful" },
          { text: "اعتذرت منه", points: 15, trait: "honest" },
          { text: "قلت سيارتي خربانة 😂", points: 5, trait: "liar" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 3: العيديات (12 questions)
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
        q: "شفت أحد يتباهى بعيدياته، وش قلت؟",
        emoji: "📱",
        options: [
          { text: "ماشاء الله تبارك الله", points: 30, trait: "positive" },
          { text: "ما عليّ منه", points: 20, trait: "unbothered" },
          { text: "حسيت بغيرة شوي", points: 15, trait: "honest" },
          { text: "سويت له بلوك 💀", points: 5, trait: "petty" },
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
      {
        q: "أحد عطاك عيدية بتحويل بنكي، وش رأيك؟",
        emoji: "📲",
        options: [
          { text: "حلو! أسهل وأنظف", points: 25, trait: "modern" },
          { text: "عادي، المهم العيدية", points: 20, trait: "practical" },
          { text: "أفضل الكاش صراحة", points: 15, trait: "traditional" },
          { text: "ما وصلني التحويل أصلاً 😂", points: 5, trait: "unlucky" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 4: الأكل والحلويات (10 questions)
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
        q: "جربت أكلة جديدة يوم العيد؟",
        emoji: "🆕",
        options: [
          { text: "إي! وكانت لذيذة", points: 30, trait: "adventurous" },
          { text: "جربت بس ما عجبتني", points: 20, trait: "honest" },
          { text: "لا، أكلت اللي أعرفه", points: 15, trait: "traditional" },
          { text: "أخاف أجرب شي جديد", points: 10, trait: "cautious" },
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
      {
        q: "كم وجبة أكلت يوم العيد الأول؟",
        emoji: "🍔",
        options: [
          { text: "3 وجبات عادية", points: 25, trait: "normal" },
          { text: "4-5 وجبات", points: 20, trait: "hungry" },
          { text: "فوق 5 وجبات! 😱", points: 10, trait: "extreme" },
          { text: "وجبة أو وجبتين بس", points: 20, trait: "light" },
        ]
      },
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 5: السوشيال ميديا (10 questions)
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
        q: "شاركت صور عيدياتك في السوشيال؟",
        emoji: "💸",
        options: [
          { text: "لا، خصوصية", points: 30, trait: "private" },
          { text: "بس في الستوري المقرب", points: 20, trait: "selective" },
          { text: "إي، ليش لا؟", points: 15, trait: "open" },
          { text: "ما عندي عيديات أشاركها 😂", points: 10, trait: "honest" },
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
        q: "شفت ستوريات العيد، وش كان إحساسك؟",
        emoji: "👀",
        options: [
          { text: "فرحت للناس", points: 30, trait: "positive" },
          { text: "عادي، ما أهتم", points: 20, trait: "unbothered" },
          { text: "حسيت إن عيدي أحلى 😎", points: 15, trait: "competitive" },
          { text: "حسيت بالـ FOMO 😔", points: 10, trait: "comparison" },
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
  // CATEGORY 6: المواقف المحرجة (10 questions)
  // ═══════════════════════════════════════════
  awkward: {
    title: "المواقف المحرجة",
    emoji: "😳",
    color: "#ef4444",
    questions: [
      {
        q: "نسيت تجيب هدية لأحد وهو جاب لك، وش سويت؟",
        emoji: "😰",
        options: [
          { text: "اعتذرت ووعدته أجيب له", points: 30, trait: "honest" },
          { text: "قلت هديتك بتوصل بعدين", points: 20, trait: "creative" },
          { text: "تظاهرت إن شي ما صار", points: 15, trait: "avoidant" },
          { text: "هربت من الموقف 😂", points: 5, trait: "coward" },
        ]
      },
      {
        q: "طفل كسر شي غالي في بيتكم، وش سويت؟",
        emoji: "💔",
        options: [
          { text: "قلت عادي وما سوينا موضوع", points: 30, trait: "gracious" },
          { text: "زعلت بس ما بينت", points: 20, trait: "controlled" },
          { text: "قلت لأمه بطريقة لطيفة", points: 15, trait: "direct" },
          { text: "طلبت من أهله يعوضون 😬", points: 5, trait: "materialistic" },
        ]
      },
      {
        q: "أحد مدح شكلك وأنت شايف نفسك مو أوكي، وش قلت؟",
        emoji: "🪞",
        options: [
          { text: "شكرته وابتسمت", points: 30, trait: "gracious" },
          { text: "قلت 'أنت أحلى'", points: 25, trait: "kind" },
          { text: "قلت 'لا والله؟!' باستغراب", points: 20, trait: "humble" },
          { text: "قلت 'كذاب!' 😂", points: 15, trait: "selfcritical" },
        ]
      },
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
        q: "كيف تعاملت مع الخدم/العمال يوم العيد؟",
        emoji: "🤝",
        options: [
          { text: "عيدت عليهم وعطيتهم عيدية", points: 30, trait: "kind" },
          { text: "عيدت عليهم بس", points: 25, trait: "respectful" },
          { text: "تعامل عادي", points: 15, trait: "neutral" },
          { text: "ما فكرت فيهم 😔", points: 5, trait: "neglectful" },
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
    ]
  },

  // ═══════════════════════════════════════════
  // CATEGORY 8: مواقف خاصة (10 questions)
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
        q: "لو تختار، تبي عيديات أكثر أو وقت أكثر مع الأهل؟",
        emoji: "⚖️",
        options: [
          { text: "الوقت مع الأهل أهم", points: 30, trait: "family" },
          { text: "التوازن بين الاثنين", points: 25, trait: "balanced" },
          { text: "صراحة العيديات 💰", points: 15, trait: "honest" },
          { text: "ولا واحد، أبي راحة 😴", points: 5, trait: "tired" },
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
      {
        q: "هل العيد هذا كان أحسن من السنة اللي قبلها؟",
        emoji: "📈",
        options: [
          { text: "إي! أحسن بكثير", points: 30, trait: "improving" },
          { text: "نفس الشي تقريباً", points: 20, trait: "stable" },
          { text: "أقل شوي صراحة", points: 15, trait: "honest" },
          { text: "ما أقارن، كل عيد له طعمه", points: 25, trait: "present" },
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
  
  // Determine questions per category based on mode
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
  
  // Shuffle and limit to exact number
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
  const [phase, setPhase] = useState('mode') // mode | intro | playing | result | claim
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
    <div dir="rtl" style={{
      fontFamily: "'Tajawal', sans-serif",
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          {[...Array(60)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-5%',
              fontSize: `${14 + Math.random() * 20}px`,
              animation: `confettiFall ${2 + Math.random() * 3}s linear forwards`,
              animationDelay: `${Math.random() * 2}s`
            }}>
              {['🎉', '✨', '💰', '🌟', '💵', '🎊', '👑', '⭐', '🏆'][i % 9]}
            </div>
          ))}
        </div>
      )}

      {/* Category Intro Overlay */}
      {categoryIntro && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 80, animation: 'fadeIn 200ms ease'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 70, marginBottom: 12 }}>{categoryIntro.categoryEmoji}</div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: categoryIntro.categoryColor }}>{categoryIntro.category}</h2>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link to="/" style={{
        position: 'absolute', top: 20, right: 20, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 8,
        color: '#666', fontSize: 14, textDecoration: 'none'
      }}>
        <BsArrowLeft /> الرئيسية
      </Link>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 20px 40px' }}>

        {/* ═══ MODE SELECTION ═══ */}
        {phase === 'mode' && (
          <div style={{ animation: 'fadeIn 500ms ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <div style={{ fontSize: 70, marginBottom: 16, animation: 'bounce 2s infinite' }}>🎁</div>
              <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #d4af37, #f5d67b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                اختبار العيدية الضخم
              </h1>
              <p style={{ fontSize: 15, color: '#888' }}>اختر مستوى التحدي!</p>
              <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>85+ سؤال • 8 فئات مختلفة</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {gameModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => startGame(mode)}
                  style={{
                    padding: '20px 24px', borderRadius: 16, border: `2px solid ${mode.color}40`,
                    background: '#1f1f1f', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 16, textAlign: 'right',
                    transition: 'all 200ms'
                  }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, background: `${mode.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
                  }}>
                    {mode.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: mode.color }}>{mode.name}</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>{mode.description}</p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BsClock size={12} /> {mode.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p style={{ fontSize: 11, color: '#444', textAlign: 'center', marginTop: 24 }}>
              كل مرة تلعب، الأسئلة تتغير عشوائياً! 🎲
            </p>
          </div>
        )}

        {/* ═══ PLAYING PHASE ═══ */}
        {phase === 'playing' && currentQuestion && (
          <div style={{ animation: 'fadeIn 300ms ease' }}>
            {/* Progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#888' }}>
                  {selectedMode?.emoji} {selectedMode?.name} • السؤال {currentQ + 1}/{questions.length}
                </span>
                <span style={{ fontSize: 11, color: '#d4af37', fontWeight: 700 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 6, background: '#333', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: `linear-gradient(90deg, ${selectedMode?.color || '#d4af37'}, #f5d67b)`,
                  width: `${progress}%`, transition: 'width 400ms ease', borderRadius: 10
                }} />
              </div>
            </div>

            {/* Category Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <span style={{
                padding: '5px 12px', background: `${currentQuestion.categoryColor}15`, borderRadius: 16,
                fontSize: 11, color: currentQuestion.categoryColor, fontWeight: 600,
                border: `1px solid ${currentQuestion.categoryColor}30`
              }}>
                {currentQuestion.categoryEmoji} {currentQuestion.category}
              </span>
            </div>

            {/* Question Card */}
            <div style={{
              background: '#1f1f1f', borderRadius: 20, padding: 24,
              border: '1px solid #333', marginBottom: 20
            }}>
              <div style={{ fontSize: 44, textAlign: 'center', marginBottom: 14 }}>
                {currentQuestion.emoji}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', lineHeight: 1.7, marginBottom: 20 }}>
                {currentQuestion.q}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !selectedOption && handleAnswer(opt.points, opt.trait)}
                    disabled={selectedOption !== null}
                    style={{
                      padding: '14px 18px', borderRadius: 12, border: 'none',
                      background: selectedOption === opt.points ? selectedMode?.color || '#d4af37' : '#2d2d2d',
                      color: selectedOption === opt.points ? '#000' : '#fff',
                      fontSize: 14, fontWeight: 600, cursor: selectedOption ? 'default' : 'pointer',
                      fontFamily: 'inherit', textAlign: 'right',
                      transition: 'all 200ms',
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
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: '#fff', color: '#000', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', animation: 'fadeIn 300ms ease'
                }}
              >
                {currentQ < questions.length - 1 ? 'التالي ←' : 'النتيجة! 🎉'}
              </button>
            )}
          </div>
        )}

        {/* ═══ RESULT PHASE ═══ */}
        {phase === 'result' && result && (
          <div style={{ textAlign: 'center', animation: 'scaleIn 400ms ease' }}>
            {/* Tier Badge */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
              background: result.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 900, color: '#000', boxShadow: `0 8px 30px ${result.color}40`
            }}>
              {result.tier}
            </div>

            <div style={{ fontSize: 50, marginBottom: 12 }}>{result.emoji}</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: result.color, lineHeight: 1.5 }}>
              {result.title}
            </h1>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{result.message}</p>

            {/* Stats Row */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20,
              padding: '14px', background: '#1a1a1a', borderRadius: 12
            }}>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: result.color }}>{score}</p>
                <p style={{ fontSize: 10, color: '#666' }}>نقاطك</p>
              </div>
              <div style={{ width: 1, background: '#333' }} />
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#888' }}>{maxScore}</p>
                <p style={{ fontSize: 10, color: '#666' }}>الأقصى</p>
              </div>
              <div style={{ width: 1, background: '#333' }} />
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: result.color }}>{Math.round((score/maxScore)*100)}%</p>
                <p style={{ fontSize: 10, color: '#666' }}>النسبة</p>
              </div>
            </div>

            {/* Amount */}
            <div style={{
              background: '#1f1f1f', borderRadius: 20, padding: 28, marginBottom: 16,
              border: `2px solid ${result.color}30`
            }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>عيديتك المستحقة:</p>
              <div style={{
                fontSize: 52, fontWeight: 900, marginBottom: 6,
                background: result.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {result.amount}
              </div>
              <p style={{ fontSize: 16, color: '#888' }}>ريال سعودي</p>
            </div>

            {/* Personality */}
            <div style={{
              background: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 20,
              border: '1px solid #333'
            }}>
              <p style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>شخصيتك العيدية:</p>
              <p style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{result.personality}</p>
              <p style={{ fontSize: 11, color: result.color, marginTop: 10 }}>💡 {result.tip}</p>
            </div>

            {/* Buttons */}
            <button onClick={() => setPhase('claim')} style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none',
              background: result.gradient, color: '#000', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10
            }}>
              <BsCoin style={{ marginLeft: 8 }} /> طالب بعيديتك!
            </button>

            <button onClick={() => { setPhase('mode'); setShowConfetti(false) }} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #333',
              background: 'transparent', color: '#888', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit'
            }}>
              العب مرة ثانية
            </button>
          </div>
        )}

        {/* ═══ CLAIM PHASE ═══ */}
        {phase === 'claim' && result && (
          <div style={{ animation: 'fadeIn 300ms ease' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>💰</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>طالب بعيديتك!</h2>
              <p style={{ fontSize: 13, color: '#888' }}>ممن تريد المطالبة بـ {result.amount} ريال؟</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {['أبوي', 'أمي', 'جدي', 'جدتي', 'خالي', 'خالتي', 'عمي', 'عمتي', 'أخوي', 'أختي', 'زوجي', 'صديقي'].map((name) => (
                <button key={name} onClick={() => setClaimFrom(name)} style={{
                  padding: '12px 8px', borderRadius: 10, border: 'none',
                  background: claimFrom === name ? result.color : '#2d2d2d',
                  color: claimFrom === name ? '#000' : '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                }}>
                  {name}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="أو اكتب اسم..."
              value={claimFrom}
              onChange={(e) => setClaimFrom(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: '2px solid #333',
                background: '#1f1f1f', color: '#fff', fontSize: 14, fontFamily: 'inherit',
                outline: 'none', textAlign: 'right', marginBottom: 16
              }}
            />

            {claimFrom && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => {
                  const text = encodeURIComponent(`يا ${claimFrom}! 🎁\n\nسويت اختبار العيدية وطلعت:\n${result.title}\n\nمستواي: ${result.tier}\nأستاهل: ${result.amount} ريال! 💰\n\nوش رايك تعطيني عيديتي؟ 😂\n\nجرب: ${window.location.href}`)
                  window.open(`https://wa.me/?text=${text}`, '_blank')
                }} style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>
                  <BsWhatsapp style={{ marginLeft: 8 }} /> واتساب
                </button>

                <button onClick={() => {
                  const text = encodeURIComponent(`سويت اختبار العيدية! 🎁\n\nمستواي: ${result.tier} ${result.emoji}\nأستاهل: ${result.amount} ريال!\n\nجرب:`)
                  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${window.location.href}`, '_blank')
                }} style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: '1px solid #333',
                  background: '#000', color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>
                  <BsTwitterX style={{ marginLeft: 8 }} /> شارك في X
                </button>
              </div>
            )}

            <button onClick={() => setPhase('result')} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: 'none',
              background: '#2d2d2d', color: '#888', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', marginTop: 16
            }}>
              ← رجوع
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: '1px solid #222' }}>
          <Link to="/" style={{ fontSize: 11, color: '#444', textDecoration: 'none' }}>
            صنع بـ ❤️ بواسطة <span style={{ color: '#d4af37' }}>@am_designing</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
      `}</style>
    </div>
  )
}
