import { useId, type ReactNode } from 'react';
import type { SceneVariant } from '@/lib/collections';

/**
 * Original, lightweight SVG landscapes used as atmospheric backdrops.
 * Pure server components – no JS shipped, no images to download.
 */

type Element =
  | 'city'
  | 'floating'
  | 'waterfall'
  | 'ruins'
  | 'forest'
  | 'crystals'
  | 'arch'
  | 'columns'
  | 'tents'
  | 'sea'
  | 'runes'
  | 'gold'
  | 'path';

interface SceneConfig {
  sky: [string, string, string];
  sun?: { x: number; y: number; r: number; color: string };
  far: string;
  mid: string;
  near: string;
  elements: Element[];
}

const CONFIG: Record<SceneVariant, SceneConfig> = {
  hero: { sky: ['#5DB1E8', '#B9E0EE', '#FBE7B0'], sun: { x: 880, y: 150, r: 64, color: '#FFF4C9' }, far: '#9BB4DC', mid: '#7896C8', near: '#4F9A73', elements: ['floating', 'city', 'waterfall', 'ruins', 'crystals', 'forest', 'path'] },
  singles: { sky: ['#A9D9EC', '#E4EFE2', '#FBEFD0'], sun: { x: 300, y: 140, r: 50, color: '#FFF4C9' }, far: '#C0D0E4', mid: '#97B6A8', near: '#5E9A78', elements: ['ruins', 'forest', 'path'] },
  archive: { sky: ['#26365F', '#5B5FA6', '#C9BDE8'], far: '#4B5A93', mid: '#3B4A7E', near: '#2A3760', elements: ['columns', 'runes', 'crystals'] },
  supply: { sky: ['#B7DCEB', '#F4E4BE', '#FBE9C6'], sun: { x: 900, y: 130, r: 48, color: '#FFF1BF' }, far: '#C9C3B0', mid: '#A8B39A', near: '#6F9A6F', elements: ['tents', 'forest', 'path'] },
  treasure: { sky: ['#2A2744', '#6A4E8E', '#EBC87A'], far: '#4E406F', mid: '#3A3059', near: '#2B2444', elements: ['arch', 'crystals', 'gold', 'runes'] },
  gateway: { sky: ['#9AD6E6', '#D6EEEA', '#FAEBC2'], sun: { x: 600, y: 170, r: 60, color: '#FFF6D2' }, far: '#B4C9E0', mid: '#86A7CB', near: '#5E9A78', elements: ['waterfall', 'arch', 'crystals', 'forest'] },
  catalog: { sky: ['#9CD0EC', '#D7E8E6', '#FBECC8'], sun: { x: 220, y: 150, r: 52, color: '#FFF4C9' }, far: '#B6C8E2', mid: '#92ACC9', near: '#5E9A78', elements: ['city', 'forest', 'path'] },
  pokemon: { sky: ['#8ED2EE', '#D9F0E4', '#FDF1C9'], sun: { x: 940, y: 130, r: 56, color: '#FFF4C9' }, far: '#B8D4E4', mid: '#8BC0A8', near: '#4F9A73', elements: ['floating', 'waterfall', 'forest'] },
  riftbound: { sky: ['#4B4F9E', '#8E7BD0', '#F3CDAE'], sun: { x: 300, y: 190, r: 44, color: '#FFE7BE' }, far: '#6E69B4', mid: '#564F98', near: '#3A3677', elements: ['city', 'crystals', 'arch', 'runes'] },
  'one-piece': { sky: ['#F7A96B', '#FAD8A0', '#9AD6E6'], sun: { x: 820, y: 210, r: 70, color: '#FFF1BF' }, far: '#D9A27E', mid: '#7FB2C8', near: '#3F86A8', elements: ['sea', 'floating'] },
  vault: { sky: ['#E5E0F2', '#C8D5F0', '#F7E7B7'], sun: { x: 600, y: 120, r: 70, color: '#FFFAE0' }, far: '#C7CBE3', mid: '#AEB6D8', near: '#8D96C0', elements: ['columns', 'arch', 'crystals', 'gold'] },
  story: { sky: ['#B5DDEB', '#F2E6C4', '#FBEBC8'], sun: { x: 260, y: 140, r: 46, color: '#FFF1BF' }, far: '#C6C9B8', mid: '#A5B59A', near: '#6F9A6F', elements: ['tents', 'forest', 'path'] },
  sell: { sky: ['#9CD0EC', '#D8E8F0', '#FBEBC8'], sun: { x: 900, y: 140, r: 50, color: '#FFF4C9' }, far: '#B6C8E2', mid: '#8DA8CC', near: '#5E9A78', elements: ['city', 'floating', 'crystals', 'forest'] },
  plain: { sky: ['#DCE7F2', '#F1EBDD', '#FBF3DD'], far: '#D0D9E8', mid: '#BAC8DC', near: '#A9BCD2', elements: [] },
};

