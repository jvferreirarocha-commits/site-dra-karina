const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll("[data-reveal]");
const faqItems = document.querySelectorAll(".faq-item");
const testimonialTrack = document.querySelector(".testimonial-track");
const clinicCarousel = document.querySelector(".clinic-carousel");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
  header.classList.toggle("nav-active", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    header.classList.remove("nav-active");
    document.body.classList.remove("nav-open");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

faqItems.forEach((item) => {
  const trigger = item.querySelector("button");
  trigger.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");

    faqItems.forEach((currentItem) => {
      currentItem.classList.remove("is-open");
      currentItem.querySelector("button").setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", shouldOpen);
    trigger.setAttribute("aria-expanded", String(shouldOpen));
  });
});

if (testimonialTrack) {
  testimonialTrack.querySelectorAll("[aria-hidden='true']").forEach((card) => card.remove());
  const originals = Array.from(testimonialTrack.children);

  originals.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    testimonialTrack.appendChild(clone);
  });
}

if (clinicCarousel) {
  const track = clinicCarousel.querySelector(".clinic-track");
  const slides = Array.from(clinicCarousel.querySelectorAll(".clinic-slide"));
  const previous = clinicCarousel.querySelector(".clinic-prev");
  const next = clinicCarousel.querySelector(".clinic-next");
  const dots = clinicCarousel.querySelector(".clinic-dots");
  let activeIndex = 0;
  let autoplayId;

  const renderCarousel = () => {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });

    dots.querySelectorAll(".clinic-dot").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
    });
  };

  const goToSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    renderCarousel();
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => goToSlide(activeIndex + 1), 4200);
  };

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "clinic-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Mostrar foto ${index + 1}`);
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoplay();
    });
    dots.appendChild(dot);
  });

  previous.addEventListener("click", () => {
    goToSlide(activeIndex - 1);
    restartAutoplay();
  });

  next.addEventListener("click", () => {
    goToSlide(activeIndex + 1);
    restartAutoplay();
  });

  renderCarousel();
  restartAutoplay();
}
