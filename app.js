(() => {
  if (window.location.hostname !== 'www.lcw.com') {
    console.error('Bu kod sadece https://www.lcw.com sitesinde çalışır.');
    return;
  }

  if (!document.querySelector('.product-detail')) {
    console.error(
      'Bu kod sadece ürün sayfalarında çalışır. Sayfada .product-detail elementi bulunamadı.'
    );
    return;
  }

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
      productCardWrapper: 'ins-product-card-wrapper',
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
      carouselWrapper: 'ins-carousel-wrapper',
      dragging: 'ins-dragging',
      cartBtnWrapper: 'ins-cart-btn-wrapper',
      cartBtn: 'ins-cart-btn',
      modal: 'ins-modal',
      modalOverlay: 'ins-modal-overlay',
      modalContent: 'ins-modal-content',
      modalIcon: 'ins-modal-icon',
      modalText: 'ins-modal-text',
      modalButton: 'ins-modal-button',
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
      productCardWrapper: `.${classes.productCardWrapper}`,
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
      carouselWrapper: `.${classes.carouselWrapper}`,
      dragging: `.${classes.dragging}`,
      cartBtnWrapper: `.${classes.cartBtnWrapper}`,
      cartBtn: `.${classes.cartBtn}`,
      modal: `.${classes.modal}`,
      modalOverlay: `.${classes.modalOverlay}`,
      modalContent: `.${classes.modalContent}`,
      modalIcon: `.${classes.modalIcon}`,
      modalText: `.${classes.modalText}`,
      modalButton: `.${classes.modalButton}`,
    };

    const self = {
      hasMoved: false,
    };

    self.init = () => {
      self.buildHTML();
      self.buildCSS();
      self.setEvents();
      self.checkAndLoadData();
      self.enableMouseDragScroll($(selectors.carouselWrapper));
    };

    self.reset = () => {
      $(selectors.style).remove();
      $(selectors.productRecom).remove();
      $(document).off('.favoritesEvent');
      $(document).off('.prevEvent');
      $(document).off('.nextEvent');
      $(document).off('.cartEvent');
      $(document).off('.productCardEvent');
      $(document).off('.modalEvent');
      $(selectors.info).off('.modalEvent');
      $(selectors.modalOverlay).off('.modalEvent');
      $(selectors.modalButton).off('.modalEvent');
      self.hasMoved = false;
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
                border: none;
                background-color: transparent;
                padding: 0;
              }

              ${selectors.carouselWrapper}{
                overflow: hidden;
                scroll-behavior: smooth;
              }

              ${selectors.carouselSlider}{
                display: flex;
                gap: 9px;
                transition: transform 0.4s ease;
              }

              ${selectors.carousel}{
                position: relative;
                padding-bottom: 32px;
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
                right: -35px;
                transform: translateY(-50%) rotate(180deg);
              }

              ${selectors.productCard}{
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 220px;
                height: 395px;
                user-select: none;
                cursor: pointer;
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
                user-select: none;
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                pointer-events: none;
              }

              ${selectors.favorite}{
                position: absolute;
                top: 6%;
                right: 10%;
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
              }

              ${selectors.oldPrice}.ins-hidden {
                visibility: hidden;
              }

              ${selectors.oldPrice}.ins-visible {
                visibility: visible;
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

              ${selectors.dragging}{
                cursor: grabbing;
              }

              ${selectors.cartBtnWrapper}{
                display: flex;
                justify-content: center;
                width: 100%;
                margin: 10px 0 0;
              }

              ${selectors.cartBtn} {
                cursor: pointer;
                height: 35px;
                display: block;
                background-color: #193db0;
                color: #fff;
                width: 100%;
                border-radius: 5px;
                border: none;
                line-height: 19px;
                font-size: 14px;
                font-weight: bold;
                text-transform: uppercase;
                text-align: center;
                padding: 8px 28.1px 9px 28.5px;
              }

              ${selectors.modal}{
                width: 100%;
                height: 100%;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9999;
                display: none;
              }

              ${selectors.modalOverlay}{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 10;
              }

              ${selectors.modalIcon}{
                margin-bottom: 18px;
              }

              ${selectors.modalContent}{
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 25px 30px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                width: 352px;
                height: auto;
                border-radius: 5px;
                z-index: 9999;
              }

              ${selectors.modalText}{
                width: 280px;
                height: 100%;
                flex-grow: 0;
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
                color: #555;
              }

              ${selectors.modalButton}{
                margin-top: 16px;
                min-width: 100%;
                height: 40px;
                flex-grow: 0;
                border-radius: 5px;
                background-color: #193db0;
                border: none;
                font-size: 16px;
                font-weight: 700;
                line-height: 1.38;
                color: #fff;
              }



              @media (max-width: 992px) {
                ${selectors.carouselWrapper}{
                  scroll-behavior: unset;
                  overflow-x: auto;
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                  scroll-snap-type: x mandatory;
                  scroll-snap-align: start;
                  -webkit-overflow-scrolling: touch;
                  -ms-overflow-style: none;
                }

                ${selectors.previousBtn}{
                  display: none;
                }

                ${selectors.nextBtn}{
                  display: none;
                }

                ${selectors.productCard}{
                  width: 280px;
                  height: 521.75px;
                }

                ${selectors.imgWrapper}{
                  height: 372.75px;
                }

                ${selectors.carouselContainer}{
                  width: 100%;
                  padding: 0 15px;
                  z-index: 1;
                }

                ${selectors.carouselSlider}{
                  gap: 24.38px;
                }

                ${selectors.titleContainer}{
                  font-size: 24px;
                  font-weight: 100;
                }

                ${selectors.title}{
                  line-height: 33px;
                }
              }

              @media (max-width: 768px) {
                ${selectors.carouselSlider}{
                  gap: 21px;
                }
              }

              @media (max-width: 576px) {
                ${selectors.carouselSlider}{
                  gap: 15px;
                }
              }

              @media (max-width: 408px) {
                ${selectors.titleContainer}{
                  flex-direction: column;
                  align-items: flex-start;
                }
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
              <div class="${classes.carouselWrapper}">
                <div class="${classes.carouselSlider}">
                </div>
              </div>
              <button class="${classes.nextBtn}"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
            </div>
        </div>
      </div>
      
      <div class="${classes.modal}">
        <div class="${classes.modalOverlay}"></div>
        <div class="${classes.modalContent}">
          <div class="${classes.modalIcon}">
            <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M64.09 32.045c0 17.698-14.347 32.045-32.045 32.045S0 49.743 0 32.045 14.347 0 32.045 0 64.09 14.347 64.09 32.045z" fill="#F0F7FC"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.898 37.996c-1 0-1.84.839-1.84 1.84 0 1 .84 1.84 1.84 1.84.964 0 1.84-.84 1.796-1.796a1.796 1.796 0 0 0-1.796-1.884z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M48.926 44.516c1.155-1.995 1.163-4.371.015-6.358L37.417 18.2c-1.14-2.009-3.2-3.201-5.512-3.201-2.31 0-4.37 1.2-5.511 3.194L14.856 38.173a6.332 6.332 0 0 0 .022 6.394 6.297 6.297 0 0 0 5.497 3.157h23.017c2.304 0 4.371-1.2 5.534-3.208zm-2.502-1.443a3.477 3.477 0 0 1-3.039 1.76H20.367a3.43 3.43 0 0 1-3.002-1.723 3.482 3.482 0 0 1-.008-3.51l11.539-19.971a3.415 3.415 0 0 1 3.01-1.744 3.43 3.43 0 0 1 3.01 1.75l11.53 19.972c.618 1.075.611 2.37-.022 3.466z" fill="#1F49B6"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M31.444 25.081c-.876.25-1.42 1.045-1.42 2.01.044.58.08 1.17.124 1.75l.376 6.601c.044.75.625 1.295 1.376 1.295.75 0 1.34-.58 1.376-1.339 0-.456 0-.876.044-1.34.081-1.42.17-2.84.25-4.26.044-.92.125-1.84.17-2.76 0-.33-.045-.625-.17-.92a1.844 1.844 0 0 0-2.126-1.037z" fill="#1F49B6"></path>
            </svg>
          </div>
          <div class="${classes.modalText}">
            <p>Bu sayfada satın alma verilerine göre ürün detayına gidilen ürün ile birlikte beden bulunurluğu yüksek olan seçili kategori ve ürün tipinde en sık satın alınan LCW markalı ürünler öncelikli olarak gösterilir.</p>
          </div>
          <button class="${classes.modalButton}">TAMAM</button>
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

    self.generateOldPrice = (currentPrice) => {
      const shouldHaveOldPrice = Math.random() < 0.3;

      if (shouldHaveOldPrice) {
        const price = parseFloat(currentPrice);
        const extraAmount = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
        const oldPriceAmount = price + extraAmount;
        return {
          price: `${oldPriceAmount.toFixed(2)} TL`,
          class: 'ins-visible',
        };
      } else {
        return {
          price: '0 TL',
          class: 'ins-hidden',
        };
      }
    };

    self.renderProducts = (products) => {
      $(selectors.carouselSlider).empty();
      $.each(products, (index, product) => {
        const oldPriceData = self.generateOldPrice(product.price);

        const cardDiv = `
            <div class=${classes.productCardWrapper}>
              <div class=${classes.productCard} data-product-id="${product.id}" data-url="${product.url}">
                <div class=${classes.imgWrapper}>
                    <img src=${product.img} class=${classes.productImg} />
                    <div class=${classes.favorite}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none"><path fill="#fff" fill-rule="evenodd" stroke="#B6B7B9" d="M19.97 6.449c-.277-3.041-2.429-5.247-5.123-5.247-1.794 0-3.437.965-4.362 2.513C9.57 2.147 7.993 1.2 6.228 1.2c-2.694 0-4.846 2.206-5.122 5.247-.022.135-.112.841.16 1.994.393 1.663 1.3 3.175 2.621 4.373l6.594 5.984 6.707-5.984c1.322-1.198 2.228-2.71 2.62-4.373.273-1.152.183-1.86.162-1.993z" clip-rule="evenodd"></path></svg>
                    </div>
                </div>
                <div class=${classes.productInfo}>
                  <div class=${classes.productName}> <p>${product.name}</p> </div>
                  <div class=${classes.productPrice}>
                    <div class="${classes.oldPrice} ${oldPriceData.class}">
                      <p>${oldPriceData.price}</p>
                    </div>
                    <div class=${classes.currentPrice}>
                      <p>${product.price} TL</p>
                    </div>
                  </div>
                  <div class=${classes.cartBtnWrapper}>
                    <span class=${classes.cartBtn}>Sepete Ekle</span>
                  </div>
                </div>
              </div>
            </div>
        `;

        $(selectors.carouselSlider).append(cardDiv);
      });

      const favorites = JSON.parse(
        localStorage.getItem('insFavorites') || '[]'
      );
      $.each(favorites, (index, id) => {
        $(`.${classes.productCard}[data-product-id="${id}"]`)
          .find(`.${classes.favorite}`)
          .find('path')
          .attr('fill', '#193db0')
          .attr('stroke', 'none');
      });
    };

    self.setEvents = () => {
      $(selectors.carouselSlider).on(
        `click.favoritesEvent`,
        selectors.favorite,
        function (e) {
          e.stopPropagation();
          e.preventDefault();

          const productId = $(this)
            .closest(`.${classes.productCard}`)
            .data('product-id');
          const path = $(this).find('path');
          const favorites = JSON.parse(
            localStorage.getItem('insFavorites') || '[]'
          );

          if (path.attr('fill') === '#fff') {
            path.attr('fill', '#193db0');
            path.attr('stroke', 'none');
            favorites.push(productId);
          } else {
            path.attr('fill', '#fff');
            path.attr('stroke', '#B6B7B9');
            const index = favorites.indexOf(productId);
            if (index > -1) {
              favorites.splice(index, 1);
            }
          }

          localStorage.setItem('insFavorites', JSON.stringify(favorites));
        }
      );

      $(selectors.previousBtn).on(`click.prevEvent`, () => {
        const currentScroll = $(selectors.carouselWrapper).scrollLeft();
        $(selectors.carouselWrapper).scrollLeft(currentScroll - 229);
      });

      $(selectors.nextBtn).on(`click.nextEvent`, () => {
        const currentScroll = $(selectors.carouselWrapper).scrollLeft();
        $(selectors.carouselWrapper).scrollLeft(currentScroll + 229);
      });

      $(document).on(
        `click.productCardEvent`,
        selectors.productCard,
        function (e) {
          if (self.hasMoved) return;

          if ($(e.target).closest(selectors.cartBtn).length > 0) {
            return;
          }

          const url = $(this).data('url');
          if (url) {
            window.open(url, '_blank');
          }
        }
      );

      $(document).on(`click.cartEvent`, selectors.cartBtn, function (e) {
        e.stopPropagation();

        const productId = $(this)
          .closest(`.${classes.productCard}`)
          .data('product-id');

        const insCart = JSON.parse(localStorage.getItem('insCart') || '[]');

        if (insCart.includes(productId)) {
          alert('Ürün zaten sepetinizde bulunmaktadır.');
          return;
        }

        insCart.push(productId);
        localStorage.setItem('insCart', JSON.stringify(insCart));
        alert('Ürün sepetinize eklendi.');
      });

      $(selectors.info).on('click.modalEvent', () => {
        $(selectors.modal).show();
      });

      $(selectors.modalOverlay).on('click.modalEvent', () => {
        $(selectors.modal).hide();
      });

      $(selectors.modalButton).on('click.modalEvent', () => {
        $(selectors.modal).hide();
      });
    };

    self.enableMouseDragScroll = (wrapper) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      wrapper.on('mousedown', function (e) {
        isDown = true;
        self.hasMoved = false;
        startX = e.pageX - wrapper.offset().left;
        scrollLeft = wrapper.scrollLeft();
        wrapper.addClass('dragging');
      });

      $(document).on('mouseup', function () {
        isDown = false;
        wrapper.removeClass('dragging');
      });

      $(document).on('mousemove', function (e) {
        self.hasMoved = true;
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offset().left;
        const walk = (x - startX) * 1;
        wrapper.scrollLeft(scrollLeft - walk);
      });
    };

    $(document).ready(self.init);
  })(jQuery);
}
