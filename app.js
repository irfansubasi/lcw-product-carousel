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
      nextBtn: 'ins-next-btn',
      productCard: 'ins-product-card',
      imgWrapper: 'ins-img-wrapper',
      productImg: 'ins-product-img',
      favorite: 'ins-favorite',
      productInfo: 'ins-product-info',
      productName: 'ins-product-name',
      productPrice: 'ins-product-price',
      productLink: 'ins-product-link',
      oldPrice: 'ins-old-price',
      currentPrice: 'ins-current-price',
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
      nextBtn: `.${classes.nextBtn}`,
      productCard: `.${classes.productCard}`,
      imgWrapper: `.${classes.imgWrapper}`,
      productImg: `.${classes.productImg}`,
      favorite: `.${classes.favorite}`,
      productInfo: `.${classes.productInfo}`,
      productName: `.${classes.productName}`,
      productPrice: `.${classes.productPrice}`,
      productLink: `.${classes.productLink}`,
      oldPrice: `.${classes.oldPrice}`,
      currentPrice: `.${classes.currentPrice}`,
    };

    const self = {};

    self.init = () => {
      self.buildHTML();
      self.buildCSS();
      self.setEvents();
      self.checkAndLoadData();
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

              ${selectors.carouselSlider}{
                display: flex;
                gap: 9px;
              }

              ${selectors.carousel}{
                position: relative;
              }

              ${selectors.previousBtn}{
                cursor: pointer;
                background-color: transparent;
                border: none;
                position: absolute;
                top: 50%;
                left: -35px;
                transform: translateY(-50%);
              }

              ${selectors.nextBtn}{
                cursor: pointer;
                background-color: transparent;
                border: none;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
              }

              ${selectors.productCard}{
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 220px;
                height: 395px;
              }

              ${selectors.imgWrapper}{
                position: relative;
                height: 292.88px;
                width: 100%;
              }

              ${selectors.productImg}{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              ${selectors.favorite}{
                position: absolute;
                top: 6%;
                right: 10%;
              }

              ${selectors.productLink}{
                text-decoration: none;
              }

              ${selectors.productInfo}{
                display: flex;
                flex-direction: column;
                padding: 0 10px;
                background-color: #fff;
              }

              ${selectors.productName}{
                height: 40px;
                font-size: 14px;
                margin-top: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              ${selectors.productName} p{
                color: #302e2b;
                margin: 0 0 10px;
              }

              ${selectors.productPrice}{
                display: flex;
                flex-direction: column;
                height: 50px;
                margin-top: 8px;
              }

              ${selectors.oldPrice} {
                font-size: 14px;
                color:#555;
                text-decoration: line-through;
                visibility: hidden;
              }

              ${selectors.oldPrice} p{
                margin: 0;
              }

              ${selectors.currentPrice}{
                font-size: 18px;
                font-weight: 700;
                white-space: nowrap;
                color: #193db0;
                margin: 0;
              }

              ${selectors.productInfo} p{
                margin: 0;
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

    self.checkAndLoadData = () => {
      let products = self.getFromLocalStorage();

      if (products) {
        self.renderProducts(products);
      } else {
        self.fetchData();
      }
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
          self.renderProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    self.renderProducts = (products) => {
      $(selectors.carouselSlider).empty();
      $.each(products, (index, product) => {
        const cardDiv = `
        <a href="${product.url}" class=${classes.productLink}>
            <div class=${classes.productCard}>
                <div class=${classes.imgWrapper}>
                    <img src=${product.img} class=${classes.productImg} />
                    <div class=${classes.favorite}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none"><path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9" d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path></svg>
                    </div>
                </div>
                <div class=${classes.productInfo}>
                    <div class=${classes.productName}> <p>${product.name}</p> </div>
                    <div class=${classes.productPrice}>
                      <div class=${classes.oldPrice}>
                        <p>&nbsp;</p>
                      </div>
                      <div class=${classes.currentPrice}>
                        <p>${product.price} TL</p>
                      </div>
                    </div>
                </div>
            </div>
        </a>
      `;

        $(selectors.carouselSlider).append(cardDiv);
      });
    };

    self.setEvents = () => {};

    $(document).ready(self.init);
  })(jQuery);
}
