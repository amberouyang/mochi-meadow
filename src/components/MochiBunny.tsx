import { useId } from 'react';

/** Soft bunny-shaped mochi — pastel ears + puff tail, not a sprite copy. */
export function MochiBunny({ className = '' }: { className?: string }) {
  const stickerId = useId().replace(/:/g, '');

  return (
    <svg
      className={`mochi-bunny ${className}`.trim()}
      viewBox="0 0 160 120"
      width="96"
      height="72"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={stickerId} x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3.4" result="dilated" />
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="dilated" operator="in" result="border" />
          <feMerge>
            <feMergeNode in="border" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${stickerId})`}>
        {/* Long soft ears */}
        <path
          className="mochi-bunny-ear mochi-bunny-ear--left"
          d="M 48 58
             C 40 28 46 8 58 6
             C 68 4 74 18 70 42
             C 68 52 60 58 52 60 Z"
          fill="#fff4f8"
          stroke="#d9a0b4"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M 54 54 C 50 32 54 14 60 14 C 64 14 66 28 64 48 Z"
          fill="#f5b6c8"
          opacity="0.9"
        />
        <path
          className="mochi-bunny-ear mochi-bunny-ear--right"
          d="M 78 56
             C 82 26 92 4 106 8
             C 118 12 118 34 108 54
             C 102 64 90 64 80 60 Z"
          fill="#fff4f8"
          stroke="#d9a0b4"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M 86 54 C 90 32 98 16 104 18 C 108 20 108 36 102 52 Z"
          fill="#f5b6c8"
          opacity="0.9"
        />

        {/* Round mochi body */}
        <ellipse
          className="mochi-bunny-body"
          cx="78"
          cy="78"
          rx="46"
          ry="34"
          fill="#fff8fb"
          stroke="#d9a0b4"
          strokeWidth="2.4"
        />
        <ellipse cx="78" cy="88" rx="28" ry="14" fill="#ffe6ef" opacity="0.55" />

        {/* Fluffy tail */}
        <circle
          className="mochi-bunny-tail"
          cx="124"
          cy="82"
          r="14"
          fill="#fff4f8"
          stroke="#d9a0b4"
          strokeWidth="2.2"
        />
        <circle cx="124" cy="82" r="7" fill="#ffe6ef" />
      </g>

      <g className="mochi-bunny-face">
        <ellipse
          className="mochi-bunny-eye mochi-bunny-eye--left"
          cx="62"
          cy="74"
          rx="3.2"
          ry="4.4"
          fill="#4a3040"
        />
        <ellipse
          className="mochi-bunny-eye mochi-bunny-eye--right"
          cx="90"
          cy="74"
          rx="3.2"
          ry="4.4"
          fill="#4a3040"
        />
        <circle cx="63.2" cy="72.8" r="1" fill="#fff" />
        <circle cx="91.2" cy="72.8" r="1" fill="#fff" />

        <ellipse cx="52" cy="82" rx="5" ry="3" fill="#f7b8c8" opacity="0.75" />
        <ellipse cx="100" cy="82" rx="5" ry="3" fill="#f7b8c8" opacity="0.75" />

        <circle cx="76" cy="82" r="2.2" fill="#f0a0b4" />
        <path
          className="mochi-bunny-mouth"
          d="M 70 88 Q 76 93 82 88"
          fill="none"
          stroke="#d98aa3"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
