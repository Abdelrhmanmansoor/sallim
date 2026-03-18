import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SAR from '../components/SAR'
import { useCurrency, CURRENCY_NAMES, COUNTRY_FLAG } from '../utils/useCurrency'
import { createPaymobFlashIntention } from '../utils/api'
import { usePaymentMethods, mapPaymentMethodsForDisplay } from '../hooks/usePaymentMethods'

const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''

/* ── inject checkout styles once ── */
const injectCheckoutCSS = (() => {
  let done = false
  return () => {
    if (done) return
    done = true
    const s = document.createElement('style')
    s.textContent = `
      .co-root { --co-brand: #b8860b; --co-brand-dark: #996f09; --co-bg: #fafafa; --co-card: #fff; --co-border: #e8e8e8; --co-text: #1a1a1a; --co-muted: #6b7280; --co-success: #16a34a; --co-radius: 12px; }
      .co-root *, .co-root *::before, .co-root *::after { box-sizing: border-box; }
      .co-root { font-family: 'Tajawal', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--co-text); background: var(--co-bg); min-height: 70vh; }
      .co-container { max-width: 1040px; margin: 0 auto; padding: 32px 20px 60px; }
      .co-grid { display: grid; grid-template-columns: 1fr; gap: 28px; }
      @media (min-width: 860px) { .co-grid { grid-template-columns: 1.15fr 0.85fr; } }
      .co-card { background: var(--co-card); border: 1px solid var(--co-border); border-radius: var(--co-radius); }
      .co-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
      .co-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--co-muted); background: none; border: 1px solid var(--co-border); border-radius: 8px; padding: 8px 14px; cursor: pointer; transition: all .15s; }
      .co-back:hover { background: #f3f4f6; color: var(--co-text); }
      .co-title { font-size: 20px; font-weight: 800; color: var(--co-text); letter-spacing: -.02em; }
      .co-secure { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--co-success); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 5px 12px; }
      .co-form-title { font-size: 17px; font-weight: 800; margin: 0 0 4px; }
      .co-form-sub { font-size: 13px; color: var(--co-muted); margin: 0 0 24px; }
      .co-label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 6px; }
      .co-label .co-req { color: #dc2626; margin-right: 2px; }
      .co-input-wrap { position: relative; margin-bottom: 18px; }
      .co-input { width: 100%; height: 48px; border: 1px solid var(--co-border); border-radius: 10px; padding: 0 14px 0 40px; font-size: 14px; font-family: inherit; color: var(--co-text); background: #fafbfc; outline: none; transition: border-color .15s, box-shadow .15s; }
      .co-input:focus { border-color: var(--co-brand); box-shadow: 0 0 0 3px rgba(184,134,11,.1); background: #fff; }
      .co-input::placeholder { color: #9ca3af; }
      .co-input[dir=ltr] { padding: 0 40px 0 14px; text-align: left; }
      .co-input-icon { position: absolute; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
      .co-input-icon-l { left: 12px; }
      .co-input-icon-r { right: 12px; }
      .co-error { font-size: 12px; font-weight: 600; color: #dc2626; margin-top: 4px; }
      .co-divider { border: none; border-top: 1px solid var(--co-border); margin: 24px 0; }
      .co-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; height: 52px; border: none; border-radius: 10px; font-size: 15px; font-weight: 800; font-family: inherit; cursor: pointer; transition: all .15s; }
      .co-btn:disabled { opacity: .5; cursor: not-allowed; }
      .co-btn-primary { background: var(--co-brand); color: #fff; }
      .co-btn-primary:hover:not(:disabled) { background: var(--co-brand-dark); }
      .co-btn-outline { background: transparent; color: var(--co-muted); border: 1px solid var(--co-border); font-size: 13px; height: 44px; }
      .co-btn-outline:hover { background: #f9fafb; }
      .co-trust-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 16px; font-size: 11px; color: #9ca3af; font-weight: 600; }
      .co-trust-row svg { width: 13px; height: 13px; }
      .co-summary { padding: 0; overflow: hidden; }
      .co-summary-img { aspect-ratio: 4/3; background: #f3f4f6; position: relative; overflow: hidden; }
      .co-summary-img img { width: 100%; height: 100%; object-fit: cover; }
      .co-summary-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: rgba(255,255,255,.5); font-size: 13px; font-weight: 700; gap: 8px; }
      .co-price-badge { position: absolute; bottom: 12px; left: 12px; display: inline-flex; align-items: center; gap: 5px; background: var(--co-brand); color: #fff; font-size: 15px; font-weight: 900; padding: 6px 16px; border-radius: 8px; }
      .co-summary-body { padding: 20px 22px 24px; }
      .co-product-name { font-size: 16px; font-weight: 800; margin: 0 0 4px; }
      .co-product-desc { font-size: 12px; color: var(--co-muted); margin: 0 0 20px; line-height: 1.6; }
      .co-benefit { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; padding: 8px 0; }
      .co-benefit-icon { width: 22px; height: 22px; border-radius: 6px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .co-benefit-icon svg { width: 12px; height: 12px; color: var(--co-success); }
      .co-methods { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-top: 1px solid var(--co-border); }
      .co-methods span { font-size: 11px; font-weight: 700; color: var(--co-muted); background: #f3f4f6; padding: 4px 10px; border-radius: 6px; }
      .co-pay-tabs { display: flex; gap: 10px; margin-bottom: 18px; }
      .co-pay-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; border: 2px solid var(--co-border); border-radius: 12px; background: #fff; cursor: pointer; transition: all .2s; position: relative; }
      .co-pay-tab:hover { border-color: #d1d5db; background: #fafafa; }
      .co-pay-tab.co-pay-active { border-color: var(--co-brand); background: #fffdf5; box-shadow: 0 0 0 3px rgba(184,134,11,.08); }
      .co-pay-tab-check { position: absolute; top: 8px; right: 8px; width: 20px; height: 20px; border-radius: 50%; background: var(--co-brand); display: flex; align-items: center; justify-content: center; opacity: 0; transform: scale(.6); transition: all .2s; }
      .co-pay-tab.co-pay-active .co-pay-tab-check { opacity: 1; transform: scale(1); }
      .co-pay-tab-logos { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: center; }
      .co-pay-tab-label { font-size: 12px; font-weight: 700; color: var(--co-text); }
      .co-pay-tab-sub { font-size: 10px; color: var(--co-muted); font-weight: 500; }
      .co-total-row { display: flex; align-items: center; justify-content: between; padding: 14px 22px; background: #f9fafb; border-top: 1px solid var(--co-border); }
      .co-total-label { flex: 1; font-size: 14px; font-weight: 800; }
      .co-total-value { font-size: 18px; font-weight: 900; display: flex; align-items: center; gap: 4px; }
      .co-review-field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
      .co-review-label { color: var(--co-muted); font-weight: 600; }
      .co-review-value { font-weight: 700; }
      .co-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: co-spin .5s linear infinite; display: inline-block; }
      @keyframes co-spin { to { transform: rotate(360deg); } }
      @keyframes co-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes co-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
      .co-animate { animation: co-fade .3s ease both; }
    `
    document.head.appendChild(s)
  }
})()

