import type { ReactNode } from 'react';

type DoodleName = 'hey' | 'portrait' | 'pencil' | 'chat' | 'spark';

const drawings: Record<DoodleName, ReactNode> = {
  hey: <>
    <path d="M13 74 35 18M47 13 27 68M17 49 41 40M48 36 65 26M55 14 37 64 57 55M48 13 79 3M72 24 78 42 98 12M78 42 66 70M110 13 96 48M92 58l-1 2M16 83 48 73 81 67" />
    <path opacity=".5" strokeWidth="1.3" d="M15 73 35 22M37 65 57 56M15 85C39 75 65 70 83 68" />
  </>,
  portrait: <>
    <path d="M27 46C19 37 13 27 17 21c5 1 10 7 13 8L24 11l18 11 2-14 11 14C66 8 80 8 95 7L76 20l24-4-15 15 11 1-14 14M28 43c-3 13-2 31 7 42 10 13 33 14 44 0 10-12 12-25 8-43M27 52c-10-8-14 7-9 13 2 3 5 4 8 3m62-16c10-7 13 7 7 14-2 3-4 3-8 3M36 40c13-9 30-10 42-6M37 70c12 7 26 7 37-2-3 15-28 20-37 2ZM51 54l-3 10 9 1" />
    <path d="M31 51c6-7 17-7 23-1 3 9-6 15-14 14-7-1-10-5-9-13Zm28-1c5-6 16-7 22-1 3 9-5 15-13 15-7 0-11-5-9-14Zm-5 3 5-1M38 53l2 4m28-4 2 3M37 31l18-8m1 5 24-11m-11 13 17-6" />
    <path opacity=".42" strokeWidth="1.2" d="M25 47c-5 31 11 56 39 50m10-6c11-6 17-26 15-42M30 30 16 20m44 9L94 9M35 84c9 8 22 9 33 4" />
  </>,
  pencil: <>
    <path d="M15 85 23 63 80 10q7-6 13 2l7 8q4 5-1 12L42 86l-27 8ZM23 63l19 23m-12-17 58-54M37 78l58-55M74 16l18 20M20 77l10 13m37-66 17 19" />
    <path opacity=".5" strokeWidth="1.2" d="m16 87 8-25 55-51m-39 77 58-53M42 76 95 26M8 98c23 4 37-2 52-1 14 1 27 7 43 0" />
  </>,
  chat: <>
    <path d="M19 23c14-12 45-15 68-3 17 9 20 29 7 43-11 13-29 17-48 14L24 93l7-21c-25-8-30-35-12-49ZM36 43l2 5m18-7 2 5m17-4 2 5" />
    <path opacity=".45" strokeWidth="1.2" d="M16 29c-15 22 0 40 17 45l-8 20m25-14c20 2 46-8 51-26M25 20c16-12 43-11 65 2" />
  </>,
  spark: <>
    <path d="M54 6 52 98M11 30l84 46M8 72l89-44M22 8l67 86M15 91 82 10" />
    <path opacity=".48" strokeWidth="1.3" d="m56 11-8 83M9 33l87 39M23 13l65 78M10 75l90-49" />
  </>,
};

export function Doodle({ name, className }: { name: DoodleName; className?: string }) {
  return (
    <svg className={className} viewBox={name === 'hey' ? '0 0 120 90' : '0 0 114 106'}
      fill="none" stroke="currentColor" strokeWidth={name === 'hey' ? 4.5 : 2.4}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {drawings[name]}
    </svg>
  );
}