const W = 1200;
const H = 600;
const STONE = '#EADFC8';
const STONE_SHADE = '#CDBF9F';
const GOLD = '#C9A252';

function rng(seed: number) {
  let t = seed;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(seed: number, base: number, amp: number, n: number, sharp = true): string {
  const r = rng(seed);
  const pts = Array.from({ length: n + 1 }, (_, i) => [(i * W) / n, base - amp * (0.15 + 0.85 * r()) * (sharp ? (i % 2 ? 1 : 0.45) : 1)] as const);
  let d = `M0,${H} L0,${pts[0][1].toFixed(1)}`;
  if (sharp) pts.slice(1).forEach(([x, y]) => (d += ` L${x.toFixed(1)},${y.toFixed(1)}`));
  else
    pts.slice(1).forEach(([x, y], i) => {
      const [px, py] = pts[i];
      d += ` Q${px.toFixed(1)},${py.toFixed(1)} ${((px + x) / 2).toFixed(1)},${((py + y) / 2).toFixed(1)}`;
    });
  return `${d} L${W},${H} Z`;
}

function Crystal({ x, y, s = 1, glow = true, uid }: { x: number; y: number; s?: number; glow?: boolean; uid: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && <ellipse cx="0" cy="-30" rx="70" ry="60" fill="#55C5D5" opacity="0.25" className="animate-crystal" />}
      <polygon points="-34,0 -22,-62 -8,-20 -12,0" fill="#4778D0" />
      <polygon points="-6,0 6,-120 26,-34 22,0" fill={`url(#crystalA${uid})`} />
      <polygon points="6,-120 26,-34 12,-50" fill="#BFF3F8" opacity="0.7" />
      <polygon points="20,0 34,-52 52,-12 46,0" fill="#7965B6" />
      <polygon points="-6,0 6,-120 -2,-60" fill="#55C5D5" opacity="0.8" />
    </g>
  );
}

function Tower({ x, y, w, h, roof = '#4778D0' }: { x: number; y: number; w: number; h: number; roof?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={STONE} />
      <rect x={x} y={y - h} width={w / 2} height={h} fill={STONE_SHADE} opacity="0.55" />
      <polygon points={`${x - w / 2 - 4},${y - h} ${x},${y - h - w * 1.1} ${x + w / 2 + 4},${y - h}`} fill={roof} />
      <rect x={x - 2.5} y={y - h * 0.7} width="5" height="9" rx="2.5" fill="#F7D888" />
      <rect x={x - 2.5} y={y - h * 0.38} width="5" height="9" rx="2.5" fill="#F7D888" />
    </g>
  );
}

