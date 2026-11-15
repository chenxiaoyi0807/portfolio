import { Fragment, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { useInView } from 'framer-motion';
import './ink-heading.css';

export function InkHeading({ as: Tag, id, lines }: {
  as: 'h1' | 'h2';
  id?: string;
  lines: ReactNode[];
}) {
  const filterId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useInView(heading, { once: true, amount: .16 });

  return (
    <Tag ref={heading} id={id} className="ink-heading" data-started={started}
      style={{ '--ink-filter': `url(#${filterId})` } as CSSProperties}>
      <svg className="ink-filter-definition" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-15%" y="-38%" width="130%" height="176%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -2.8" />
          </filter>
        </defs>
      </svg>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <br />}
          <span className="ink-heading-line" style={{ '--ink-delay': `${index * .18}s` } as CSSProperties}>{line}</span>
        </Fragment>
      ))}
    </Tag>
  );
}
