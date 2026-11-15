import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './portfolio-cursor.css';

export function PortfolioCursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const labelX = useSpring(0, { stiffness: 230, damping: 27, mass: 0.7 });
  const labelY = useSpring(0, { stiffness: 230, damping: 27, mass: 0.7 });
  const tiltTarget = useTransform(useVelocity(x), [-1800, 0, 1800], [-7, 0, 7]);
  const tilt = useSpring(tiltTarget, { stiffness: 280, damping: 25 });

  useEffect(() => {
    const layer = layerRef.current!;
    const label = labelRef.current!;
    const page = document.documentElement;
    const desktop = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)');
    const listeners = new AbortController();
    const options = { signal: listeners.signal, passive: true };
    let visible = false;
    let labelWidth = 0;
    let labelHeight = 0;

    function release() {
      delete layer.dataset.pressed;
    }

    function hide() {
      visible = false;
      delete page.dataset.portfolioCursor;
      release();
    }

    function follow(event: PointerEvent) {
      if (!desktop.matches || event.pointerType !== 'mouse' ||
          (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))) {
        hide();
        return;
      }

      if (!visible) {
        labelWidth = label.offsetWidth;
        labelHeight = label.offsetHeight;
      }
      const { clientX, clientY } = event;
      const nextLabelX = Math.max(8, Math.min(clientX + 17, innerWidth - labelWidth - 8));
      const nextLabelY = clientY + labelHeight + 18 < innerHeight
        ? clientY + 11
        : Math.max(8, clientY - labelHeight - 9);

      if (visible) {
        x.set(clientX);
        y.set(clientY);
        labelX.set(nextLabelX);
        labelY.set(nextLabelY);
      } else {
        x.jump(clientX);
        y.jump(clientY);
        labelX.jump(nextLabelX);
        labelY.jump(nextLabelY);
        tilt.jump(0);
        visible = true;
        page.dataset.portfolioCursor = '';
      }
    }

    window.addEventListener('pointermove', follow, options);
    window.addEventListener('pointerdown', event => {
      follow(event);
      if (visible && event.button === 0) layer.dataset.pressed = '';
    }, options);
    window.addEventListener('pointerup', release, options);
    window.addEventListener('pointercancel', hide, options);
    window.addEventListener('blur', hide, options);
    window.addEventListener('resize', hide, options);
    page.addEventListener('pointerleave', hide, options);
    document.addEventListener('visibilitychange', hide, options);
    desktop.addEventListener('change', hide, options);

    return () => {
      listeners.abort();
      hide();
    };
  }, [x, y, labelX, labelY, tilt]);

  return (
    <div ref={layerRef} className="portfolio-cursor" aria-hidden="true">
      <motion.div className="portfolio-cursor-arrow" style={{ x, y, rotate: tilt }}>
        <svg viewBox="0 0 25 27">
          <path d="M2 2 22 11.5 12.3 14.2 8.2 23.8 2 2Z" />
        </svg>
      </motion.div>
      <motion.div className="portfolio-cursor-tag" style={{ x: labelX, y: labelY, rotate: tilt }}>
        <div ref={labelRef} className="portfolio-cursor-name">陈小黑</div>
      </motion.div>
    </div>
  );
}
