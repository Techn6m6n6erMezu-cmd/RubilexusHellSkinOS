import { useSigil } from '../contexts/SigilContext';

interface SigilMarkProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

function HorseSigilSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 4C25 4 20 8 18 13C15 20 17 27 22 31L20 56H28L30 38C31 39 32 39 33 39L35 56H43L41 31C46 27 48 20 45 13C43 8 39 4 32 4Z"
        fill={color}
        opacity="0.95"
      />
      <path
        d="M30 4C27 5 24 8 23 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M27 3C24 4 21 7 20 11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="38" cy="18" r="2.5" fill="black" opacity="0.6" />
      <ellipse cx="42" cy="29" rx="2" ry="1.2" fill="black" opacity="0.4" />
      <path
        d="M22 31C18 28 16 22 18 17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />
    </svg>
  );
}

export default function SigilMark({ size = 40, color = '#dc2626', className = '', style }: SigilMarkProps) {
  const { sigil, isDefault } = useSigil();

  if (!isDefault && sigil.sigil_url) {
    return (
      <img
        src={sigil.sigil_url}
        alt="System Sigil"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain', ...style }}
      />
    );
  }

  return (
    <span className={className} style={style}>
      <HorseSigilSVG size={size} color={color} />
    </span>
  );
}

export { HorseSigilSVG };
