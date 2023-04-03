import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

CustomEase.create('customEase', '.58,0,0,1');

export const stickySection = () => {
  document.querySelectorAll('.section_how-it-works').forEach(function (element) {
    const childTriggers = element.querySelectorAll('.how-it-works_item');
    const childTargets = element.querySelectorAll('.how-it-works_image-mask');
    const imageWrapper = element.querySelector('.how-it-works_image-wrapper');
    const imageOverlay = element.querySelector('.how-it-works_image-overlay');
    const stickCta = element.querySelector('.sticky-cta_component');

    // Sticky CTA
    ScrollTrigger.create({
      trigger: imageWrapper,
      endTrigger: '.footer_component',
      start: 'bottom bottom',
      end: 'top bottom',
      onEnter: () => {
        stickCta.classList.add('is-active');
      },
      onEnterBack: () => {
        stickCta.classList.add('is-active');
      },
      onLeave: () => {
        stickCta.classList.remove('is-active');
      },
      onLeaveBack: () => {
        stickCta.classList.remove('is-active');
      },
    });

    function makeItemActive(index) {
      childTriggers.forEach(function (trigger) {
        trigger.classList.add('is-faded');
      });
      childTriggers[index].classList.remove('is-faded');
    }

    makeItemActive(0);

    let scrollSpeed = 0;

    function isScrollSpeedInRange(minSpeed, maxSpeed) {
      return scrollSpeed >= minSpeed && scrollSpeed <= maxSpeed;
    }
    function animateImage(index) {
      const tl = gsap.timeline({
        defaults: { ease: 'customEase', duration: 1 },
      });
      tl.fromTo(imageOverlay, { xPercent: -100 }, { xPercent: 0 });
      tl.add(() => {
        childTargets.forEach(function (target) {
          target.classList.remove('is-active');
        });
        childTargets[index].classList.add('is-active');
      });
      tl.fromTo(childTargets[index].querySelector('img'), { scale: 1.2 }, { scale: 1 });
      tl.fromTo(imageOverlay, { xPercent: 0 }, { xPercent: 100 }, '<');
    }

    childTriggers.forEach(function (trigger, index) {
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top 20%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          scrollSpeed = Math.abs(self.getVelocity());
          console.log(scrollSpeed);
        },
        onEnter: () => {
          if (isScrollSpeedInRange(/*minSpeed=*/ 0, /*maxSpeed=*/ 2000)) {
            animateImage(index);
          }
          makeItemActive(index);
        },
        onEnterBack: () => {
          if (isScrollSpeedInRange(/*minSpeed=*/ 0, /*maxSpeed=*/ 2000)) {
            animateImage(index);
          }

          makeItemActive(index);
        },
      });
    });
  });
};
