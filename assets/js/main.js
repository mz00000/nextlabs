document.addEventListener('DOMContentLoaded', function () {

  // 1) Scroll reveal
  const scrollTriggers = document.querySelectorAll('.js-scroll-trigger');
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  scrollTriggers.forEach(el => scrollObserver.observe(el));

  // 2) Background mode control
  const bgDark = document.getElementById('bgDark');
  const bgWhite = document.getElementById('bgWhite');
  const bgDarkReturn = document.getElementById('bgDarkReturn');

  const solutionsSection = document.getElementById('solutions');
  const companySection = document.getElementById('company');

  function setMode(mode) {
    bgDark && bgDark.classList.remove('active');
    bgWhite && bgWhite.classList.remove('active');
    bgDarkReturn && bgDarkReturn.classList.remove('active');

    if (mode === 'white') bgWhite && bgWhite.classList.add('active');
    else if (mode === 'darkReturn') bgDarkReturn && bgDarkReturn.classList.add('active');
    else bgDark && bgDark.classList.add('active');
  }

  function rectFor(el) {
    if (!el) return null;
    return el.getBoundingClientRect();
  }

  function containsY(rect, y) {
    if (!rect) return false;
    return y >= rect.top && y <= rect.bottom;
  }

  function computeMode() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const probeY = vh * 0.45;

    const rSolutions = rectFor(solutionsSection);
    const rCompany = rectFor(companySection);

    if (rCompany && probeY >= rCompany.top) return 'darkReturn';
    if (containsY(rSolutions, probeY)) return 'white';
    return 'dark';
  }

  let ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setMode(computeMode());
      ticking = false;
    });
  }

  setMode(computeMode());
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });

  // 3) Hover image reveal（✅「パネル外に出たら即解除」に修正）
  const hoverLinks = document.querySelectorAll('.js-hover-reveal');
  const hoverBgs = document.querySelectorAll('.hover-reveal-bg');

  const solutionsPanel = solutionsSection
    ? solutionsSection.querySelector('.glass.glass-light')
    : null;

  function clearHoverBg() {
    hoverBgs.forEach(bg => bg.classList.remove('active'));
    solutionsSection && solutionsSection.classList.remove('is-dark');
  }

  hoverLinks.forEach(link => {
    link.addEventListener('pointerenter', function () {
      const targetId = this.getAttribute('data-bg-target');
      const targetBg = document.getElementById(targetId);

      hoverBgs.forEach(bg => bg.classList.remove('active'));
      if (targetBg) {
        targetBg.classList.add('active');
        solutionsSection && solutionsSection.classList.add('is-dark');
      }
    });

    link.addEventListener('pointerleave', function () {
      clearHoverBg();
    });
  });

  if (solutionsPanel) {
    solutionsPanel.addEventListener('pointerleave', clearHoverBg);
  } else if (solutionsSection) {
    solutionsSection.addEventListener('pointerleave', clearHoverBg);
  }
});
