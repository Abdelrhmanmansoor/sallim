import { create } from 'zustand'

export const useEditorStore = create((set, get) => ({
  // Canvas state
  selectedTemplate: null,
  selectedTheme: 'golden',
  selectedFont: 'cairo',
  mainText: 'عيد مبارك',
  subText: 'كل عام وأنتم بخير',
  senderName: '',
  recipientName: '',
  fontSize: 42,
  subFontSize: 24,
  textColor: '#ffffff',
  logoImage: null,
  canvasWidth: 1080,
  canvasHeight: 1080,

  // Actions
  setTemplate: (template) => set({ selectedTemplate: template }),
  setTheme: (theme) => set({ selectedTheme: theme }),
  setFont: (font) => set({ selectedFont: font }),
  setMainText: (text) => set({ mainText: text }),
  setSubText: (text) => set({ subText: text }),
  setSenderName: (name) => set({ senderName: name }),
  setRecipientName: (name) => set({ recipientName: name }),
  setFontSize: (size) => set({ fontSize: size }),
  setSubFontSize: (size) => set({ subFontSize: size }),
  setTextColor: (color) => set({ textColor: color }),
  setLogoImage: (img) => set({ logoImage: img }),

  // Send state
  sendMode: 'single', // single | bulk | zip
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
    primaryColor: '#b8963a',
    secondaryColor: '#08090d',
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
      primaryColor: '#b8963a',
      secondaryColor: '#08090d',
      domain: '',
      hideBranding: false,
      apiKey: '',
    }
  }),
}))