function City({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 250},${y + 40} L${x - 170},${y - 6} L${x + 170},${y - 6} L${x + 250},${y + 40} Z`} fill="#A5B6D2" />
      <Tower x={x - 150} y={y} w={26} h={70} />
      <Tower x={x - 96} y={y} w={32} h={110} roof="#7965B6" />
      <Tower x={x + 96} y={y} w={32} h={96} roof="#7965B6" />
      <Tower x={x + 150} y={y} w={24} h={62} />
      <path d={`M${x - 80},${y - 70} Q${x},${y - 100} ${x + 80},${y - 70}`} stroke={STONE} strokeWidth="6" fill="none" />
      <Tower x={x} y={y} w={52} h={170} roof="#4778D0" />
      <circle cx={x} cy={y - 170 - 52 * 1.1 - 12} r="9" fill="#BFF3F8" />
      <circle cx={x} cy={y - 170 - 52 * 1.1 - 12} r="22" fill="#55C5D5" opacity="0.35" className="animate-crystal" />
      <rect x={x - 12} y={y - 28} width="24" height="28" rx="12" fill="#2C3F66" opacity="0.65" />
    </g>
  );
}

function FloatingIsland({ x, y, s = 1, ruin = true }: { x: number; y: number; s?: number; ruin?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="animate-drift">
        <path d="M-62,0 Q0,16 62,0 L38,42 Q6,86 -26,40 Z" fill="#B7A98B" />
        <path d="M-62,0 Q0,-14 62,0 Q0,16 -62,0 Z" fill="#6DB387" />
        {ruin && (
          <g>
            <rect x="-26" y="-44" width="9" height="42" fill={STONE} />
            <rect x="14" y="-34" width="9" height="32" fill={STONE} />
            <path d="M-26,-44 Q-6,-66 14,-34" stroke={STONE} strokeWidth="8" fill="none" />
          </g>
        )}
        <polygon points="6,40 12,66 18,38" fill="#55C5D5" opacity="0.8" />
      </g>
    </g>
  );
}

function Waterfall({ x, y, uid }: { x: number; y: number; uid: string }) {
  return (
    <g>
      <path d={`M${x - 70},${y - 40} L${x + 70},${y - 40} L${x + 60},${y + 190} L${x - 60},${y + 190} Z`} fill="#8C9BB8" />
      <rect x={x - 22} y={y - 24} width="44" height="214" fill={`url(#falls${uid})`} />
      <ellipse cx={x} cy={y + 196} rx="64" ry="16" fill="#fff" opacity="0.55" />
    </g>
  );
}

function Arch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-86" y="-150" width="26" height="150" fill={STONE} />
      <rect x="60" y="-150" width="26" height="150" fill={STONE} />
      <rect x="-60" y="-150" width="8" height="150" fill={STONE_SHADE} opacity="0.6" />
      <path d="M-98,-146 Q0,-250 98,-146" stroke={STONE} strokeWidth="26" fill="none" />
      <path d="M-98,-146 Q0,-250 98,-146" stroke={GOLD} strokeWidth="3" fill="none" transform="translate(0 -10)" />
      <path d="M-56,0 L-56,-110 Q0,-190 56,-110 L56,0 Z" fill="#9EDDE8" opacity="0.55" className="animate-crystal" />
    </g>
  );
}

function Ruins({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 70} y={y - 110} width="20" height="110" fill={STONE} />
      <rect x={x - 76} y={y - 118} width="32" height="10" fill={STONE_SHADE} />
      <rect x={x + 10} y={y - 70} width="20" height="70" fill={STONE} />
      <rect x={x + 4} y={y - 78} width="32" height="10" fill={STONE_SHADE} />
      <path d={`M${x - 70},${y - 118} Q${x - 20},${y - 170} ${x + 20},${y - 80}`} stroke={STONE} strokeWidth="14" fill="none" />
      <rect x={x + 50} y={y - 22} width="46" height="22" fill={STONE_SHADE} />
      <ellipse cx={x + 20} cy={y} rx="110" ry="9" fill="#2F5B45" opacity="0.2" />
    </g>
  );
}

function Columns({ gold }: { gold: boolean }) {
  const xs = [120, 340, 860, 1080];
  return (
    <g>
      <rect x="0" y="470" width={W} height="130" fill="#000" opacity="0.18" />
      {xs.map((x) => (
        <g key={x}>
          <rect x={x - 26} y="120" width="52" height="352" fill={STONE} />
          <rect x={x + 4} y="120" width="22" height="352" fill={STONE_SHADE} opacity="0.55" />
          <rect x={x - 38} y="104" width="76" height="22" fill={STONE_SHADE} />
          <rect x={x - 38} y="468" width="76" height="22" fill={STONE_SHADE} />
          {gold && <rect x={x - 38} y="126" width="76" height="3" fill={GOLD} />}
        </g>
      ))}
      <path d="M94,110 Q230,-10 366,110" stroke={STONE} strokeWidth="22" fill="none" />
      <path d="M834,110 Q970,-10 1106,110" stroke={STONE} strokeWidth="22" fill="none" />
      <path d="M0,490 L1200,490 L1200,600 L0,600 Z" fill="#000" opacity="0.18" />
    </g>
  );
}

