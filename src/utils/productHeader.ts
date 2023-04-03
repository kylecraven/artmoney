import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

CustomEase.create('customEase', '.58,0,0,1');

const header = document.querySelector('.section_product-header');

if (header) {
  const headerContent = document.querySelector('.header_content');
  const heading = headerContent.querySelector('h1');
  const subheading = headerContent.querySelector('.text-size-medium');
  const image = header.querySelector('.header_image-wrapper');

  const splitHeading = new SplitText(heading, { type: 'lines' });
  const splitSubheading = new SplitText(subheading, { type: 'lines' });

  const tl = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: 'customEase',
    },
  });

  tl.from(splitHeading.lines, {
    xPercent: -120,
    stagger: 0.1,
    onComplete: () => {
      splitHeading.revert;
    },
  });
  tl.from(
    splitSubheading.lines,
    {
      xPercent: -120,
      stagger: 0.1,
      onComplete: () => {
        splitSubheading.revert;
      },
    },
    '-=0.8'
  );
}
