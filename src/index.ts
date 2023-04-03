import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { columnAnim } from '$utils/columnAnim';
import { productHeaderAnim } from '$utils/productHeader';
import { stickySection } from '$utils/stickySection';

gsap.registerPlugin(ScrollTrigger, SplitText);

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

window.Webflow ||= [];
window.Webflow.push(() => {
  stickySection();
  columnAnim();

  //Hero Animation
  const heroWrapper = document.querySelector('.section_home-hero');
  const heroImage = document.querySelector('.home-hero_background-image');

  if (heroWrapper && heroImage) {
    gsap.to(heroImage, {
      yPercent: 10,
      scrollTrigger: {
        trigger: heroWrapper,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  $('.form-input').on('focusin', function () {
    $(this).siblings('.field-label').removeClass('placeholder');
  });
  $('.form-input').on('focusout', function () {
    if ($(this).val().length == 0) {
      $(this).siblings('.field-label').addClass('placeholder');
    }
  });

  // MARQUEE POWER-UP
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== 'string' || attrVal.trim() === '') return defaultVal;
    if (attrVal === 'true' && defaultValType === 'boolean') return true;
    if (attrVal === 'false' && defaultValType === 'boolean') return false;
    if (isNaN(attrVal) && defaultValType === 'string') return attrVal;
    if (!isNaN(attrVal) && defaultValType === 'number') return +attrVal;
    return defaultVal;
  }
  // marquee component
  $("[tr-marquee-element='component']").each(function (index) {
    const componentEl = $(this),
      panelEl = componentEl.find("[tr-marquee-element='panel']"),
      triggerHoverEl = componentEl.find("[tr-marquee-element='triggerhover']"),
      triggerClickEl = componentEl.find("[tr-marquee-element='triggerclick']");
    let speedSetting = attr(100, componentEl.attr('tr-marquee-speed')),
      verticalSetting = attr(false, componentEl.attr('tr-marquee-vertical')),
      reverseSetting = attr(false, componentEl.attr('tr-marquee-reverse')),
      scrollDirectionSetting = attr(false, componentEl.attr('tr-marquee-scrolldirection')),
      scrollScrubSetting = attr(false, componentEl.attr('tr-marquee-scrollscrub')),
      moveDistanceSetting = -100,
      timeScaleSetting = 1,
      pausedStateSetting = false;
    if (reverseSetting) moveDistanceSetting = 100;
    const marqueeTimeline = gsap.timeline({
      repeat: -1,
      onReverseComplete: () => marqueeTimeline.progress(1),
    });
    if (verticalSetting) {
      speedSetting = panelEl.first().height() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { yPercent: 0 },
        { yPercent: moveDistanceSetting, ease: 'none', duration: speedSetting }
      );
    } else {
      speedSetting = panelEl.first().width() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { xPercent: 0 },
        { xPercent: moveDistanceSetting, ease: 'none', duration: speedSetting }
      );
    }
    const scrubObject = { value: 1 };
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (!pausedStateSetting) {
          if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
            timeScaleSetting = self.direction;
            marqueeTimeline.timeScale(self.direction);
          }
          if (scrollScrubSetting) {
            let v = self.getVelocity() * 0.006;
            v = gsap.utils.clamp(-60, 60, v);
            const scrubTimeline = gsap.timeline({
              onUpdate: () => marqueeTimeline.timeScale(scrubObject.value),
            });
            scrubTimeline.fromTo(
              scrubObject,
              { value: v },
              { value: timeScaleSetting, duration: 0.5 }
            );
          }
        }
      },
    });
    function pauseMarquee(isPausing) {
      pausedStateSetting = isPausing;
      const pauseObject = { value: 1 };
      const pauseTimeline = gsap.timeline({
        onUpdate: () => marqueeTimeline.timeScale(pauseObject.value),
      });
      if (isPausing) {
        pauseTimeline.fromTo(pauseObject, { value: timeScaleSetting }, { value: 0, duration: 0.5 });
        triggerClickEl.addClass('is-paused');
      } else {
        pauseTimeline.fromTo(pauseObject, { value: 0 }, { value: timeScaleSetting, duration: 0.5 });
        triggerClickEl.removeClass('is-paused');
      }
    }
    if (window.matchMedia('(pointer: fine)').matches) {
      triggerHoverEl.on('mouseenter', () => pauseMarquee(true));
      triggerHoverEl.on('mouseleave', () => pauseMarquee(false));
    }
    triggerClickEl.on('click', function () {
      !$(this).hasClass('is-paused') ? pauseMarquee(true) : pauseMarquee(false);
    });
  });

  // Nav Interactions
  const navbarLinkWrappers = document.querySelectorAll('.navbar_link-wrapper');
  const navButton = document.querySelector('.navbar_menu-button');
  const navbar = document.querySelector('.navbar_component');
  const menu = document.querySelector('.navbar_menu');
  const submenus = document.querySelectorAll('.navbar_submenu');

  navbarLinkWrappers.forEach((navbarLinkWrapper) => {
    const navbarSubmenu = navbarLinkWrapper.querySelector('.navbar_submenu');
    const navbarOverlay = navbarLinkWrapper.querySelector('.navbar_page-overlay');

    // create
    const mm = gsap.matchMedia();

    // add a media query. When it matches, the associated function will run
    mm.add('(min-width: 992px)', () => {
      // this setup code only runs when viewport is at least 800px wide
      // Set the initial state of the submenu to be hidden

      //clear any inline styles on 'menu'
      gsap.set(menu, { clearProps: 'all' });
      gsap.set(navbarSubmenu, { autoAlpha: 0, display: 'flex' });
      gsap.set(navbarOverlay, { autoAlpha: 0, display: 'block' });

      // When the user hovers over the link wrapper, show the submenu
      navbarLinkWrapper.addEventListener('mouseenter', () => {
        gsap.to(navbarSubmenu, { duration: 0.3, autoAlpha: 1 });
        gsap.to(navbarOverlay, { duration: 0.3, autoAlpha: 1 });
      });

      // When the user moves their mouse away from the link wrapper, hide the submenu
      navbarLinkWrapper.addEventListener('mouseleave', () => {
        gsap.to(navbarSubmenu, { duration: 0.3, autoAlpha: 0 });
        gsap.to(navbarOverlay, { duration: 0.3, autoAlpha: 0 });
      });

      return () => {
        // optional
        // custom cleanup code here (runs when it STOPS matching)
      };
    });
  });

  $('.navbar_link, .navbar_arrow.is-forward').on('click', function () {
    $(this).siblings('.navbar_submenu').addClass('is-open');
  });
  $('.navbar_arrow.is-back').on('click', function () {
    $(this).closest('.navbar_submenu').removeClass('is-open');
  });

  // on click of navButton toggle the class 'is-open' on the navbar

  navButton.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
    // if the navbar has the class 'is-open' then set the menu to display flex, else set to display none
    if (navbar.classList.contains('nav-open')) {
      menu.style.display = 'flex';
    } else {
      menu.style.display = 'none';
      // find all .navbar_submenu elements and remove the class is-open
      submenus.forEach((submenu) => {
        submenu.classList.remove('is-open');
      });
    }
  });
});
