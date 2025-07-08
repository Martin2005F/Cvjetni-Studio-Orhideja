// Glavni modul za animacije
class AnimationManager {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  initAnimations() {
    const animatedElements = document.querySelectorAll(".animate");
    animatedElements.forEach((el) => this.observer.observe(el));
  }

  initGalleryAnimations() {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item, i) => {
      item.classList.add(i % 2 === 0 ? "animate-left" : "animate-right");
      this.observer.observe(item);
    });
  }

  destroy() {
    this.observer?.disconnect();
  }
}

// Modul za galeriju
class GalleryModal {
  constructor() {
    this.modal = document.getElementById("galleryModal");
    this.modalImg = document.getElementById("modalImage");
    this.captionText = document.getElementById("caption");
    this.closeBtn = document.querySelector(".modal-close");
    this.prevBtn = document.querySelector(".modal-prev");
    this.nextBtn = document.querySelector(".modal-next");
    this.galleryImages = Array.from(
      document.querySelectorAll(".gallery-item img")
    );
    this.currentIndex = 0;
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.modal || !this.modalImg || this.galleryImages.length === 0) {
      console.warn("Gallery modal elements not found");
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    // Event listeneri za slike
    this.galleryImages.forEach((img, index) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (e) => this.handleImageClick(e, index));
    });

    // Modal kontrole
    this.closeBtn?.addEventListener("click", () => this.closeModal());
    this.prevBtn?.addEventListener("click", (e) => this.handlePrevClick(e));
    this.nextBtn?.addEventListener("click", (e) => this.handleNextClick(e));

    // Zatvaranje klikom na backdrop
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  handleImageClick(e, index) {
    const galleryItem = e.target.parentElement;
    galleryItem.classList.add("clicked");

    const handleAnimationEnd = () => {
      galleryItem.classList.remove("clicked");
      this.showImage(index);
      galleryItem.removeEventListener("animationend", handleAnimationEnd);
    };

    galleryItem.addEventListener("animationend", handleAnimationEnd);
  }

  showImage(index) {
    // Normalizacija indeksa
    if (index < 0) index = this.galleryImages.length - 1;
    if (index >= this.galleryImages.length) index = 0;

    this.currentIndex = index;
    const img = this.galleryImages[this.currentIndex];

    this.modal.style.display = "block";
    this.modalImg.src = img.src;
    this.modalImg.alt = img.alt || "";
    this.captionText.textContent = img.alt || "";
    this.isOpen = true;
  }

  closeModal() {
    this.modal.style.display = "none";
    this.isOpen = false;
  }

  handlePrevClick(e) {
    e.stopPropagation();
    this.showImage(this.currentIndex - 1);
  }

  handleNextClick(e) {
    e.stopPropagation();
    this.showImage(this.currentIndex + 1);
  }

  handleKeydown(e) {
    if (!this.isOpen) return;

    switch (e.key) {
      case "ArrowLeft":
        this.showImage(this.currentIndex - 1);
        break;
      case "ArrowRight":
        this.showImage(this.currentIndex + 1);
        break;
      case "Escape":
        this.closeModal();
        break;
    }
  }
}

// Modul za hamburger menu
class HamburgerMenu {
  constructor() {
    this.hamburger = document.getElementById("hamburger");
    this.navLinks = document.getElementById("nav-links");
    this.navLinkItems = document.querySelectorAll(".nav-links a");

    this.init();
  }

  init() {
    if (!this.hamburger || !this.navLinks) {
      console.warn("Hamburger menu elements not found");
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.hamburger.addEventListener("click", () => this.toggleMenu());

    // Zatvaranje menija klikom na linkove
    this.navLinkItems.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.hamburger.classList.toggle("open");
    this.navLinks.classList.toggle("open");
  }

  closeMenu() {
    this.hamburger.classList.remove("open");
    this.navLinks.classList.remove("open");
  }
}

// Glavni init funkcija
class App {
  constructor() {
    this.animationManager = null;
    this.galleryModal = null;
    this.hamburgerMenu = null;
  }

  init() {
    this.animationManager = new AnimationManager();
    this.animationManager.initAnimations();
    this.animationManager.initGalleryAnimations();

    this.galleryModal = new GalleryModal();
    this.hamburgerMenu = new HamburgerMenu();
  }

  destroy() {
    this.animationManager?.destroy();
    // Ovdje možeš dodati cleanup za ostale module ako je potrebno
  }
}

// Pokretanje aplikacije
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();

  // Cleanup na unload (opcionalno)
  window.addEventListener("beforeunload", () => {
    app.destroy();
  });
});
