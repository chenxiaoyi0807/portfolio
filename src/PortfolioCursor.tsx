import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './portfolio-cursor.css';

const arrowRestDirection = -135;
const arrowSpring = { stiffness: 380, damping: 32, mass: 0.6 };
const labelSpring = { stiffness: 220, damping: 26, mass: 0.7 };

function nearestRotation(current: number, target: number) {
  const difference = target - current;
  return target - 360 * Math.round(difference / 360);
}

export function PortfolioCursor() {
  const layerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const arrowRotation = useSpring(0, arrowSpring);
  const labelX = useSpring(0, labelSpring);
  const labelY = useSpring(0, labelSpring);
  const labelTiltTarget = useTransform(useVelocity(x), [-1800, 0, 1800], [-8, 0, 8]);
  const labelTilt = useSpring(labelTiltTarget, labelSpring);

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
    let returnToRest: number | undefined;

    function release() {
      delete layer.dataset.pressed;
    }

    function hide() {
      visible = false;
      window.clearTimeout(returnToRest);
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
        const dx = clientX - x.get();
        const dy = clientY - y.get();

        if (Math.hypot(dx, dy) >= 1) {
          const direction = Math.atan2(dy, dx) * 180 / Math.PI;
          arrowRotation.set(nearestRotation(arrowRotation.get(), direction - arrowRestDirection));
          window.clearTimeout(returnToRest);
          returnToRest = window.setTimeout(() => {
            arrowRotation.set(nearestRotation(arrowRotation.get(), 0));
          }, 110);
        }

        x.set(clientX);
        y.set(clientY);
        labelX.set(nextLabelX);
        labelY.set(nextLabelY);
      } else {
        x.jump(clientX);
        y.jump(clientY);
        labelX.jump(nextLabelX);
        labelY.jump(nextLabelY);
        arrowRotation.jump(0);
        labelTilt.jump(0);
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
  }, [x, y, arrowRotation, labelX, labelY, labelTilt]);

  return (
    <div ref={layerRef} className="portfolio-cursor" aria-hidden="true">
      <motion.div className="portfolio-cursor-arrow" style={{ x, y, rotate: arrowRotation }}>
        <svg viewBox="0 0 25 27">
          <path d="M3.8 2.7 20.8 10.7 Q23 11.8 20.7 12.5 L13.4 14.8 Q12.6 15 12.3 15.8 L9.4 22.6 Q8.4 24.7 7.5 22.5 L2.1 4.4 Q1.3 1.2 3.8 2.7Z" />
        </svg>
      </motion.div>
      <motion.div className="portfolio-cursor-tag" style={{ x: labelX, y: labelY, rotate: labelTilt }}>
        <div ref={labelRef} className="portfolio-cursor-name">你</div>
      </motion.div>
    </div>
  );
}
