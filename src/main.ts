import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

const slideContainer = document.querySelector<HTMLDivElement>(".slides")!;
const slides = document.querySelectorAll(".slide")!;
const slideTitles = document.querySelectorAll(".slide .title h1");

const slideHeight = slideContainer.offsetHeight;
const slideContainerHeight = slides.length * slideHeight;

gsap.set(".slide", { zIndex: (i, _, targets) => targets.length - i });
gsap.set(".slide .title h1", { y: 100, duration: 0.15, opacity: 0 });

let previousSlideIndex = 0;
let currentSlideIndex = -1;

gsap.to(".slide:not(:last-child)", {
  yPercent: -100,
  ease: "none",
  stagger: 0.5,
  scrollTrigger: {
    trigger: slideContainer,
    start: "top top",
    end: `${slideContainerHeight}px`,
    scrub: true,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const movement = slideContainerHeight * progress;
      const progressSlideIndex = Math.floor(movement / slideHeight);

      if (progressSlideIndex !== currentSlideIndex) {
        if (progressSlideIndex > currentSlideIndex) {
          // Scrolling down
          previousSlideIndex = Math.max(0, progressSlideIndex - 1);
        } else if (progressSlideIndex < currentSlideIndex) {
          // Scrolling up
          previousSlideIndex = Math.min(
            progressSlideIndex + 1,
            slides.length - 1
          );
        }

        currentSlideIndex = progressSlideIndex;
        const title = slideTitles[currentSlideIndex];
        const prevTitle = slideTitles[previousSlideIndex];

        if (!title) {
          return;
        }

        gsap.to(title, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        });

        if (prevTitle && previousSlideIndex !== currentSlideIndex) {
          gsap.to(prevTitle, {
            y: 100,
            opacity: 0,
            duration: 0.25,
            ease: "power1.out",
          });
        }
      }
    },
  },
});
