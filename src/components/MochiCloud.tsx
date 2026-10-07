import { useId } from 'react';

/** Soft blue cloud mochi — sticker-style silhouette matching the reference art. */
export function MochiCloud({ className = '' }: { className?: string }) {
  const stickerId = useId().replace(/:/g, '');

  return (
    <svg
      className={`mochi-cloud ${className}`.trim()}
      viewBox="0 0 160 110"
      width="96"
      height="66"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={stickerId} x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3.6" result="dilated" />
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="dilated" operator="in" result="border" />
          <feMerge>
            <feMergeNode in="border" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${stickerId})`}>
        {/*
          Silhouette: puffy body, left cowlick that curls in, right tapering puff.
          Tuned to the soft blue sticker cloud reference.
        */}
        <path
          className="mochi-cloud-body"
          d="M 44 86
             C 22 82 12 64 18 48
             C 10 40 14 26 30 24
             C 28 12 40 4 52 10
             C 48 2 60 -2 70 6
             C 74 0 88 2 94 14
             C 104 8 122 16 128 30
             C 140 28 152 40 148 52
             C 156 58 154 72 140 76
             C 146 84 136 92 122 88
             C 108 98 78 100 58 94
             C 50 96 46 92 44 86 Z"
          fill="#7eb8e6"
          stroke="#5a9bc4"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Cowlick swirl detail (top-left lock curling inward) */}
        <path
          d="M 48 30
             C 40 22 46 12 58 14
             C 50 18 50 28 60 32"
          fill="none"
          stroke="#5a9bc4"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 52 26
             C 46 20 52 14 58 18"
          fill="none"
          stroke="#c5e4f5"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </g>

      <g className="mochi-cloud-face">
        <ellipse
          className="mochi-cloud-eye mochi-cloud-eye--left"
          cx="66"
          cy="52"
          rx="3.4"
          ry="4.8"
          fill="#2a2a2a"
        />
        <ellipse
          className="mochi-cloud-eye mochi-cloud-eye--right"
          cx="88"
          cy="52"
          rx="3.4"
          ry="4.8"
          fill="#2a2a2a"
        />

        <path
          d="M 52 58 Q 56 62 60 58"
          fill="none"
          stroke="#c5e4f5"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 94 58 Q 98 62 102 58"
          fill="none"
          stroke="#c5e4f5"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          className="mochi-cloud-mouth"
          d="M 73 60 Q 77 64.5 81 60"
          fill="none"
          stroke="#4a7fa8"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
