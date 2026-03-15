/**
 * New Saudi Riyal Symbol (2020)
 * Renders the official SAR symbol as inline SVG
 * Usage: <SAR /> or <SAR size={14} color="#0f172a" />
 */
export default function SAR({ size = 14, color = 'currentColor', className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className={className}
      style={{ display: 'inline', verticalAlign: 'middle', marginBottom: '1px' }}
      aria-label="ريال سعودي"
    >
      {/* New Saudi Riyal Symbol — stylized ر with two horizontal bars */}
      <path d="M4 5 C4 5 7 5 10 5 C13 5 15 6.5 15 9 C15 11.5 13 13 10 13 L7 13 L7 15 L13 15 L13 17 L7 17 L7 20 L5 20 L5 17 L3 17 L3 15 L5 15 L5 13 L4 13 Z M7 7 L7 11 L10 11 C11.7 11 13 10.1 13 9 C13 7.9 11.7 7 10 7 Z" />
      <line x1="16" y1="8" x2="21" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
