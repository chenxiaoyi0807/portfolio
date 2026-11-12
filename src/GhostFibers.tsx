import { useEffect, useRef } from 'react';

export default function GhostFibers() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    const section = canvas?.parentElement;
    if (!canvas || !context || !section) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const start = performance.now();
    const colors = ['#6f4ac5', '#8b5cf6', '#dfd1fc'];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let pulse: { x: number; y: number; time: number } | null = null;

    function draw(now: number) {
      frame = 0;
      if (!context || !width || !height) return;
      const time = reduced.matches ? 0 : (now - start) / 1000;
      const intro = reduced.matches ? 1 : Math.min(1, time / 1.2);
      const age = pulse ? (now - pulse.time) / 1000 : 2;
      context.clearRect(0, 0, width, height);
      const spread = Math.min(width * .23, height * .42);

      for (let layer = 0; layer < 3; layer++) {
        context.fillStyle = colors[layer];
        for (let thread = 0; thread < 24; thread++) {
          const angle = (thread / 24) * Math.PI * 2 + layer * .21;
          for (let index = 0; index < 58; index++) {
            const u = (index + (time * .4) % 1) / 58;
            const phase = angle + u * Math.PI * 2 * 1.2 + time * .5;
            const depth = (1 + Math.cos(phase)) / 2;
            const envelope = Math.sin(Math.PI * u);
            const x = width * (.04 + u * .72) + Math.cos(phase) * spread * .25 * envelope;
            const y = height * (.69 - u * .37)
              + Math.sin(phase) * spread * envelope * (.55 + layer * .17)
              + Math.sin(u * Math.PI * 2 - time * .5) * height * .06;
            const focus = pointer && !reduced.matches
              ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 170) : 0;
            const ring = pulse && age < 1 && !reduced.matches
              ? Math.max(0, 1 - Math.abs(Math.hypot(x - pulse.x, y - pulse.y) - age * 320) / 38) * (1 - age) : 0;
            const radius = (.45 + depth * .9) * (1 + focus * .6 + ring);
            context.globalAlpha = intro * envelope * (.09 + depth * .27 + focus * .24 + ring * .4);
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
          }
        }
      }
      if (visible && !reduced.matches) schedule();
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function locate(event: PointerEvent) {
      if (!canvas) return { x: 0, y: 0 };
      const bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }
    function move(event: PointerEvent) { pointer = locate(event); }
    function leave() { pointer = null; }
    function press(event: PointerEvent) { pulse = { ...locate(event), time: performance.now() }; }

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      schedule();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    resize.observe(canvas);
    intersection.observe(section);
    section.addEventListener('pointermove', move, { passive: true });
    section.addEventListener('pointerleave', leave);
    section.addEventListener('pointerdown', press);
    reduced.addEventListener('change', schedule);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      section.removeEventListener('pointerdown', press);
      reduced.removeEventListener('change', schedule);
    };
  }, []);

  return <canvas ref={ref} className="dot-field ghost-fibers" aria-hidden="true" />;
}
