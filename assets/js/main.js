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

  // 3) Hover image reveal（スマホでは完全OFF）
  const hoverLinks = document.querySelectorAll('.js-hover-reveal');
  const hoverBgs = document.querySelectorAll('.hover-reveal-bg');

  // ✅ hover可能端末（＝PC）かどうか判定
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ✅ スマホ（タッチ端末）は hover 表示を完全に無効化
  if (!canHover) {
    hoverBgs.forEach(bg => bg.classList.remove('active'));
    solutionsSection && solutionsSection.classList.remove('is-dark');
    return; // ← 以降の hover 登録を行わない
  }

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

// 4) Contact Expanding UI
document.addEventListener('DOMContentLoaded', function () {
  const contactTrigger = document.getElementById('contactTrigger');
  const contactGrid = document.getElementById('contactGrid');
  const contactGridClose = document.getElementById('contactGridClose');
  const contactOptions = document.querySelectorAll('.contact-option');
  const contactFormOverlay = document.getElementById('contactFormOverlay');
  const contactFormBack = document.getElementById('contactFormBack');
  const contactFormClose = document.getElementById('contactFormClose');
  const contactFormTitle = document.getElementById('contactFormTitle');
  const contactFormContent = document.getElementById('contactFormContent');

  if (!contactTrigger || !contactGrid) return;

  // HubSpot form IDs (placeholder - replace with actual IDs)
  const formIds = {
    'general': '3945bd74-66e8-4b59-bd25-6ec53e74677e',
    'bakuage': 'd961bcd9-d551-442e-b54c-f939844ae1fc',
    'readable': '62195f2d-62e0-4a65-9876-35cf913b7c5c',
    'ai-strategy': '320022e6-07cb-4518-a089-aaf1db145124'
  };

  const formTitles = {
    'general': 'General Inquiry',
    'bakuage': 'Bakuage',
    'readable': 'Readable',
    'ai-strategy': 'AI & Strategy'
  };

  // Open contact grid
  contactTrigger.addEventListener('click', function () {
    contactTrigger.classList.add('expanded');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      contactGrid.classList.add('active');
    }, 300);
  });

  // Close contact grid
  function closeContactGrid() {
    contactGrid.classList.remove('active');
    setTimeout(function () {
      contactTrigger.classList.remove('expanded');
      document.body.style.overflow = '';
    }, 600);
  }

  contactGridClose.addEventListener('click', closeContactGrid);

  // Open form overlay
  contactOptions.forEach(function (option) {
    option.addEventListener('click', function () {
      const formType = this.getAttribute('data-form-type');
      const formId = formIds[formType];
      const title = formTitles[formType];

      contactFormTitle.textContent = title;
      contactFormContent.innerHTML = '';

      // Hide grid, show form
      contactGrid.classList.remove('active');
      setTimeout(function () {
        contactFormOverlay.classList.add('active');

        // Load HubSpot form
        if (typeof hbspt !== 'undefined' && formId && !formId.startsWith('PLACEHOLDER')) {
          fetch('/assets/css/hubspot-form.css')
            .then(function (res) { return res.text(); })
            .then(function (cssText) {
              hbspt.forms.create({
                portalId: '23725067',
                formId: formId,
                region: 'na2',
                target: '#contactFormContent',
                css: cssText
              });
            })
            .catch(function () {
              hbspt.forms.create({
                portalId: '23725067',
                formId: formId,
                region: 'na2',
                target: '#contactFormContent'
              });
            });
        } else {
          // Placeholder message
          contactFormContent.innerHTML = '<div style="text-align:center;padding:3rem;color:rgba(255,255,255,0.6);"><p style="margin-bottom:1rem;">フォームID未設定</p><p style="font-size:0.875rem;">HubSpotフォームIDを設定してください。<br>formIds[\'' + formType + '\']</p></div>';
        }
      }, 400);
    });
  });

  // Back to grid from form
  contactFormBack.addEventListener('click', function () {
    contactFormOverlay.classList.remove('active');
    setTimeout(function () {
      contactGrid.classList.add('active');
      contactFormContent.innerHTML = '';
    }, 400);
  });

  // Close form completely
  contactFormClose.addEventListener('click', function () {
    contactFormOverlay.classList.remove('active');
    contactFormContent.innerHTML = '';
    setTimeout(function () {
      contactTrigger.classList.remove('expanded');
      document.body.style.overflow = '';
    }, 500);
  });

  // ESC key to close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (contactFormOverlay.classList.contains('active')) {
        contactFormClose.click();
      } else if (contactGrid.classList.contains('active')) {
        closeContactGrid();
      }
    }
  });
});
