/**
 * Video Slider - 비디오 슬라이더 기능
 * Figma 레이어명 클래스 사용
 */
class VideoSlider {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 7;
    this.isPlaying = true;
    this.autoplayTimeout = null;
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.startAutoplay();
  }

  cacheDOM() {
    // 비디오 요소
    this.video = document.querySelector(".video-mask video");

    // 컨트롤 버튼
    this.btnPause = document.querySelector(".video-btn--pause");
    this.btnPrev = document.querySelector(".video-btn--prev");
    this.btnNext = document.querySelector(".video-btn--next");

    // 표시 요소
    this.currentSlideEl = document.querySelector(".current-slide");
    this.totalSlideEl = document.querySelector(".total-slide");
    this.progressBar = document.querySelector(".progress-background");
  }

  bindEvents() {
    if (this.btnPause) {
      this.btnPause.addEventListener("click", () => this.togglePlay());
    }
    if (this.btnPrev) {
      this.btnPrev.addEventListener("click", () => this.prevSlide());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => this.nextSlide());
    }

    // 비디오 이벤트
    if (this.video) {
      this.video.addEventListener("ended", () => this.nextSlide());
      this.video.addEventListener("timeupdate", () => this.updateProgress());
    }
  }

  updateSlideIndicator() {
    if (this.currentSlideEl) {
      this.currentSlideEl.textContent = String(this.currentSlide + 1).padStart(2, "0");
    }
  }

  updateProgress() {
    if (!this.video || !this.progressBar) return;
    const progress = (this.video.currentTime / this.video.duration) * 100;
    this.progressBar.style.width = progress + "%";
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlideIndicator();
    this.resetVideoProgress();
    this.restartAutoplay();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlideIndicator();
    this.resetVideoProgress();
    this.restartAutoplay();
  }

  togglePlay() {
    if (!this.video) return;

    if (this.isPlaying) {
      this.video.pause();
      this.isPlaying = false;
      this.stopAutoplay();
    } else {
      this.video.play();
      this.isPlaying = true;
      this.startAutoplay();
    }
  }

  resetVideoProgress() {
    if (this.video) {
      this.video.currentTime = 0;
    }
  }

  startAutoplay() {
    if (!this.isPlaying) return;

    this.stopAutoplay();
    this.autoplayTimeout = setTimeout(() => {
      this.nextSlide();
    }, 7000); // 7초마다 다음 슬라이드
  }

  stopAutoplay() {
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
      this.autoplayTimeout = null;
    }
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

/**
 * Mobile Menu - 모바일 메뉴 관리
 */
class MobileMenu {
  constructor() {
    this.hamburgerBtn = document.querySelector(".hamburger-menu");
    this.navBar = document.querySelector(".nav-bar");
    this.init();
  }

  init() {
    if (!this.hamburgerBtn || !this.navBar) return;

    this.hamburgerBtn.addEventListener("click", () => this.toggleMenu());

    // 네비게이션 항목 클릭 시 메뉴 닫기
    this.navBar.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", () => this.closeMenu());
    });

    // 창 크기 변경 시 메뉴 닫기
    window.addEventListener("resize", () => this.closeMenu());
  }

  toggleMenu() {
    this.navBar.classList.toggle("active");
    this.hamburgerBtn.classList.toggle("active");
  }

  closeMenu() {
    this.navBar.classList.remove("active");
    if (this.hamburgerBtn) {
      this.hamburgerBtn.classList.remove("active");
    }
  }
}

/**
 * Responsive Handler - 반응형 관리
 */
class ResponsiveHandler {
  constructor() {
    this.breakpoints = {
      tablet: 768,
      desktop: 1200,
    };
    this.currentBreakpoint = this.detectBreakpoint();
    this.init();
  }

  init() {
    window.addEventListener("resize", () => this.handleResize());
  }

  detectBreakpoint() {
    const width = window.innerWidth;
    if (width >= this.breakpoints.desktop) return "desktop";
    if (width >= this.breakpoints.tablet) return "tablet";
    return "mobile";
  }

  handleResize() {
    const newBreakpoint = this.detectBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      this.dispatchBreakpointChange();
    }
  }

  dispatchBreakpointChange() {
    const event = new CustomEvent("breakpointChange", {
      detail: { breakpoint: this.currentBreakpoint },
    });
    window.dispatchEvent(event);
  }

  getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }
}

/**
 * Smooth Scroll Handler
 */
class SmoothScrollHandler {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => this.handleSmoothScroll(e));
    });
  }

  handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute("href");
    if (href === "#") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
}

