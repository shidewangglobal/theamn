import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_REPLAY = 'play reverse play reverse';

/** Tech-box motion: fast, confident — matches cubic-bezier(0.22, 1, 0.36, 1) */
const MOTION_EASE = 'power4.out';
const MOTION_DURATION = 0.6;
const MOTION_DURATION_SHORT = 0.45;
const MOTION_DURATION_MICRO = 0.3;
const MOTION_STAGGER = 0.06;
const MOTION_TRAVEL_Y = 18;
const MOTION_TRAVEL_X = 48;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;

  const lenis = new Lenis({
    duration: 0.95,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Lenis uses virtual scroll; proxy so ScrollTrigger reads the correct position
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
  });

  ScrollTrigger.addEventListener('refresh', () => lenis.resize());

  return lenis;
}

function initPillNav(lenis: Lenis | null) {
  const header = document.querySelector('header');
  const pillNav = document.getElementById('pill-nav');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.pill-nav-link, #mobile-menu a');
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const headerLogo = header?.querySelector<HTMLImageElement>('#header-logo, a img');

  if (!header) return;

  const updateHeader = () => {
    const scrollY = lenis?.scroll ?? window.scrollY;
    const scrolled = scrollY > 24;

    header.classList.toggle('is-scrolled', scrolled);
    header.classList.remove('is-hero');

    if (pillNav) {
      pillNav.classList.add('pill-nav--light');
    }

    if (headerLogo) {
      headerLogo.src = '/assets/amn-logo-header-dark.png';
    }
  };

  updateHeader();
  if (lenis) {
    lenis.on('scroll', updateHeader);
  } else {
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { offset: -90 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.pill-nav-link').forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
}

function revealFromTo(
  targets: gsap.TweenTarget,
  options: {
    trigger?: Element;
    start?: string;
    stagger?: number;
    y?: number;
    x?: number;
    rotation?: number;
    opacity?: number;
    duration?: number;
    ease?: string;
  },
) {
  const {
    trigger,
    start = 'top 85%',
    stagger = 0,
    y = MOTION_TRAVEL_Y,
    x = 0,
    rotation = 0,
    opacity = 1,
    duration = MOTION_DURATION,
    ease = MOTION_EASE,
  } = options;
  const triggerEl = trigger ?? (Array.isArray(targets) ? (targets as Element[])[0] : (targets as Element));

  gsap.fromTo(
    targets,
    { y, x, rotation, opacity: opacity === 1 ? undefined : 0, immediateRender: false },
    {
      y: 0,
      x: 0,
      rotation: 0,
      opacity: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: triggerEl,
        start,
        toggleActions: SCROLL_REPLAY,
      },
    },
  );
}

function initHeroEntrance() {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: MOTION_EASE } });

  tl.fromTo('.hero-headline-static', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: MOTION_DURATION_SHORT, stagger: 0.06 })
    .fromTo('.hero-a-word', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: MOTION_DURATION, ease: MOTION_EASE }, '-=0.32')
    .fromTo('.hero-tagline', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: MOTION_DURATION_SHORT }, '-=0.32')
    .fromTo('.hero-cta', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: MOTION_DURATION_SHORT }, '-=0.28')
    .fromTo('.hero-scroll', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: MOTION_DURATION_SHORT }, '-=0.2');
}

const HERO_VIDEO_HOLD_MS = 9000;

function waitForVideoReady(video: HTMLVideoElement, timeoutMs = 15000): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Video load timeout'));
    }, timeoutMs);

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error('Video load error'));
    };

    const cleanup = () => {
      window.clearTimeout(timeout);
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
    };

    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('error', onError, { once: true });

    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
      video.load();
    }
  });
}

async function playHeroVideo(video: HTMLVideoElement): Promise<boolean> {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  try {
    await waitForVideoReady(video);
    await video.play();
    return true;
  } catch {
    return false;
  }
}

function initHeroVideoRotator() {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('.hero-video-bg'));
  const heroFallback = document.querySelector<HTMLImageElement>('.hero-fallback-img');
  if (!videos.length) return;

  const showFallback = () => {
    videos.forEach((video) => {
      video.classList.remove('is-active');
      video.classList.add('is-hidden');
      video.pause();
    });
    heroFallback?.classList.add('is-visible');
  };

  if (prefersReducedMotion()) {
    showFallback();
    return;
  }

  videos.forEach((video, i) => {
    if (i === 0) {
      video.classList.add('is-active');
    } else {
      video.classList.remove('is-active');
      video.preload = 'none';
    }
  });

  void playHeroVideo(videos[0]).then((started) => {
    if (!started) {
      showFallback();
      return;
    }

    if (videos.length === 1) return;

    let active = 0;

    const switchVideo = async () => {
      const next = (active + 1) % videos.length;
      const current = videos[active];
      const incoming = videos[next];

      if (incoming.preload === 'none') {
        incoming.preload = 'auto';
        incoming.load();
      }

      const ready = await playHeroVideo(incoming);
      if (!ready) return;

      incoming.currentTime = 0;
      incoming.classList.add('is-active');
      current.classList.remove('is-active');
      current.pause();
      active = next;
    };

    window.setInterval(() => {
      void switchVideo();
    }, HERO_VIDEO_HOLD_MS);
  });
}

