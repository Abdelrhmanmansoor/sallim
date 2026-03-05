import { create } from 'zustand'

export const useEditorStore = create((set, get) => ({
  // Canvas state
  selectedTemplate: null,
  selectedFont: 'cairo',
  mainText: 'عيد مبارك',
  subText: 'كل عام وأنتم بخير',
  senderName: '',
  recipientName: '',
  fontSize: 42,
  subFontSize: 24,
  textColor: '#ffffff',
  subTextColor: '#ffffff',
  senderColor: '#ffffff',
  recipientColor: '#ffffff',
  logoImage: null,
  canvasWidth: 1080,
  canvasHeight: 1080,

  // Draggable positions (relative 0-1 of canvas)
  mainTextPos: { x: 0.5, y: 0.35 },
  subTextPos: { x: 0.5, y: 0.55 },
  senderPos: { x: 0.5, y: 0.85 },
  recipientPos: { x: 0.5, y: 0.75 },

  // Text effects
  textShadow: true,
  textStroke: false,
  textStrokeColor: '#000000',
  textStrokeWidth: 1,
  overlayOpacity: 0,
  overlayColor: '#000000',
  mainTextRotation: 0,
  subTextRotation: 0,

  // Active text element for editing
  activeElement: 'mainText',

  // Actions
  setTemplate: (template) => set({ selectedTemplate: template }),
  setFont: (font) => set({ selectedFont: font }),
  setMainText: (text) => set({ mainText: text }),
  setSubText: (text) => set({ subText: text }),
  setSenderName: (name) => set({ senderName: name }),
  setRecipientName: (name) => set({ recipientName: name }),
  setFontSize: (size) => set({ fontSize: size }),
  setSubFontSize: (size) => set({ subFontSize: size }),
  setTextColor: (color) => set({ textColor: color }),
  setSubTextColor: (color) => set({ subTextColor: color }),
  setSenderColor: (color) => set({ senderColor: color }),
  setRecipientColor: (color) => set({ recipientColor: color }),
  setLogoImage: (img) => set({ logoImage: img }),
  setMainTextPos: (pos) => set({ mainTextPos: pos }),
  setSubTextPos: (pos) => set({ subTextPos: pos }),
  setSenderPos: (pos) => set({ senderPos: pos }),
  setRecipientPos: (pos) => set({ recipientPos: pos }),
  setTextShadow: (v) => set({ textShadow: v }),
  setTextStroke: (v) => set({ textStroke: v }),
  setTextStrokeColor: (c) => set({ textStrokeColor: c }),
  setTextStrokeWidth: (w) => set({ textStrokeWidth: w }),
  setOverlayOpacity: (o) => set({ overlayOpacity: o }),
  setOverlayColor: (c) => set({ overlayColor: c }),
  setMainTextRotation: (r) => set({ mainTextRotation: r }),
  setSubTextRotation: (r) => set({ subTextRotation: r }),
  setActiveElement: (el) => set({ activeElement: el }),

  // Send state
  sendMode: 'single',
  setSendMode: (mode) => set({ sendMode: mode }),
  
  csvData: [],
  setCsvData: (data) => set({ csvData: data }),
  
  sendInterval: 5,
  setSendInterval: (interval) => set({ sendInterval: interval }),
}))

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  plan: 'free',
  dailyCount: 0,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setPlan: (plan) => set({ plan }),
  incrementDaily: () => set((state) => ({ dailyCount: state.dailyCount + 1 })),
  resetDaily: () => set({ dailyCount: 0 }),
}))

export const useWhiteLabelStore = create((set) => ({
  config: {
    companyName: '',
    logo: null,
    primaryColor: '#6A47ED',
    secondaryColor: '#17012C',
    domain: '',
    hideBranding: false,
    apiKey: '',
  },
  
  setConfig: (config) => set((state) => ({
    config: { ...state.config, ...config }
  })),
  resetConfig: () => set({
    config: {
      companyName: '',
      logo: null,
      primaryColor: '#6A47ED',
      secondaryColor: '#17012C',
      domain: '',
      hideBranding: false,
      apiKey: '',
    }
  }),
}))
