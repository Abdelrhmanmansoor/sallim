// New Saudi Riyal Symbol (SAMA 2020 official redesign)
// SVG representation of the new symbol: stylized ر with two horizontal bars
const SARSymbol = ({ size = 14, color = 'currentColor', style = {} }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size * 1.4}
    height={size}
    viewBox="0 0 28 20"
    fill="none"
    style={{ display: 'inline-block', verticalAlign: '-2px', ...style }}
    aria-label="ريال سعودي"
    role="img"
  >
    {/* Ra curve — the body of the new SAR symbol */}
    <path
      d="M26 3 C24 3 20 3 16 5.5 C12 8 10 12 11.5 15.5 C13 19 17.5 20 21 18 C24.5 16 26.5 12 25 8 C24 5.5 22 4 20 3.5"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Two horizontal bars */}
    <line x1="3" y1="10.5" x2="18" y2="10.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="15" x2="18" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export default SARSymbol