function initHeroWordRotator() {
  if (prefersReducedMotion()) return;

  const wordEl = document.querySelector<HTMLElement>('.hero-a-word');
  if (!wordEl) return;

  let words = HERO_A_WORDS;
  const dataWords = wordEl.dataset.heroAWords;
  if (dataWords) {
    try {
      const parsed = JSON.parse(dataWords) as string[];
      if (parsed.length) words = parsed;
    } catch {
      /* use default */
    }
  }

  let index = 0;

  const cycle = () => {
    gsap.to(wordEl, {
      y: -36,
      opacity: 0,
      duration: HERO_A_TRANSITION,
      ease: 'power2.in',
      onComplete: () => {
        index = (index + 1) % words.length;
        wordEl.textContent = words[index];
        gsap.fromTo(
          wordEl,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: HERO_A_TRANSITION,
            ease: MOTION_EASE,
            onComplete: () => {
              gsap.delayedCall(HERO_A_HOLD, cycle);
            },
          },
        );
      },
    });
  };

  gsap.delayedCall(HERO_A_HOLD, cycle);
}

const HERO_A_WORDS = ['Agile', 'Accelerated', 'Authentic', 'Artistic', 'Aesthetic', 'Adaptive', 'Advanced', 'Amplified'];
const HERO_A_HOLD = 1.55;
const HERO_A_TRANSITION = 0.42;

function initAboutSlide() {
  if (prefersReducedMotion()) return;

  const panel = document.querySelector('.about-panel');
  const textCard = document.querySelector('.about-text-card');
  const leftText = document.querySelector('.about-text-left');
  const rightText = document.querySelector('.about-text-right');
  const highlights = document.querySelectorAll('.about-text-card .text-accent-italic');
  if (!panel || !textCard) return;

  const aboutIn = 0.45;

  gsap.set(panel, { opacity: 0, y: 14 });
  gsap.set(textCard, { opacity: 0, x: 36, y: 8, filter: 'blur(10px)' });
  gsap.set([leftText, rightText], { opacity: 0, y: 12, filter: 'blur(6px)' });
  gsap.set(highlights, { opacity: 0, y: 6 });

  const revealTl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: 'top 82%',
      toggleActions: SCROLL_REPLAY,
    },
  });

  revealTl
    .to(panel, { y: 0, opacity: 1, duration: aboutIn, ease: MOTION_EASE })
    .to(
      textCard,
      { x: 0, y: 0, opacity: 1, filter: 'blur(0px)', duration: aboutIn, ease: MOTION_EASE },
      '-=0.34',
    )
    .to(leftText, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.32, ease: MOTION_EASE }, '-=0.3')
    .to(rightText, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.32, ease: MOTION_EASE }, '-=0.26')
    .to(highlights, { y: 0, opacity: 1, duration: 0.24, stagger: 0.03, ease: MOTION_EASE }, '-=0.2');
}