/* ── SVG icons (inline, no emojis) ── */
const IconLock = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
const IconCheck = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:12,height:12}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconArrow = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
const IconShield = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:13,height:13}}><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
const IconUser = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
const IconPhone = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
const IconMail = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
const IconGift = () => <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14}}><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm2 0a1 1 0 10-1-1v1h1zm-6 7l.001-.12a1 1 0 01.98-.88H9v5H5a2 2 0 01-2-2v-2zm6 2.997V12h4.02a1 1 0 01.98.88L15 13v2a2 2 0 01-2 2h-2v-.003z" clipRule="evenodd"/></svg>

/* ── Payment brand logos (official SVGs) ── */
const LogoVisa = ({ size = 32 }) => <svg width={size} height={size * 0.32} viewBox="0 0 256 83" xmlns="http://www.w3.org/2000/svg"><path d="M132.2 0l-21 82.5h-24.7L107.5 0h24.7zm105.8 53.2l13-35.8 7.5 35.8h-20.5zm27.5 29.3h22.9L268.1 0h-21.2c-4.8 0-8.8 2.8-10.6 7L201 82.5h26.4l5.2-14.5h32.3l3.1 14.5zm-65.7-26.9c.1-21.2-29.3-22.4-29.1-31.8.1-2.9 2.8-5.9 8.8-6.7 3-.4 11.2-.7 20.6 3.6l3.7-17C197.8.9 189.9-1 180.1-1c-24.9 0-42.4 13.2-42.5 32.2-.2 14 12.5 21.8 22.1 26.5 9.8 4.8 13.1 7.9 13 12.2-.1 6.6-7.8 9.5-15 9.6-12.6.2-19.9-3.4-25.7-6.1l-4.5 21.3c5.8 2.7 16.6 5 27.8 5.1 26.5 0 43.8-13.1 43.9-33.3M96.8 0L59 82.5H32.3L13.6 16.4c-1.1-4.5-2.1-6.1-5.6-8C3.5 6.1 0 4.1 0 4.1l.5-4h42.8c5.5 0 10.4 3.6 11.6 9.9l10.6 56.3L91.2 0h5.6z" fill="#1434CB"/></svg>
const LogoMastercard = ({ size = 32 }) => <svg width={size} height={size * 0.62} viewBox="0 0 131.4 86.9" xmlns="http://www.w3.org/2000/svg"><circle cx="43.4" cy="43.4" r="43.4" fill="#eb001b"/><circle cx="87.9" cy="43.4" r="43.4" fill="#f79e1b"/><path d="M65.7 11c12 9.4 19.7 24 19.7 40.4S77.7 76.4 65.7 86a53.2 53.2 0 010-75z" fill="#ff5f00"/></svg>
const LogoApplePay = ({ size = 38 }) => <svg width={size} height={size * 0.42} viewBox="0 0 165 70" xmlns="http://www.w3.org/2000/svg"><path d="M28.8 8.7c-2 2.4-5.2 4.3-8.4 4-0.4-3.2 1.1-6.6 3-8.7C25.5 1.5 28.9-0.2 31.7 0c0.3 3.3-0.9 6.5-2.9 8.7zm2.9 4.5c-4.7-0.3-8.6 2.6-10.8 2.6-2.2 0-5.6-2.5-9.2-2.4C6.8 13.5 2.3 16.4.9 21c-2.9 9.3.8 23.1 5.9 30.7 2.3 3.7 5.4 8 9.2 7.8 3.7-0.1 5.1-2.4 9.5-2.4 4.5 0 5.7 2.4 9.5 2.3 4-0.1 6.6-3.8 8.9-7.5 2.8-4.3 3.9-8.4 4-8.6-0.1-0.1-7.7-3-7.7-11.7 0-7.3 5.9-10.8 6.2-11-3.4-5-8.7-5.6-10.6-5.7v0.3z" fill="#000"/><path d="M66.3 4.7C75.7 4.7 82.3 11.2 82.3 20.5 82.3 29.9 75.6 36.5 66 36.5H56.6V53.2H49.6V4.7H66.3zm-9.7 25.5h7.8c6.6 0 10.4-3.6 10.4-9.6S71 11.1 64.4 11.1H56.6V30.2zM84.2 42.1c0-6.5 5-10.6 14-11.1l10.3-0.6v-2.9c0-4.2-2.8-6.6-7.5-6.6-4.4 0-7.2 2-7.8 5.1H86.6C87 20.8 92.5 16.5 100 16.5c7.8 0 13.4 4.3 13.4 10.8V53.2h-6.5V47.4h-0.2c-1.9 3.8-6.2 6.3-10.6 6.3C89.5 53.7 84.2 49.1 84.2 42.1zM108.5 38.9V36l-9.3 0.6c-4.7 0.3-7.3 2.3-7.3 5.5 0 3.2 2.7 5.3 6.9 5.3 5.5 0 9.7-3.7 9.7-8.5zM119 68.1V61.8c0.5 0.1 1.8 0.1 2.4 0.1 3.5 0 5.3-1.5 6.5-5.2 0-0.1 0.7-2.3 0.7-2.3L116.9 17h7.4L133 46.8h0.2L141.9 17h7.2L136.7 55.6c-3.2 9-6.9 11.9-14.7 11.9C121.2 67.5 119.5 67.4 119 68.1z" fill="#000"/></svg>
const LogoPayPal = ({ size = 32 }) => <svg width={size} height={size * 0.27} viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg"><path d="M46.2 11.1h-5.6c-.4 0-.7.3-.8.6l-2.3 14.3c0 .3.2.5.5.5h2.7c.4 0 .7-.3.8-.6l.6-4c.1-.3.4-.6.8-.6h1.8c3.7 0 5.9-1.8 6.4-5.3.2-1.5 0-2.7-.7-3.6-.7-.9-2-1.3-3.8-1.3h-.4zm.7 5.2c-.3 2-1.8 2-3.3 2h-.8l.6-3.7c0-.2.2-.4.5-.4h.4c1 0 1.9 0 2.4.6.3.3.4.8.2 1.5zM64.4 16.2h-2.7c-.2 0-.5.2-.5.4l-.1.8-.2-.3c-.6-.9-2-1.2-3.4-1.2-3.2 0-5.9 2.4-6.4 5.8-.3 1.7.1 3.3 1.1 4.4.9 1 2.2 1.4 3.7 1.4 2.6 0 4.1-1.7 4.1-1.7l-.1.8c0 .3.2.5.5.5h2.4c.4 0 .7-.3.8-.6l1.4-9c0-.2-.2-.3-.5-.3zm-4.1 5.6c-.3 1.6-1.5 2.7-3.2 2.7-.8 0-1.5-.3-1.9-.7-.4-.5-.6-1.2-.5-1.9.2-1.6 1.5-2.8 3.1-2.8.8 0 1.5.3 1.9.7.5.5.6 1.1.6 2zM79.8 16.2h-2.7c-.3 0-.5.1-.7.3l-3.8 5.6-1.6-5.4c-.1-.3-.4-.5-.8-.5h-2.7c-.3 0-.5.3-.4.6l3.1 9-2.9 4.1c-.2.3 0 .7.3.7h2.7c.3 0 .5-.1.7-.3l9.2-13.3c.2-.3 0-.8-.4-.8z" fill="#253B80"/><path d="M90 11.1h-5.6c-.4 0-.7.3-.8.6l-2.3 14.3c0 .3.2.5.5.5h2.9c.3 0 .5-.2.5-.4l.7-4.2c.1-.3.4-.6.8-.6h1.8c3.7 0 5.9-1.8 6.4-5.3.2-1.5 0-2.7-.7-3.6-.7-.9-2-1.3-3.8-1.3H90zm.7 5.2c-.3 2-1.8 2-3.3 2h-.8l.6-3.7c0-.2.2-.4.5-.4h.4c1 0 1.9 0 2.4.6.3.3.4.8.2 1.5zM108.2 16.2h-2.7c-.2 0-.5.2-.5.4l-.1.8-.2-.3c-.6-.9-2-1.2-3.4-1.2-3.2 0-5.9 2.4-6.4 5.8-.3 1.7.1 3.3 1.1 4.4.9 1 2.2 1.4 3.7 1.4 2.6 0 4.1-1.7 4.1-1.7l-.1.8c0 .3.2.5.5.5h2.4c.4 0 .7-.3.8-.6l1.4-9c.1-.2-.1-.3-.5-.3zm-4.1 5.6c-.3 1.6-1.5 2.7-3.2 2.7-.8 0-1.5-.3-1.9-.7-.4-.5-.6-1.2-.5-1.9.2-1.6 1.5-2.8 3.1-2.8.8 0 1.5.3 1.9.7.5.5.7 1.1.6 2zM112.7 11.5l-2.3 14.6c0 .3.2.5.5.5h2.3c.4 0 .7-.3.8-.6l2.3-14.3c0-.3-.2-.5-.5-.5h-2.6c-.2 0-.4.1-.5.3z" fill="#179BD7"/><path d="M7.3 29.5l.4-2.7-.9 0H2.4L5.6 4.4c0-.1.1-.2.2-.3.1-.1.2-.1.3-.1h8.4c2.8 0 4.7.6 5.7 1.7.5.5.8 1.1 1 1.7.2.7.2 1.5 0 2.4v.7l.5.3c.4.2.8.5 1 .8.4.5.6 1.1.7 1.8.1.7 0 1.6-.2 2.5-.3 1.1-.8 2.1-1.4 2.9-.5.7-1.2 1.3-2 1.7-.7.4-1.6.7-2.5.8-.9.2-1.9.2-3 .2h-.7c-.5 0-1 .2-1.4.5-.4.3-.6.8-.7 1.3l-.1.3-1 6.1 0 .2c0 .1 0 .1-.1.1 0 0-.1 0-.1 0H7.3z" fill="#253B80"/><path d="M22 10.1c0 .2-.1.4-.1.6-1.2 6.1-5.2 8.2-10.3 8.2h-2.6c-.6 0-1.2.5-1.3 1l-1.3 8.5-.4 2.4c0 .4.3.8.7.8h5.1c.6 0 1-.4 1.1-.9l0-.2.9-5.5 0-.3c.1-.5.6-.9 1.1-.9h.7c4.5 0 8.1-1.8 9.1-7.2.4-2.2.2-4.1-1-5.4-.3-.4-.8-.7-1.3-1z" fill="#179BD7"/><path d="M20.7 9.6c-.2 0-.3-.1-.5-.1-.2 0-.3-.1-.5-.1-1.5-.2-3.2-.1-5.1-.1h-6.4c-.2 0-.3 0-.5.1-.3.1-.6.4-.6.8l-1.4 9 0 .2c.1-.6.6-1 1.3-1H9.6c5.1 0 9.1-2.1 10.3-8.2 0-.2.1-.4.1-.6-.3-.2-.7-.3-1.1-.4-.1 0-.1 0-.2 0 0-.3 0-.4 0-.6z" fill="#222D65"/></svg>

