import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sallim'

const templateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ['public', 'premium', 'exclusive'], default: 'public' },
    requiredFeature: { type: String, default: '' },
    season: { type: String, default: 'eid_al_fitr' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Template = mongoose.model('Template', templateSchema)

const mockTemplates = [
    { name: 'تصميم جاهز 1', imageUrl: '/templates/جاهزة/1.png', type: 'public', season: 'eid_al_fitr' },
    { name: 'تصميم جاهز 2', imageUrl: '/templates/جاهزة/2.png', type: 'public', season: 'eid_al_fitr' },
    { name: 'تصميم جاهز 3', imageUrl: '/templates/جاهزة/3.png', type: 'public', season: 'eid_al_fitr' },
    { name: 'تصميم مصمم 1', imageUrl: '/templates/مصمم/1.png', type: 'exclusive', requiredFeature: 'VIP', season: 'eid_al_fitr' },
    { name: 'تصميم مصمم 2', imageUrl: '/templates/مصمم/2.png', type: 'exclusive', requiredFeature: 'VIP', season: 'eid_al_fitr' },
    { name: 'تصميم عام بريميوم', imageUrl: '/templates/جاهزة/4.png', type: 'premium', season: 'eid_al_fitr' }
]

async function seedTemplates() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to MongoDB')

        await Template.deleteMany({}) // Clear early templates for an accurate test
        console.log('Deleted existing templates')

        const inserted = await Template.insertMany(mockTemplates)
        console.log(`Inserted ${inserted.length} templates successfully!`)

        process.exit(0)
    } catch (error) {
        console.error('Error seeding templates:', error)
        process.exit(1)
    }
}

seedTemplates()
