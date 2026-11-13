// LessonSpindle motion: red-pen marks draw themselves over the working, the thread runs through the steps,
// and scripts settle onto the desk. Nothing moves when reduced motion is requested.
export function startMotion() {
  if (typeof window === 'undefined' || window.__lsMotion) return;
  window.__lsMotion = true;
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof IntersectionObserver === 'undefined') return;
  document.documentElement.classList.add('ls-js');
  const els = [...document.querySelectorAll('[data-reveal], [data-mark]')];
  const show = (el) => el.classList.add('in');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), {rootMargin: '0px 0px -8% 0px', threshold: 0.1});
  els.forEach((el, i) => { el.style.setProperty('--d', `${(i % 5) * 90}ms`); io.observe(el); });
  let t = 0;
  addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(() => els.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) show(el); }), 150); }, {passive: true});
}