export default function CheckoutPageNew() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formRef = useRef(null)

  const cardId = searchParams.get('cardId')
  const status = searchParams.get('status')
  const orderId = searchParams.get('orderId')
  const purchaseId = searchParams.get('purchase')
  const productType = searchParams.get('product')
  const productPrice = searchParams.get('price')
  const plan = searchParams.get('plan')

  const isEidSong = productType === 'eid-song'
  const isCustomDesign = productType === 'custom-design'
  const isTemplate = productType === 'template'
  const isPlan = !!plan
  const productName = searchParams.get('name') ? decodeURIComponent(searchParams.get('name')) : null
  const templateId = searchParams.get('templateId')

  // Plan pricing configuration
  const PLAN_CONFIG = {
    starter: { name: 'باقة البداية', price: 199, description: 'للأفراد والمشاريع الصغيرة — حتى 100 بطاقة سنوياً' },
    business: { name: 'باقة الأعمال', price: 599, description: 'للشركات الصغيرة والمتوسطة — حتى 500 بطاقة سنوياً' },
    enterprise: { name: 'باقة المؤسسات', price: 1999, description: 'للمؤسسات الكبيرة — بطاقات غير محدودة' },
  }

  const [loadingCard, setLoadingCard] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [step, setStep] = useState(0) // 0 = form, 1 = review
  const [errors, setErrors] = useState({})
  const [paypalReady, setPaypalReady] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' | 'paypal'
  const { exchangeInfo, isForeign, convertFromSAR, currency: visitorCurrency, currencyName, flag } = useCurrency()
  const paypalContainerRef = useRef(null)
  const paypalButtonsRef = useRef(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    recipientName: '',
  })
  const { methods: paymobMethods } = usePaymentMethods()
  const dynamicPaymentMethods = mapPaymentMethodsForDisplay(paymobMethods)
  const hasApplePay = dynamicPaymentMethods.some((m) => m.nameKey?.includes('apple'))

  // Calculate prices (moved up so they're available in handleSubmit)
  const parsedProductPrice = productPrice ? Number(productPrice) : null
  const price =
    Number(
      cardData?.price ??
      (isPlan && PLAN_CONFIG[plan]?.price) ??
      parsedProductPrice ??
      0
    ) || 0
  const egpRate = Number(exchangeInfo?.egpRate || 13.16)
  const paymobAmountEGP = Math.ceil(price * egpRate * 100) / 100
  const SAR_TO_USD = 0.2667
  const priceUSD = price ? (Math.ceil(price * SAR_TO_USD * 100) / 100).toFixed(2) : '0.00'
  const localPrice = convertFromSAR(price) // null for Saudis

  useEffect(() => { injectCheckoutCSS() }, [])

  // Load PayPal JS SDK
  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) return
    if (window.paypal) { setPaypalReady(true); return }
    const existing = document.getElementById('paypal-sdk-script')
    if (existing) { existing.addEventListener('load', () => setPaypalReady(true)); return }
    const s = document.createElement('script')
    s.id = 'paypal-sdk-script'
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&locale=ar_SA&intent=capture`
    s.async = true
    s.onload = () => setPaypalReady(true)
    s.onerror = () => console.error('Failed to load PayPal SDK')
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (status === 'success' && orderId) {
      verifySuccessfulPayment(orderId)
      return
    }
    if (status === 'failed') {
      toast.error('فشلت عملية الدفع. يمكنك المحاولة مرة أخرى.')
    }
    // Handle subscription plans (starter, business, enterprise)
    if (isPlan && PLAN_CONFIG[plan]) {
      const planInfo = PLAN_CONFIG[plan]
      setCardData({
        name: planInfo.name,
        price: planInfo.price,
        image: null,
        description: planInfo.description,
        isPlan: true,
        planType: plan,
      })
      setLoadingCard(false)
      return
    }
    if (isEidSong || isCustomDesign || isTemplate) {
      setCardData({
        name: productName || (isEidSong ? 'اصنع أغنية العيد لمن تحب' : isCustomDesign ? 'طلب تصميم خاص' : 'قالب مميز'),
        price: parseInt(productPrice) || 50,
        image: isTemplate && templateId ? `/templates/جاهزة/${templateId}.png` : null,
        description: isEidSong ? 'أغنية عيد مخصصة باسم من تحب' : isCustomDesign ? 'تصميم بطاقة تهنئة خاص ومميز حسب طلبك' : 'قالب احترافي جاهز للتخصيص',
      })
      setLoadingCard(false)
      return
    }
    if (!cardId) { setLoadingCard(false); return }
    loadCardData(cardId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId, orderId, status, plan])

  const verifySuccessfulPayment = async (currentOrderId) => {
    // ── Detect company checkout order ──
    const pendingCo = localStorage.getItem('sallim_co_pending')
    if (pendingCo) {
      try {
        const parsed = JSON.parse(pendingCo)
        if (parsed.paymobOrderId === currentOrderId) {
          localStorage.removeItem('sallim_co_pending')
          navigate(`/company-checkout?status=success&paymobOrderId=${currentOrderId}`, { replace: true })
          return
        }
      } catch (_) { /* ignore */ }
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${apiBase}/api/v1/checkout/success?orderId=${currentOrderId}`)
      const data = await response.json()
      if (!response.ok || !data.success) {
        toast.error(data.message || 'لم يكتمل التحقق من الدفع بعد')
        return
      }
      toast.success('تم الدفع بنجاح')
      if (isEidSong || isCustomDesign) {
        const recipientName = formData.recipientName || ''
        const msgText = isEidSong
          ? `مرحباً، تم دفع طلب أغنية العيد باسم: ${recipientName}\nرقم الطلب: ${currentOrderId}`
          : `مرحباً، تم دفع طلب تصميم خاص\nالاسم: ${formData.customerName}\nرقم الطلب: ${currentOrderId}`
        window.location.href = `https://wa.me/966559955339?text=${encodeURIComponent(msgText)}`
        return
      }
      // Redirect to editor with auto-download
      const redirectUrl = data.data?.redirectUrl
      if (redirectUrl) {
        const separator = redirectUrl.includes('?') ? '&' : '?'
        navigate(`${redirectUrl}${separator}autodownload=1`, { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Verify success error:', error)
      toast.error('تعذر التحقق من حالة الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  const loadCardData = async (id) => {
    // Show URL price immediately to avoid blank state (price mismatch prevention)
    if (productPrice) {
      setCardData(prev => prev || { price: parseInt(productPrice), name: '', _preloaded: true })
    }
    try {
      setLoadingCard(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiBase}/api/v1/cards/id/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'تعذر تحميل البطاقة')
      const dbCard = data.data
      // If DB price differs from what the user saw in the listing — show warning
      if (productPrice && Number(productPrice) !== Number(dbCard.price)) {
        toast(`تم تحديث السعر: ${dbCard.price} ر.س`, { icon: 'ℹ️', duration: 5000 })
      }
      setCardData(dbCard)
    } catch (error) {
      console.error('Load card error:', error)
      toast.error(error.message || 'فشل تحميل بيانات البطاقة')
    } finally {
      setLoadingCard(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((c) => ({ ...c, [name]: value }))
    if (errors[name]) setErrors((c) => ({ ...c, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.customerName.trim()) e.customerName = 'الاسم مطلوب'
    if (!formData.customerPhone.trim()) e.customerPhone = 'رقم الهاتف مطلوب'
    else if (formData.customerPhone.trim().replace(/\D/g, '').length < 7) e.customerPhone = 'رقم هاتف غير صالح'
    if (!formData.customerEmail.trim()) e.customerEmail = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) e.customerEmail = 'بريد إلكتروني غير صالح'
    if (isEidSong && !formData.recipientName.trim()) e.recipientName = 'اسم المُهدى إليه مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goToReview = () => {
    if (!validate()) return
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!cardData && !parsedProductPrice && !price) { toast.error('لم يتم تحميل بيانات المنتج'); return }
    if (!price || !paymobAmountEGP || paymobAmountEGP <= 0) { toast.error('السعر غير محدد لهذا المنتج'); return }
    if (!validate()) { setStep(0); return }

    const sessionId = crypto.randomUUID()
    localStorage.setItem('sessionId', sessionId)

    try {
      setSubmitting(true)

      const paymobCardId = isPlan ? `plan-${plan}` : cardId || templateId || 'test_card_123'
      const response = await createPaymobFlashIntention({
        cardId: paymobCardId,
        productName: cardData?.name || 'منتج رقمي',
        productType: isPlan ? 'plan' : isEidSong ? 'eid-song' : isCustomDesign ? 'custom-design' : isTemplate ? 'template' : 'card',
        planType: plan || null,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        amount: paymobAmountEGP,
        currency: 'EGP',
        sessionId,
        billing_data: {
          country: 'EG',
          city: 'Cairo',
          street: 'N/A',
        }
      })

      const paymobUrl = response?.checkoutUrl || response?.paymentUrl
      if (!response?.success || !paymobUrl) {
        console.error('Missing Paymob checkout URL', response)
        throw new Error(response?.error || 'تعذر بدء عملية الدفع، يرجى المحاولة لاحقاً')
      }

      localStorage.setItem('paymob_session_id', sessionId)
      window.location.href = paymobUrl
    } catch (error) {
      console.error('Checkout initiate error:', error)
      toast.error(error.message || 'حدث خطأ أثناء تجهيز الدفع')
    } finally {
      setSubmitting(false)
    }
  }

  // Post-PayPal-payment handler
  const handlePayPalSuccess = useCallback((captureData) => {
    toast.success('تم الدفع بنجاح عبر PayPal')
    if (isEidSong || isCustomDesign) {
      const msg = isEidSong
        ? `تم دفع أغنية العيد باسم: ${formData.recipientName}\nPayPal Order: ${captureData.orderId}`
        : `تم دفع تصميم خاص\nالاسم: ${formData.customerName}\nPayPal Order: ${captureData.orderId}`
      window.location.href = `https://wa.me/966559955339?text=${encodeURIComponent(msg)}`
    } else if (captureData.cardId) {
      navigate(`/editor?cardId=${captureData.cardId}&purchase=${captureData.captureId}&autodownload=1`, { replace: true })
    } else if (captureData.templateId || templateId) {
      navigate(`/editor?template=${captureData.templateId || templateId}&purchase=${captureData.captureId}&autodownload=1`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEidSong, isCustomDesign, formData, templateId, cardId])

  // Render PayPal Smart Buttons when SDK ready, on review step, and paypal selected
  useEffect(() => {
    if (!paypalReady || step !== 1 || paymentMethod !== 'paypal' || !paypalContainerRef.current || !price) return
    // Destroy previous buttons if any
    if (paypalButtonsRef.current) {
      try { paypalButtonsRef.current.close() } catch (_) { /* ignore */ }
      paypalButtonsRef.current = null
      if (paypalContainerRef.current) paypalContainerRef.current.innerHTML = ''
    }
    try {
      const buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 48 },
        createOrder: async () => {
          const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID()
          localStorage.setItem('sessionId', sessionId)
          const token = localStorage.getItem('token')
          const res = await fetch(`${apiBase}/api/v1/orders/paypal/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({
              product: isPlan ? `plan-${plan}` : isEidSong ? 'eid-song' : isCustomDesign ? 'custom-design' : isTemplate ? 'template' : 'card',
              amount: price,
              currency: 'SAR',
              cardId,
              templateId,
              sessionId,
              description: cardData?.name,
              ...formData,
            }),
          })
          const data = await res.json()
          if (!res.ok || !data.success) {
            const msg = data.detail || data.error || 'فشل إنشاء طلب الدفع'
            console.error('PayPal create error:', data)
            throw new Error(msg)
          }
          return data.data.orderId
        },
        onApprove: async (data) => {
          try {
            setSubmitting(true)
            const token = localStorage.getItem('token')
            const res = await fetch(`${apiBase}/api/v1/orders/paypal/capture`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              body: JSON.stringify({ orderId: data.orderID }),
            })
            const result = await res.json()
            if (!res.ok || !result.success) throw new Error(result.error || 'فشل تأكيد الدفع')
            handlePayPalSuccess(result.data)
          } catch (err) {
            console.error('PayPal capture error:', err)
            toast.error(err.message || 'فشل تأكيد الدفع')
          } finally {
            setSubmitting(false)
          }
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          toast.error('حدث خطأ في بوابة PayPal')
        },
        onCancel: () => {
          toast('تم إلغاء عملية الدفع')
        },
      })
      if (buttons.isEligible()) {
        buttons.render(paypalContainerRef.current)
        paypalButtonsRef.current = buttons
      }
    } catch (err) {
      console.error('PayPal render error:', err)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paypalReady, step, price, paymentMethod])

  /* ── Verifying payment spinner ── */
  if (submitting && status === 'success') {
    return (
      <div className="co-root" dir="rtl">
        <div className="co-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <div className="co-card co-animate" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: 420 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16a34a' }}>
              <IconShield />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>جارٍ التحقق من الدفع</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.7 }}>نراجع العملية وسيتم تحويلك تلقائيًا</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}><span className="co-spinner" style={{ borderTopColor: '#16a34a', borderColor: 'rgba(22,163,74,.15)' }} /></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="co-root" dir="rtl">
      <div className="co-container">

        {/* Header */}
        <div className="co-header co-animate">
          <button className="co-back" onClick={() => step > 0 ? setStep(0) : navigate(-1)}>
            <IconArrow />
            <span>{step > 0 ? 'تعديل البيانات' : 'عودة'}</span>
          </button>
          <h1 className="co-title">إتمام الشراء</h1>
          <span className="co-secure"><IconShield /> معاملة آمنة</span>
        </div>

        {/* Grid */}
        <div className="co-grid">

          {/* RIGHT COLUMN — Form / Review */}
          <div>

            {/* Step 0: Form */}
            {step === 0 && (
              <div className="co-card co-animate" style={{ padding: '28px 24px' }} ref={formRef}>
                <h2 className="co-form-title">بيانات المشتري</h2>
                <p className="co-form-sub">أدخل بياناتك للمتابعة لبوابة الدفع الآمنة</p>

                {/* Name */}
                <div className="co-input-wrap">
                  <label className="co-label"><span className="co-req">*</span> الاسم الكامل</label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="الاسم الكامل" style={errors.customerName ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-l"><IconUser /></span>
                  </div>
                  {errors.customerName && <div className="co-error">{errors.customerName}</div>}
                </div>

                {/* Phone */}
                <div className="co-input-wrap">
                  <label className="co-label"><span className="co-req">*</span> رقم الهاتف</label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" dir="ltr" name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="05xxxxxxxx" style={errors.customerPhone ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-r"><IconPhone /></span>
                  </div>
                  {errors.customerPhone && <div className="co-error">{errors.customerPhone}</div>}
                </div>

                {/* Email */}
                <div className="co-input-wrap">
                  <label className="co-label"><span className="co-req">*</span> البريد الإلكتروني</label>
                  <div style={{ position: 'relative' }}>
                    <input className="co-input" dir="ltr" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="name@example.com" style={errors.customerEmail ? { borderColor: '#dc2626' } : {}} />
                    <span className="co-input-icon co-input-icon-r"><IconMail /></span>
                  </div>
                  {errors.customerEmail && <div className="co-error">{errors.customerEmail}</div>}
                </div>

                {/* Recipient (Eid Song only) */}
                {isEidSong && (
                  <div className="co-input-wrap">
                    <label className="co-label"><span className="co-req">*</span> اسم الشخص المُهدى إليه</label>
                    <div style={{ position: 'relative' }}>
                      <input className="co-input" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="اسم الشخص الذي ستُهدى إليه الأغنية" style={{ background: '#fffbeb', ...(errors.recipientName ? { borderColor: '#dc2626' } : {}) }} />
                      <span className="co-input-icon co-input-icon-l"><IconGift /></span>
                    </div>
                    {errors.recipientName && <div className="co-error">{errors.recipientName}</div>}
                  </div>
                )}

                <hr className="co-divider" />

                <button className="co-btn co-btn-primary" onClick={goToReview}>
                  متابعة للمراجعة
                  <IconArrow />
                </button>

                <div className="co-trust-row">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconLock /> دفع مشفر</span>
                  <span>منتج سعودي</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconShield /> التسليم في نفس اليوم</span>
                </div>
              </div>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <div className="co-card co-animate" style={{ padding: '28px 24px' }}>
                <h2 className="co-form-title">مراجعة الطلب</h2>
                <p className="co-form-sub">تأكد من البيانات قبل إتمام الدفع</p>

                {/* Review fields */}
                <div style={{ marginBottom: 20 }}>
                  {[
                    { label: 'الاسم', value: formData.customerName },
                    { label: 'الهاتف', value: formData.customerPhone },
                    ...(formData.customerEmail ? [{ label: 'البريد', value: formData.customerEmail }] : []),
                    ...(isEidSong ? [{ label: 'المُهدى إليه', value: formData.recipientName }] : []),
                  ].map((f) => (
                    <div key={f.label} className="co-review-field">
                      <span className="co-review-label">{f.label}</span>
                      <span className="co-review-value">{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Product + Total */}
                <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
                    <span style={{ color: '#6b7280' }}>{cardData?.name || 'المنتج'}</span>
                    <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>{price} <SAR size={11} /></span>
                  </div>
                  <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>الإجمالي</span>
                    <span style={{ fontSize: 18, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>{price} <SAR size={15} /></span>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 8, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6b7280' }}>
                      <span>المبلغ بالدولار (PayPal)</span>
                      <span style={{ fontWeight: 700, color: '#003087' }}>${priceUSD} USD</span>
                    </div>
                  )}
                </div>

                {/* ── Payment Method Selector ── */}
                <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 12px', color: '#374151' }}>اختر طريقة الدفع</h3>

                <div className="co-pay-tabs">
                  {/* PayPal Tab */}
                  {PAYPAL_CLIENT_ID && (
                    <div className={`co-pay-tab${paymentMethod === 'paypal' ? ' co-pay-active' : ''}`} onClick={() => setPaymentMethod('paypal')}>
                      <div className="co-pay-tab-check"><svg viewBox="0 0 20 20" fill="#fff" style={{width:11,height:11}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>
                      <div className="co-pay-tab-logos">
                        <LogoPayPal size={36} />
                      </div>
                      <span className="co-pay-tab-label">PayPal</span>
                      <span className="co-pay-tab-sub">يتم الدفع بالدولار (${priceUSD})</span>
                    </div>
                  )}

                  {/* Card Tab (PayMob) */}
                  <div className={`co-pay-tab${paymentMethod === 'card' ? ' co-pay-active' : ''}`} onClick={() => setPaymentMethod('card')}>
                    <div className="co-pay-tab-check"><svg viewBox="0 0 20 20" fill="#fff" style={{width:11,height:11}}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>
                    <div className="co-pay-tab-logos">
                      <LogoVisa size={38} />
                      <LogoMastercard size={28} />
                      <LogoApplePay size={34} />
                    </div>
                    <span className="co-pay-tab-label">بطاقة بنكية</span>
                    <span className="co-pay-tab-sub">Visa / Mastercard / Apple Pay</span>
                  </div>
                </div>

                {/* ── PayPal Warning ── */}
                {paymentMethod === 'paypal' && PAYPAL_CLIENT_ID && (
                  <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 11, color: '#1e40af', lineHeight: 1.8, textAlign: 'center', marginBottom: 14 }}>
                    سيتم تحويل المبلغ تلقائياً من {price} ر.س إلى <strong>${priceUSD} USD</strong> — PayPal لا يدعم الريال السعودي مباشرة
                    <br />
                    <span style={{ color: '#991b1b' }}>⚠ لا يدعم بطاقات مدى — استخدم Visa أو Mastercard أو رصيد PayPal</span>
                  </div>
                )}

                {/* ── PayPal Smart Buttons ── */}
                {paymentMethod === 'paypal' && PAYPAL_CLIENT_ID && (
                  <div style={{ marginBottom: 14 }}>
                    <div ref={paypalContainerRef} style={{ minHeight: paypalReady ? 52 : 0 }} />
                    {!paypalReady && (
                      <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: '#9ca3af' }}>
                        <span className="co-spinner" style={{ borderTopColor: '#003087', borderColor: 'rgba(0,48,135,.15)', width: 16, height: 16 }} />{' '}
                        جارٍ تحميل PayPal...
                      </div>
                    )}
                  </div>
                )}

                {/* ── Card Payment Button (PayMob) ── */}
                {paymentMethod === 'card' && (
                  <>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#111827', marginBottom: 6 }}>ندعم</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {(dynamicPaymentMethods.length > 0 ? dynamicPaymentMethods : null)?.map((m) => (
                          <div key={m.id} style={{ minHeight: 40, minWidth: 68, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '6px 8px' }}>
                            {m.logo ? (
                              <img src={m.logo} alt={m.name} style={{ maxHeight: 36, width: 'auto', objectFit: 'contain' }} />
                            ) : (
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{m.name}</span>
                            )}
                          </div>
                        ))}
                        {dynamicPaymentMethods.length === 0 && (
                          <>
                            <LogoVisa size={42} />
                            <LogoMastercard size={32} />
                            <LogoApplePay size={40} />
                          </>
                        )}
                      </div>
                    </div>

                    {/* ── EGP Notice — Paymob charges in EGP, shown to ALL users ── */}
                    {exchangeInfo?.egpRate && price > 0 && (
                      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <span style={{ fontSize: 14 }}>🏦</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>تنبيه مهم — المبلغ في كشف حسابك</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                          <div style={{ flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '10px 6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 3 }}>🇸🇦 السعر</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>{price} <SAR size={14} /></div>
                          </div>
                          <div style={{ fontSize: 18, color: '#1e40af', fontWeight: 900 }}>→</div>
                          <div style={{ flex: 1, textAlign: 'center', background: '#f0f9ff', borderRadius: 10, padding: '10px 6px', border: '1px solid #bae6fd' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 3 }}>🇪🇬 يُخصم من بطاقتك</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#1e40af' }}>{(Math.ceil(price * exchangeInfo.egpRate * 100) / 100).toFixed(2)} EGP</div>
                          </div>
                        </div>
                        <p style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.7 }}>
                          بوابة الدفع تعالج المبلغ بالجنيه المصري (EGP) · سعر الصرف: 1 ر.س = {exchangeInfo.egpRate?.toFixed(2)} ج.م · بدون رسوم إضافية
                        </p>
                      </div>
                    )}

                    {/* ── Currency Converter — visible for non-Saudi visitors ── */}
                    {isForeign && localPrice && visitorCurrency !== 'EGP' && (
                      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'co-pulse 2s infinite' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>💱 محوّل العملات — سعر لحظي</span>
                          </div>
                          {exchangeInfo?.updatedAt && (
                            <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 600 }}>
                              {new Date(exchangeInfo.updatedAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                          <div style={{ flex: 1, textAlign: 'center', background: '#f8fafc', borderRadius: 10, padding: '10px 6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 3 }}>🇸🇦 ريال سعودي</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>{price} <SAR size={14} /></div>
                          </div>
                          <div style={{ fontSize: 18, color: '#b8860b', fontWeight: 900 }}>≈</div>
                          <div style={{ flex: 1, textAlign: 'center', background: '#f0fdf4', borderRadius: 10, padding: '10px 6px', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#9ca3af', marginBottom: 3 }}>{flag} {currencyName}</div>
                            <div style={{ fontSize: 20, fontWeight: 900, color: '#166534' }}>{localPrice}</div>
                          </div>
                        </div>
                        <p style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center', margin: '8px 0 0', lineHeight: 1.6 }}>
                          سعر الصرف: 1 ر.س = {exchangeInfo?.visitorRate?.toFixed(4)} {visitorCurrency} · المصدر: open.er-api.com
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                      <button className="co-btn co-btn-outline" style={{ flex: 1 }} onClick={() => setStep(0)}>تعديل</button>
                    </div>
                    {hasApplePay && (
                      <button
                        className="co-btn"
                        onClick={handleSubmit}
                        disabled={submitting || loadingCard}
                        style={{ marginBottom: 10, background: '#111827', color: '#fff' }}
                      >
                        {submitting ? <span className="co-spinner" /> : (
                          <>
                            <LogoApplePay size={46} />
                            <span>ادفع الآن عبر Apple Pay</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{price} <SAR size={12} color="#fff" /></span>
                          </>
                        )}
                      </button>
                    )}
                    <button className="co-btn co-btn-primary" onClick={handleSubmit} disabled={submitting || loadingCard} style={{ marginBottom: 12 }}>
                        {submitting ? <span className="co-spinner" /> : (
                          <>
                            <IconLock />
                            <span>ادفع بالفيزا / ماستركارد</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>{price} <SAR size={12} color="#fff" /></span>
                          </>
                        )}
                      </button>
                    <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', margin: '0 0 6px', lineHeight: 1.6 }}>
                      ستنتقل لبوابة الدفع المشفرة لإتمام العملية بأمان
                    </p>
                  </>
                )}

                {/* Back button for PayPal mode */}
                {paymentMethod === 'paypal' && (
                  <div style={{ marginBottom: 12 }}>
                    <button className="co-btn co-btn-outline" onClick={() => setStep(0)}>تعديل البيانات</button>
                  </div>
                )}

                <div style={{ marginTop: 10, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, fontSize: 11, color: '#92400e', lineHeight: 1.8, textAlign: 'center' }}>
                  {paymentMethod === 'paypal'
                    ? `سيظهر المبلغ في إشعار البنك بالدولار ($${priceUSD} USD) وهو ما يعادل ${price} ر.س — بدون رسوم إضافية.`
                    : exchangeInfo?.egpRate
                      ? `سيظهر في كشف حسابك ${(Math.ceil(price * exchangeInfo.egpRate * 100) / 100).toFixed(2)} جنيه مصري (EGP) وهو ما يعادل ${price} ر.س — بدون رسوم إضافية.`
                      : `المبلغ المطلوب ${price} ر.س فقط — تتم معالجة الدفع بشكل آمن ومشفّر.`
                  }
                </div>
              </div>
            )}
          </div>

          {/* LEFT COLUMN — Order Summary */}
          <aside style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <div className="co-card co-summary co-animate">

              {/* Product Image */}
              <div className="co-summary-img">
                {loadingCard ? (
                  <div className="co-summary-placeholder"><span className="co-spinner" style={{ borderTopColor: '#6366f1', borderColor: 'rgba(99,102,241,.15)' }} /></div>
                ) : cardData?.image ? (
                  <img src={cardData.image} alt={cardData?.name || ''} />
                ) : (
                  <div className="co-summary-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:36,height:36,opacity:.4}}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <span>{isEidSong ? 'أغنية العيد' : isCustomDesign ? 'تصميم خاص' : 'قالب مميز'}</span>
                  </div>
                )}
                <div className="co-price-badge">
                  <span>{price}</span>
                  <SAR size={13} color="#fff" />
                </div>
              </div>

              {/* Product info */}
              <div className="co-summary-body">
                <h3 className="co-product-name">{cardData?.name || 'منتج رقمي'}</h3>
                <p className="co-product-desc">{cardData?.description || 'يُفعَّل فور نجاح الدفع'}</p>

                {/* Benefits */}
                {['التسليم في نفس اليوم بعد إتمام الدفع', 'بدون علامة مائية على التصميم', 'دعم فني في حال واجهتك مشكلة', 'دفع مشفر وآمن بالكامل'].map((b) => (
                  <div key={b} className="co-benefit">
                    <div className="co-benefit-icon"><IconCheck /></div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="co-total-row">
                <span className="co-total-label">الإجمالي</span>
                <div>
                  <span className="co-total-value">{price} <SAR size={15} /></span>
                  {isForeign && localPrice && (
                    <div style={{ fontSize: 11, color: '#6b7280', textAlign: 'left', marginTop: 2 }}>≈ {localPrice} {currencyName}</div>
                  )}
                </div>
              </div>

              {/* Payment methods */}
              <div className="co-methods" style={{ gap: 6, flexWrap: 'wrap' }}>
                {dynamicPaymentMethods.length > 0 ? (
                  dynamicPaymentMethods.map((m) => (
                    <div key={m.id} style={{ minHeight: 32, minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 6px' }}>
                      {m.logo ? (
                        <img src={m.logo} alt={m.name} style={{ maxHeight: 28, width: 'auto', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{m.name}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <LogoVisa size={36} />
                    <LogoMastercard size={24} />
                    <LogoApplePay size={32} />
                    {PAYPAL_CLIENT_ID && <LogoPayPal size={32} />}
                  </>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
