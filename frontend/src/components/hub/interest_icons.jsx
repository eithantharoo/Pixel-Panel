const iconProps = {
  width: 28, height: 28, viewBox: '0 0 24 24',
  fill: 'none', stroke: '#3d114b',
  strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
};

export const INTEREST_ICONS = {
  romance: (
    <svg {...iconProps}>
      <path d="M12 20.5s-6.5-4.2-6.5-9.1a3.6 3.6 0 0 1 6.4-2.2A3.6 3.6 0 0 1 18.5 11.4c0 4.9-6.5 9.1-6.5 9.1z" />
    </svg>
  ),
  mystery: (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16.5 16.5 4 4" />
      <path d="M11 8.5v3" />
      <circle cx="11" cy="14" r="0.5" fill="#3d114b" stroke="none" />
    </svg>
  ),
  comedy: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 10h.01M15 10h.01" />
      <path d="M9.5 15a4 4 0 0 0 5 0" />
    </svg>
  ),
  fantasy: (
    <svg {...iconProps}>
      <path d="m12 3 1.2 4.2L17 8.5l-3.8 1.3L12 14l-1.2-4.2L7 8.5l3.8-1.3z" />
      <path d="M5 18l2-1 1 2-2 1-1-2zM19 16l-1.5 3-3-1.5 1.5-3 3 1.5z" />
    </svg>
  ),
  horror: (
    <svg {...iconProps}>
      <path d="M12 3c-3.5 0-6 2.8-6 6.5C6 15 12 21 12 21s6-6 6-11.5C18 5.8 15.5 3 12 3z" />
      <circle cx="9.5" cy="10" r="1" fill="#3d114b" stroke="none" />
      <circle cx="14.5" cy="10" r="1" fill="#3d114b" stroke="none" />
      <path d="M10 13.5h4" />
    </svg>
  ),
  'sci-fi': (
    <svg {...iconProps}>
      <path d="M12 3l2.5 7.5H22l-6.5 4.7 2.5 7.8L12 18.3l-6 4.7 2.5-7.8L2 10.5h7.5z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  'slice of life': (
    <svg {...iconProps}>
      <path d="M6 10h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      <path d="M9 14h6" />
    </svg>
  ),
  historical: (
    <svg {...iconProps}>
      <path d="M5 20h14" />
      <path d="M7 20V9l5-4 5 4v11" />
      <path d="M10 20v-5h4v5" />
      <path d="M9 12h6" />
    </svg>
  ),
  adventure: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <path d="m15 9-3 3-2-2" />
    </svg>
  ),
  drama: (
    <svg {...iconProps}>
      <path d="M8 5h8l-1 14H9L8 5z" />
      <path d="M10 9h4M10 13h4" />
      <path d="M6 5c0-1 1-2 2-2h8c1 0 2 1 2 2" />
    </svg>
  ),
  thriller: (
    <svg {...iconProps}>
      <path d="M13 2 4 14h7l-1 8 10-14h-7z" />
    </svg>
  ),
};
