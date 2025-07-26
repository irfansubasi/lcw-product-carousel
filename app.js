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
    const API_URL =
      'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';
    const CACHE_EXPIRY = 1000 * 60 * 60 * 24;

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
      info: `.${classes.info}`,
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
                background-color: #f4f5f7;
              }
              
              ${selectors.carouselContainer} {
                width: 80%;
              }
              
              ${selectors.titleContainer} {
                color: #29323b;
                display: flex;
                align-items: center;
                font-size: 32px;
                font-weight: 100;
                padding: 15px 0;
              }

              ${selectors.title} {
                font-size: inherit;
                font-weight: inherit;
                line-height: 43px;
                margin: 0!important;
              }
              
              ${selectors.info} {
                margin-left: 8px;
                cursor: pointer;
                border: none;
                background-color: transparent;
                padding: 0;
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
          </div>
          <div class="${classes.carousel}">
              <button class="${classes.previousBtn}"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
              <div class="${classes.carouselSlider}">
              </div>
              <button class="${classes.nextBtn}"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
            </div>
        </div>
      </div>
      `;
      $(selectors.appendLocation).after(html);
    };

    self.saveToLocalStorage = (data) => {
      const toStore = {
        products: data,
        exp: Date.now(),
      };
      localStorage.setItem('insProducts', JSON.stringify(toStore));
    };

    self.getFromLocalStorage = () => {
      const stored = localStorage.getItem('insProducts');
      if (!stored) return null;

      try {
        const parsed = JSON.parse(stored);

        if (!parsed.exp || !parsed.products) return null;

        if (Date.now() - parsed.exp > CACHE_EXPIRY) {
          localStorage.removeItem('insProducts');
          return null;
        }

        return parsed.products;
      } catch (err) {
        console.error('localStorage parse errorÇ', err);
        return null;
      }
    };

    self.fetchData = () => {
      fetch(API_URL)
        .then((response) => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then((data) => {
          self.saveToLocalStorage(data);
          //buraya render gelecek unutma
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    self.setEvents = () => {};

    $(document).ready(self.init);
  })(jQuery);
}
