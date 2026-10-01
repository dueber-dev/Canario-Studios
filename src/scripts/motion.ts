import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const section = document.querySelector<HTMLElement>(".journey");
const track = document.querySelector<HTMLElement>(".services");
const panels = gsap.utils.toArray<HTMLElement>(".service");
const nav = document.querySelector<HTMLElement>(".journey-navigation");
const count = document.querySelector<HTMLElement>("[data-journey-count]");
const bird = document.querySelector<SVGElement>(".journey-bird");
const buttons = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-scene]"),
);
const media = gsap.matchMedia();

if (section && track && nav && count && bird) {
  media.add(
    "(min-width: 1000px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
    () => {
      section.classList.add("is-horizontal");
      nav.hidden = false;
      let selected = -1;
      const setActive = (progress: number) => {
        const active = Math.round(progress * (panels.length - 1));
        if (active === selected) return;
        selected = active;
        count.textContent = `0${active + 1} / 03`;
        buttons.forEach((button, index) => {
          if (index === active) button.setAttribute("aria-current", "step");
          else button.removeAttribute("aria-current");
        });
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "canario-journey",
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(1800, window.innerWidth * 1.65)}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(self.progress),
        },
      });
      timeline.to(
        track,
        {
          x: () => -(track.scrollWidth - section.clientWidth),
          ease: "none",
          duration: 1,
        },
        0,
      );
      timeline.to(
        bird,
        {
          x: () =>
            (document.querySelector<HTMLElement>(".flight-guide")
              ?.clientWidth ?? section.clientWidth) - 60,
          y: -10,
          rotation: -4,
          ease: "none",
          duration: 1,
        },
        0,
      );
      panels.forEach((panel) => {
        const art = panel.querySelector(".service-art");
        if (art)
          gsap.fromTo(
            art,
            { y: 35, opacity: 0.5 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: timeline,
                start: "left 85%",
                end: "left 40%",
                scrub: true,
              },
            },
          );
      });
      const goTo = (event: Event) => {
        const index = Number(
          (event.currentTarget as HTMLButtonElement).dataset.scene,
        );
        const trigger = timeline.scrollTrigger;
        if (trigger)
          window.scrollTo({
            top:
              trigger.start +
              ((trigger.end - trigger.start) * index) / (panels.length - 1),
            behavior: "smooth",
          });
      };
      buttons.forEach((button) => button.addEventListener("click", goTo));
      setActive(0);
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
      return () => {
        section.classList.remove("is-horizontal");
        nav.hidden = true;
        count.textContent = "01 / 03";
        buttons.forEach((button) => button.removeEventListener("click", goTo));
      };
    },
  );
}

// Astro uses full-page navigation here. BFCache restores the existing scene.
const refreshOnShow = () => ScrollTrigger.refresh();
window.addEventListener("pageshow", refreshOnShow);
if (import.meta.hot) import.meta.hot.dispose(() => {
  media.revert();
  window.removeEventListener('pageshow', refreshOnShow);
});
