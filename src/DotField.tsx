import { useEffect, useRef } from 'react';

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let started = performance.now();
    let gradient: CanvasGradient;
    let pointer: { x: number; y: number; held: boolean } | null = null;

    function draw(time: number) {
      frame = 0;
      if (!context || !width || !height) return;
      const reveal = reduced.matches ? 1 : Math.min(1, (time - started) / 650);
      context.clearRect(0, 0, width, height);
      context.fillStyle = gradient;
      context.globalAlpha = .35 * reveal;
      context.beginPath();
      const highlights: { x: number; y: number; radius: number; glow: number }[] = [];

      for (let y = 7; y < height; y += 14) {
        for (let x = 7; x < width; x += 14) {
          const dx = x - (pointer?.x ?? x);
          const dy = y - (pointer?.y ?? y);
          const distance = pointer && !reduced.matches ? Math.hypot(dx, dy) : Infinity;
          const strength = Math.max(0, 1 - distance / 240) ** 2;
          const bulge = strength * (pointer?.held ? 1.2 : .6);
          const px = x + dx * bulge;
          const py = y + dy * bulge;
          const radius = 1.5 * (1 + bulge);
          context.moveTo(px + radius, py);
          context.arc(px, py, radius, 0, Math.PI * 2);
          if (distance < 160) highlights.push({ x: px, y: py, radius, glow: .8 * (1 - distance / 160) ** 2 });
        }
      }
      context.fill();
      context.fillStyle = '#fff';
      for (const dot of highlights) {
        context.globalAlpha = dot.glow * reveal;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fill();
      }
      if (reveal < 1) schedule();
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function resize() {
      if (!canvas || !context) return;
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const extent = (width + height) / 4;
      gradient = context.createLinearGradient(width / 2 - extent, height / 2 - extent, width / 2 + extent, height / 2 + extent);
      gradient.addColorStop(0, '#1d7299');
      gradient.addColorStop(1, '#9eeaff');
      schedule();
    }

    function move(event: PointerEvent) {
      if (!canvas || reduced.matches || event.pointerType === 'touch') return;
      const bounds = canvas.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const next = x >= 0 && y >= 0 && x <= width && y <= height;
      if (!next && !pointer) return;
      pointer = next ? { x, y, held: !!(event.buttons & 1) } : null;
      schedule();
    }

    function clear() {
      if (!pointer) return;
      pointer = null;
      schedule();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', move);
    window.addEventListener('pointerup', move);
    window.addEventListener('pointercancel', clear);
    window.addEventListener('blur', clear);
    window.addEventListener('scroll', clear, { passive: true });
    reduced.addEventListener('change', schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', move);
      window.removeEventListener('pointerup', move);
      window.removeEventListener('pointercancel', clear);
      window.removeEventListener('blur', clear);
      window.removeEventListener('scroll', clear);
      reduced.removeEventListener('change', schedule);
    };
  }, []);

  return <canvas ref={ref} className="dot-field" aria-hidden="true" />;
}
