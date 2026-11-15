import { useId } from 'react';
import type { ReactNode } from 'react';

type DoodleName = 'hey' | 'portrait' | 'pencil' | 'chat' | 'spark';

const drawings: Record<DoodleName, ReactNode> = {
  hey: <g fill="currentColor" stroke="none">
    <path d="M7 76l3-12 3-8 1-7 4-11 3-12 4-10 3-1 2-3 1 3-2 7-4 11-3 13-3 8-2 9-4 11-1 5-2 1-1-4z" />
    <path d="M5 51l4-6 7-4 10-3 9-4 11-3 3 1-2 3-5 2-2 3-8 3-12 5-9 4-5 2 1-3z" />
    <path d="M26 71l5-15 1-7 3-9 1-8 5-12 2-10 3-6 3-1 1 3-2 9-4 13-3 9-1 7-5 13-3 13-3 6-2-1 1-4z" />
    <path d="M41 21l5-4 10-3 11-4 15-4 4 1-1 3-7 2-11 5-10 3-4 1-3 6-3 11 10-4 7-2 2 2-2 3-7 3-9 4-3 1-2 11 10-3 7-3 6-1 1 3-3 4-8 3-12 5-7 1-2-3 2-9 2-12 4-13 2-5z" />
    <path d="M66 16l4-1 3 4 3 8 5 11 2 2 7-13 5-10 7-10 4-5 3-1-2 5-4 9-8 16-8 18-7 19-8 17-3 3-2-1 3-11 5-14 4-14-4-9-4-10-4-9z" />
    <path d="M110 24l3-8 3-2 1 3-2 7-6 17-3 6-3 2-1-3 2-8zM100 54l3-1 2 2-1 4-3 2-3-2v-3z" />
    <path d="M12 88l12-6 13-4 15-5 12-3 10-4 6-1-1 4-3 3-13 4-11 3-17 6-14 3-9 3-2-1z" />
  </g>,
  portrait: <>
    <path d="M27 46C19 37 13 27 17 21c5 1 10 7 13 8L24 11l18 11 2-14 11 14C66 8 80 8 95 7L76 20l24-4-15 15 11 1-14 14M28 43c-3 13-2 31 7 42 10 13 33 14 44 0 10-12 12-25 8-43M27 52c-10-8-14 7-9 13 2 3 5 4 8 3m62-16c10-7 13 7 7 14-2 3-4 3-8 3M36 40c13-9 30-10 42-6M37 70c12 7 26 7 37-2-3 15-28 20-37 2ZM51 54l-3 10 9 1" />
    <path d="M31 51c6-7 17-7 23-1 3 9-6 15-14 14-7-1-10-5-9-13Zm28-1c5-6 16-7 22-1 3 9-5 15-13 15-7 0-11-5-9-14Zm-5 3 5-1M37 31l18-8m1 5 24-11m-11 13 17-6" />
    <path className="doodle-eyes" d="M38 53l2 4m28-4 2 3" />
    <path opacity=".42" strokeWidth="1.2" d="M25 47c-5 31 11 56 39 50m10-6c11-6 17-26 15-42M30 30 16 20m44 9L94 9M35 84c9 8 22 9 33 4" />
  </>,
  pencil: <>
    <path d="M15 85 23 63 80 10q7-6 13 2l7 8q4 5-1 12L42 86l-27 8ZM23 63l19 23m-12-17 58-54M37 78l58-55M74 16l18 20M20 77l10 13m37-66 17 19" />
    <path opacity=".5" strokeWidth="1.2" d="m16 87 8-25 55-51m-39 77 58-53M42 76 95 26M8 98c23 4 37-2 52-1 14 1 27 7 43 0" />
  </>,
  chat: <>
    <path d="M19 23c14-12 45-15 68-3 17 9 20 29 7 43-11 13-29 17-48 14L24 93l7-21c-25-8-30-35-12-49Z" />
    <g className="doodle-chat-marks"><path d="M36 43l2 5" /><path d="M56 41l2 5" /><path d="M75 42l2 5" /></g>
    <path opacity=".45" strokeWidth="1.2" d="M16 29c-15 22 0 40 17 45l-8 20m25-14c20 2 46-8 51-26M25 20c16-12 43-11 65 2" />
  </>,
  spark: <>
    <path d="M54 6 52 98M11 30l84 46M8 72l89-44M22 8l67 86M15 91 82 10" />
    <path opacity=".48" strokeWidth="1.3" d="m56 11-8 83M9 33l87 39M23 13l65 78M10 75l90-49" />
  </>,
};

export function Doodle({ name, className }: { name: DoodleName; className?: string }) {
  const brushId = useId();
  const isBrush = name === 'hey';

  return (
    <svg className={className} viewBox={name === 'hey' ? '0 0 121 94' : '0 0 114 106'}
      fill="none" stroke="currentColor" strokeWidth={name === 'hey' ? 4.5 : 2.4}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {isBrush && (
        <defs>
          <filter id={brushId} x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="2" seed="9" />
            <feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      )}
      <g filter={isBrush ? `url(#${brushId})` : undefined}>{drawings[name]}</g>
    </svg>
  );
}
