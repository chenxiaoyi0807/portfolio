import { useEffect } from 'react';

/** Pointer movement stays outside React's render loop. */
export function useGalleryMotion(reducedMotion: boolean | null) {
  useEffect(() => {
    const root = document.documentElement;
    let scrollFrame = 0;
    const updateScroll = () => {
      scrollFrame = 0;
      const distance = root.scrollHeight - innerHeight;
      root.style.setProperty('--scroll-progress', String(distance > 0 ? scrollY / distance : 0));
      document.querySelector('.nav')?.classList.toggle('is-scrolled', scrollY > 24);
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
    updateScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(scrollFrame);
      root.style.removeProperty('--scroll-progress');
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let frame = 0;
    let pointer: PointerEvent | null = null;
    let lastMagnet: HTMLElement | null = null;
    let lastHero: HTMLElement | null = null;
    const resetMagnet = () => {
      lastMagnet?.style.setProperty('--mag-x', '0px');
      lastMagnet?.style.setProperty('--mag-y', '0px');
      lastMagnet = null;
    };
    const update = () => {
      frame = 0;
      if (!pointer || !(pointer.target instanceof Element)) return;
      const target = pointer.target;
      const hero = target.closest<HTMLElement>('.hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--hero-x', `${((pointer.clientX - rect.left) / rect.width - .5) * 18}px`);
        hero.style.setProperty('--hero-y', `${((pointer.clientY - rect.top) / rect.height - .5) * 12}px`);
      } else if (lastHero) {
        lastHero.style.setProperty('--hero-x', '0px');
        lastHero.style.setProperty('--hero-y', '0px');
      }
      lastHero = hero;
      const card = target.closest<HTMLElement>('.project');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${pointer.clientX - rect.left}px`);
        card.style.setProperty('--pointer-y', `${pointer.clientY - rect.top}px`);
      }
      const magnet = target.closest<HTMLElement>('.gradient-pill,.nav-contact,.contact .pill');
      if (magnet !== lastMagnet) resetMagnet();
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        magnet.style.setProperty('--mag-x', `${Math.max(-5, Math.min(5, (pointer.clientX - rect.left - rect.width / 2) * .075))}px`);
        magnet.style.setProperty('--mag-y', `${Math.max(-4, Math.min(4, (pointer.clientY - rect.top - rect.height / 2) * .1))}px`);
      }
      lastMagnet = magnet;
    };
    const onMove = (event: PointerEvent) => {
      pointer = event;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const reset = () => {
      resetMagnet();
      lastHero?.style.setProperty('--hero-x', '0px');
      lastHero?.style.setProperty('--hero-y', '0px');
      lastHero = null;
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', reset);
    addEventListener('blur', reset);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', reset);
      removeEventListener('blur', reset);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [reducedMotion]);
}
