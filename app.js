(() => {
  if (typeof window.jQuery === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
    script.onload = () => {
      generateCarousel();
    };
    document.head.appendChild(script);
  } else {
    generateCarousel();
  }
})();

function generateCarousel() {
  (($) => {
    'use strict';

    const APPEND_LOCATION = '.product-detail';

    const ids = {
      productRecom: 'ins-product-recommendations',
    };

    const classes = {
      style: 'ins-carousel-style',
      carouselContainer: 'ins-carousel-container',
      titleContainer: 'ins-title-container',
      title: 'ins-title',
      info: 'ins-title-info',
      carousel: 'ins-carousel',
      previousBtn: 'ins-prev-btn',
      carouselSlider: 'ins-carousel-slider',
      carouselItem: 'ins-carousel-item',
      nextBtn: 'ins-next-btn',
    };

    const selectors = {
      appendLocation: APPEND_LOCATION,
      style: `.${classes.style}`,
      productRecom: `#${ids.productRecom}`,
      carouselContainer: `.${classes.carouselContainer}`,
      titleContainer: `.${classes.titleContainer}`,
      title: `.${classes.title}`,
      titleInfo: `.${classes.titleInfo}`,
      carousel: `.${classes.carousel}`,
      previousBtn: `.${classes.previousBtn}`,
      carouselSlider: `.${classes.carouselSlider}`,
      carouselItem: `.${classes.carouselItem}`,
      nextBtn: `.${classes.nextBtn}`,
    };

    const self = {};

    self.init = () => {
      self.buildHTML();
      self.buildCSS();
      self.setEvents();
    };

    self.reset = () => {
      $(selectors.style).remove();
    };

    self.buildCSS = () => {
      const carouselStyle = `
            <style class="${classes.style}">
              ${selectors.productRecom} {
                display: flex;
                justify-content: center;
              }
              
              ${selectors.carouselContainer} {
                width: 80%;
              }
              
              
            </style>
        `;
      $('head').append(carouselStyle);
    };

    self.buildHTML = () => {
      const html = `
      <div id="${ids.productRecom}">
        <div class="${classes.carouselContainer}">
          <div class="${classes.titleContainer}">
            <h2 class="${classes.title}">İlgini Çekebilecek Diğer Ürünler</h2>
            <button class="${classes.info}"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.477 0 0 4.476 0 10s4.477 10 10 10 10-4.476 10-10S15.523 0 10 0zm.002 4.664a1.256 1.256 0 1 1 0 2.511 1.256 1.256 0 0 1 0-2.51zm2.197 10.672H7.805v-1.883h.941V9.686h-.941V7.803h3.453v5.65h.941v1.883z" fill="#1F49B6"></path></svg></button>
            <div class="${classes.carousel}">
              <button class="${classes.previousBtn}"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
              <div class="${classes.carouselSlider}">
              </div>
              <button class="${classes.nextBtn}"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
            </div>
          </div>
        </div>
      </div>
      `;
      $(selectors.appendLocation).after(html);
    };

    self.setEvents = () => {};

    $(document).ready(self.init);
  })(jQuery);
}
