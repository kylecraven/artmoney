import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

CustomEase.create('customEase', '.58,0,0,1');

export const columnAnim = () => {
  const grids = document.querySelectorAll('.grid');
  grids.forEach((grid) => {
    const items = grid.querySelectorAll('.selling-points_item-content > *');
    const itemsArray = gsap.utils.toArray(items);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: 'top 95%',
      },
    });
    tl.from(itemsArray, { xPercent: -10, stagger: 0.2, autoAlpha: 0 });
  });

  // Content wrappers
  const contentWrappers = document.querySelectorAll('.content-wrapper');
  contentWrappers.forEach((wrapper) => {
    const heading = wrapper.querySelector('.heading-style-h2');
    if (heading) {
      const split = new SplitText(heading, { type: 'lines' });
      gsap.from(split.lines, {
        xPercent: -10,
        autoAlpha: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 70%',
        },
        onComplete: () => {
          split.revert;
        },
      });
    }
  });
};