function Tents() {
  return (
    <g>
      <g transform="translate(250 470)">
        <polygon points="-90,0 0,-92 90,0" fill="#F3E8D0" />
        <polygon points="0,-92 90,0 24,0" fill="#D9C9A5" />
        <polygon points="-22,0 0,-46 22,0" fill="#6E5A3C" />
        <line x1="0" y1="-92" x2="0" y2="-124" stroke="#6E5A3C" strokeWidth="3" />
        <polygon points="0,-124 36,-112 0,-100" fill="#4778D0" />
      </g>
      <g transform="translate(470 490) scale(0.75)">
        <polygon points="-90,0 0,-92 90,0" fill="#E7D9B6" />
        <polygon points="0,-92 90,0 24,0" fill="#CDBB92" />
        <polygon points="-22,0 0,-46 22,0" fill="#6E5A3C" />
      </g>
      <rect x="690" y="470" width="44" height="34" fill="#A98657" />
      <rect x="716" y="448" width="40" height="30" fill="#BE9A66" />
      <circle cx="620" cy="486" r="30" fill="#F7D888" opacity="0.35" />
      <circle cx="620" cy="486" r="7" fill="#F7B85B" />
    </g>
  );
}

function Sea() {
  return (
    <g>
      <rect x="0" y="360" width={W} height="240" fill="#5FB4CF" />
      {[380, 430, 485, 540].map((y, i) => (
        <path key={y} d={`M0,${y} Q150,${y - 14} 300,${y} T600,${y} T900,${y} T1200,${y} V600 H0 Z`} fill={['#6CBFD8', '#4FA5C4', '#3F90B4', '#2F7BA0'][i]} opacity="0.85" />
      ))}
      <path d="M180,400 q50,-80 110,0 z" fill="#8BB88A" />
      <path d="M840,410 q70,-110 150,0 z" fill="#79AC7F" />
      <g transform="translate(560 410)">
        <path d="M-40,0 L40,0 L26,18 L-26,18 Z" fill="#8B6A43" />
        <line x1="0" y1="0" x2="0" y2="-80" stroke="#6E5A3C" strokeWidth="3" />
        <path d="M0,-78 L44,-12 L0,-12 Z" fill="#FBF1D5" />
        <path d="M0,-70 L-30,-12 L0,-12 Z" fill="#EFE2BC" />
      </g>
    </g>
  );
}

function Forest({ seed, y }: { seed: number; y: number }) {
  const r = rng(seed);
  const trees: ReactNode[] = [];
  for (let x = -10, i = 0; x < W + 20; x += 26 + r() * 22, i++) {
    const h = 54 + r() * 56;
    const shade = ['#3F8561', '#4F9A73', '#63AE7F'][Math.floor(r() * 3)];
    trees.push(
      r() > 0.4 ? (
        <g key={i}>
          <rect x={x - 2} y={y - 8} width="4" height="14" fill="#6B5336" />
          <polygon points={`${x - 18},${y - 6} ${x},${y - h} ${x + 18},${y - 6}`} fill={shade} />
          <polygon points={`${x - 14},${y - h * 0.5} ${x},${y - h - 14} ${x + 14},${y - h * 0.5}`} fill={shade} />
        </g>
      ) : (
        <g key={i}>
          <rect x={x - 2} y={y - 6} width="4" height="14" fill="#6B5336" />
          <circle cx={x} cy={y - h * 0.5} r={h * 0.34} fill={shade} />
        </g>
      ),
    );
  }
  return <g>{trees}</g>;
}

