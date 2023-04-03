import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Heading Animation
const sections = gsap.utils.toArray('section');
sections.forEach((section, i) => {
  const heading = section.querySelector('.heading-style-h2');
  if (heading) {
    const split = new SplitText(heading, { type: 'lines' });
    gsap.from(split.lines, {
      xPercent: -5,
      autoAlpha: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      },
      onComplete: () => {
        split.revert;
      },
    });
  }
});
