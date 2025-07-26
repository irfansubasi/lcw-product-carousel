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

const generateCarousel = () => {
  (($) => {
    'use strict';

    const APPEND_LOCATION = '.product-detail';

    const classes = {
      style: 'carousel-style',
    };

    const selectors = {
      appendLocation: APPEND_LOCATION,
      style: `.${classes.style}`,
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
            <style class="${classes.style}"></style>
        `;
    };

    self.buildHTML = () => {
      const html = ``;
      $(selectors.appendLocation).after(html);
    };

    self.setEvents = () => {};

    $(document).ready(self.init);
  })(jQuery);
};