function initHowWeWork() {
  if (prefersReducedMotion()) return;

  const panel = document.querySelector('.how-panel');
  const hubBox = document.querySelector('.how-hub-box');
  const networkBox = document.querySelector('.how-network-box');
  const asterisk = document.querySelector('#how-we-work .how-asterisk');
  const headline = document.querySelector('#how-we-work .how-headline');
  const subheadline = document.querySelector('#how-we-work .how-subheadline');
  const hubHeader = document.querySelector('.how-boxes-row .how-col-header:first-child');
  const networkHeader = document.querySelector('.how-boxes-row .how-col-header:last-of-type');
  const boxesRow = document.querySelector('.how-boxes-row');

  if (!panel) return;

  const reveal = (targets: Element | Element[], trigger: Element, start = 'top 85%') => {
    const els = Array.isArray(targets) ? targets : [targets];
    if (!els.length || !els[0]) return;
    gsap.fromTo(
      els,
      { y: MOTION_TRAVEL_Y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        stagger: MOTION_STAGGER,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger,
          start,
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  };

  if (asterisk && headline && subheadline) {
    reveal([asterisk, headline, subheadline], panel, 'top 92%');
  }

  if (hubHeader) reveal(hubHeader, boxesRow ?? panel);
  if (networkHeader) reveal(networkHeader, boxesRow ?? panel);

  const imageBox = document.querySelector('.how-image-box');
  if (imageBox && panel) reveal(imageBox, panel, 'top 90%');

  if (hubBox && boxesRow) {
    gsap.fromTo(
      hubBox,
      { x: -MOTION_TRAVEL_X, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: boxesRow,
          start: 'top 90%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }

  if (networkBox && boxesRow) {
    gsap.fromTo(
      networkBox,
      { x: MOTION_TRAVEL_X, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: boxesRow,
          start: 'top 90%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }
}

function initPillarsCredential() {
  if (prefersReducedMotion()) return;

  const section = document.querySelector('.pillars-credential');
  if (!section) return;

  const asterisk = document.querySelector('.pillar-asterisk');
  const headline = document.querySelector('.pillar-headline');
  const leftImage = document.querySelector('.pillar-image-left');
  const centerImage = document.querySelector('.pillar-image-center');
  const cards = document.querySelectorAll('.pillars-col-cards .pillar-card');

  if (asterisk && headline) {
    gsap.fromTo(
      [asterisk, headline],
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        stagger: MOTION_STAGGER,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }

  if (leftImage) {
    gsap.fromTo(
      leftImage,
      { opacity: 0, y: MOTION_TRAVEL_Y },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }

  if (centerImage) {
    gsap.fromTo(
      centerImage,
      { opacity: 0, scale: 0.985 },
      {
        opacity: 1,
        scale: 1,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: section,
          start: 'top 72%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }

  if (cards.length) {
    gsap.fromTo(
      cards,
      { x: 56, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        stagger: 0.08,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: '.pillars-col-cards',
          start: 'top 80%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  }
}

function initServicesAlternate() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('.service-card').forEach((card, i) => {
    const fromX = i % 2 === 0 ? -MOTION_TRAVEL_X : MOTION_TRAVEL_X;

    gsap.fromTo(
      card,
      { x: fromX, opacity: 0, y: 28 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  });
}

function initTextReveals() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('.text-reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: MOTION_DURATION,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: SCROLL_REPLAY,
        },
      },
    );
  });
}

function initScrollReveals() {
  const reduced = prefersReducedMotion();

  if (reduced) {
    gsap.set('.reveal, .reveal-stagger > *, .reveal-item, .about-panel, .about-glass-card, .about-text-left, .about-text-right, .about-text-card .text-accent-italic, .how-asterisk, .how-headline, .how-subheadline, .how-hub-box, .how-network-box, .pillar-card, .pillar-image-left, .pillar-image-center, .pillar-headline, .pillar-asterisk, .service-card, .text-reveal, .text-reveal-line', {
      opacity: 1,
      visibility: 'visible',
      y: 0,
      yPercent: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      clearProps: 'all',
    });
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((container) => {
    const items = container.querySelectorAll('.reveal-item');
    if (items.length) {
      revealFromTo(items, { trigger: container, start: 'top 82%', stagger: MOTION_STAGGER, y: 28, duration: MOTION_DURATION });
    }
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((container) => {
    const items = container.querySelectorAll('.reveal-item');
    if (items.length) {
      revealFromTo(items, { trigger: container, start: 'top 80%', stagger: MOTION_STAGGER, y: 32 });
    }
  });

  document.querySelectorAll<HTMLElement>('.reveal-stagger').forEach((container) => {
    if (container.classList.contains('services-grid')) {
      return;
    }
    if (container.children.length) {
      revealFromTo(container.children, { trigger: container, start: 'top 80%', stagger: MOTION_STAGGER, y: 32, duration: MOTION_DURATION });
    }
  });

  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    if (el.closest('.about-panel')) return;
    revealFromTo(el, { trigger: el, start: 'top 85%', y: MOTION_TRAVEL_Y, duration: MOTION_DURATION });
  });
}

function initHeroGlow() {
  if (prefersReducedMotion()) return;

  gsap.to('.hero-glow-orb', {
    scale: 1.2,
    opacity: 0.55,
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.hero-glow-orb-lime', {
    scale: 1.15,
    opacity: 0.35,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: 1,
  });
}

function initCardHover() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-tilt-card], .white-card, .pillar-card, .service-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, scale: 1.01, duration: MOTION_DURATION_SHORT, ease: MOTION_EASE });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, scale: 1, duration: MOTION_DURATION_SHORT, ease: MOTION_EASE });
    });
  });
}

function initMarquee() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('.marquee-track').forEach((track, i) => {
    const width = track.scrollWidth / 2;
    const reverse = track.classList.contains('animate-marquee-reverse');

    gsap.to(track, {
      x: reverse ? width : -width,
      duration: 35 + i * 5,
      repeat: -1,
      ease: 'none',
    });
  });
}

export function initAnimations() {
  const lenis = initSmoothScroll();
  initPillNav(lenis);
  initHeroVideoRotator();
  initHeroEntrance();
  initHeroWordRotator();
  initAboutSlide();
  initHowWeWork();
  initPillarsCredential();
  initServicesAlternate();
  initTextReveals();
  initScrollReveals();
  initHeroGlow();
  initCardHover();
  initMarquee();

  ScrollTrigger.refresh();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
}