/**
 * Initialize App
 */
document.addEventListener("DOMContentLoaded", () => {
  // 각 기능별 인스턴스 초기화
  const videoSlider = new VideoSlider();
  const mobileMenu = new MobileMenu();
  const responsiveHandler = new ResponsiveHandler();
  const smoothScroll = new SmoothScrollHandler();

  // 전역 앱 객체 생성 (필요시 외부 접근)
  window.app = {
    videoSlider,
    mobileMenu,
    responsiveHandler,
    smoothScroll,
  };

  // 초기 상태 설정
  if (videoSlider.currentSlideEl) {
    videoSlider.updateSlideIndicator();
  }
});

/**
 * 성능 최적화: 스크롤 리스너에 throttle 적용
 */
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    func.apply(this, args);
  };
}

// 스크롤 이벤트 (필요시)

// 배너 슬라이드 관리
class BannerSlider {
  constructor() {
    this.currentSlide = 2; // 3번째 슬라이드 표시 (0부터 시작)
    this.totalSlides = 6;
    this.isPlaying = true;
    this.autoPlayInterval = null;
    this.init();
  }

  init() {
    this.updateIndicator();
    this.setupControls();
    this.startAutoPlay();
  }

  updateIndicator() {
    const indicator = document.querySelector(".banner-controls .indicator");
    if (indicator) {
      indicator.textContent = `${String(this.currentSlide + 1).padStart(2, "0")} / ${String(this.totalSlides).padStart(2, "0")}`;
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateIndicator();
    // 슬라이드 애니메이션 로직 추가 가능
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateIndicator();
    // 슬라이드 애니메이션 로직 추가 가능
  }

  togglePlay() {
    const btn = document.querySelector(".banner-controls .btn-pause");

    if (this.isPlaying) {
      this.stopAutoPlay();
      this.isPlaying = false;
      btn.classList.add("paused");
    } else {
      this.startAutoPlay();
      this.isPlaying = true;
      btn.classList.remove("paused");
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  setupControls() {
    const btnNext = document.querySelector(".banner-controls .btn-next");
    const btnPrev = document.querySelector(".banner-controls .btn-prev");
    const btnPause = document.querySelector(".banner-controls .btn-pause");

    if (btnNext)
      btnNext.addEventListener("click", () => {
        this.nextSlide();
        this.stopAutoPlay();
        this.startAutoPlay();
      });

    if (btnPrev)
      btnPrev.addEventListener("click", () => {
        this.prevSlide();
        this.stopAutoPlay();
        this.startAutoPlay();
      });

    if (btnPause) btnPause.addEventListener("click", () => this.togglePlay());
  }
}

// SNS 탭 전환
class SNSTabs {
  constructor() {
    this.init();
  }

  init() {
    const tabs = document.querySelectorAll(".sns-tabs .tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        tabs.forEach((t) => t.classList.remove("active"));
        e.target.classList.add("active");
        // 탭에 따른 콘텐츠 변경 로직 추가 가능
      });
    });
  }
}

// 스크롤 애니메이션
class ScrollAnimation {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // 애니메이션 적용할 요소들
    const elements = document.querySelectorAll(".content-section, .news-card, .recipe-card, .sns-card");
    elements.forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });
  }
}

// 헤더 스크롤 효과
class Header {
  constructor() {
    this.header = document.querySelector(".header");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        this.header.classList.add("scrolled");
      } else {
        this.header.classList.remove("scrolled");
      }
    });
  }
}

// 스무스 스크롤
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  new VideoSlider();
  new BannerSlider();
  new SNSTabs();
  new ScrollAnimation();
  new Header();
  new SmoothScroll();

  // 스크롤 UI 애니메이션
  const scrollArrow = document.querySelector(".scroll-arrow");
  if (scrollArrow) {
    setInterval(() => {
      scrollArrow.style.animation = "none";
      setTimeout(() => {
        scrollArrow.style.animation = "bounce 2s infinite";
      }, 10);
    }, 2000);
  }
});

// CSS 애니메이션 (style.css에 추가할 내용)
const style = document.createElement("style");
style.textContent = `
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0) rotate(-45deg);
        }
        50% {
            transform: translateY(10px) rotate(-45deg);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .fade-in {
        opacity: 0;
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .fade-in.visible {
        opacity: 1;
        animation: fadeInUp 0.6s ease;
    }

    .header.scrolled {
        background: rgba(0, 0, 0, 0.9);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .scroll-arrow {
        animation: bounce 2s infinite;
    }
`;
document.head.appendChild(style);