function Runes({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g fill="none" stroke={GOLD} opacity="0.55" strokeWidth="1.5">
      <circle cx={x} cy={y} r={r} />
      <circle cx={x} cy={y} r={r * 0.82} strokeDasharray="3 9" />
      <circle cx={x} cy={y} r={r * 0.6} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={x + Math.cos(a) * r * 0.6} y1={y + Math.sin(a) * r * 0.6} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} />;
      })}
      <polygon points={`${x},${y - r * 0.6} ${x + r * 0.52},${y + r * 0.3} ${x - r * 0.52},${y + r * 0.3}`} />
    </g>
  );
}

function Sparkles({ seed }: { seed: number }) {
  const r = rng(seed);
  return (
    <g fill="#F7D888">
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={r() * W} cy={80 + r() * 380} r={1.2 + r() * 2.2} opacity={0.4 + r() * 0.5} />
      ))}
    </g>
  );
}

export function Scene({ variant, className = '' }: { variant: SceneVariant; className?: string }) {
  const c = CONFIG[variant];
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const has = (e: Element) => c.elements.includes(e);
  const dark = variant === 'archive' || variant === 'treasure' || variant === 'riftbound';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={`h-full w-full ${className}`}>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[0]} />
          <stop offset="0.55" stopColor={c.sky[1]} />
          <stop offset="1" stopColor={c.sky[2]} />
        </linearGradient>
        <linearGradient id={`crystalA${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFF3F8" />
          <stop offset="1" stopColor="#4778D0" />
        </linearGradient>
        <linearGradient id={`falls${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#BFEFF6" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id={`sun${uid}`}>
          <stop offset="0" stopColor={c.sun?.color ?? '#fff'} stopOpacity="0.95" />
          <stop offset="1" stopColor={c.sun?.color ?? '#fff'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`path${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5EBD3" />
          <stop offset="1" stopColor="#D8C9A6" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#sky${uid})`} />
      {c.sun && (
        <g>
          <circle cx={c.sun.x} cy={c.sun.y} r={c.sun.r * 3.4} fill={`url(#sun${uid})`} />
          <circle cx={c.sun.x} cy={c.sun.y} r={c.sun.r} fill={c.sun.color} />
        </g>
      )}
      {dark && <Sparkles seed={7} />}

      {has('runes') && <Runes x={600} y={dark ? 210 : 190} r={dark ? 130 : 110} />}
      {has('floating') && (
        <>
          <FloatingIsland x={160} y={150} s={0.8} />
          <FloatingIsland x={1040} y={110} s={0.6} ruin={false} />
        </>
      )}

      {!has('sea') && !has('columns') && <path d={ridge(3, 360, 190, 9)} fill={c.far} />}
      {has('city') && <City x={variant === 'catalog' || variant === 'riftbound' ? 840 : variant === 'hero' ? 640 : 760} y={330} />}
      {!has('sea') && !has('columns') && <path d={ridge(11, 440, 150, 13)} fill={c.mid} />}
      {has('waterfall') && <Waterfall uid={uid} x={variant === 'gateway' ? 940 : 330} y={300} />}
      {has('sea') && <Sea />}
      {has('columns') && <Columns gold={has('gold')} />}
      {has('arch') && <Arch x={variant === 'hero' ? 150 : 600} y={470} s={variant === 'hero' ? 0.8 : 1.15} />}
      {has('ruins') && <Ruins x={variant === 'hero' ? 150 : 220} y={480} />}
      {has('tents') && <Tents />}

      {!has('sea') && !has('columns') && <path d={ridge(23, 520, 70, 8, false)} fill={c.near} />}
      {has('forest') && <Forest seed={5} y={540} />}
      {has('path') && <path d="M470,600 C520,545 575,520 590,490 C602,466 588,448 602,428 L630,428 C644,450 654,470 644,492 C630,522 700,548 770,600 Z" fill={`url(#path${uid})`} opacity="0.92" />}
      {has('crystals') && (
        <>
          <Crystal uid={uid} x={dark ? 220 : 1010} y={dark ? 520 : 540} s={dark ? 1.1 : 0.9} />
          <Crystal uid={uid} x={dark ? 980 : 90} y={dark ? 530 : 560} s={0.7} />
        </>
      )}
      {has('gold') && <Sparkles seed={19} />}
      <rect width={W} height="22" y={H - 22} fill={c.near} />
    </svg>
  );
}
