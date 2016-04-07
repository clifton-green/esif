var $ = require('jquery'),
    Nav = Nav || {};
    
Nav = {
	init: function () {
    'use strict';

    // enables js related CSS
    $('html').removeClass('no-js').addClass('js');

    // Event activators
    $('body').on('click', '.js-nav-toggle', this.navToggle.bind(this))
	},
  navToggle: function (el) {
    'use strict';
    var elparent = $(el.currentTarget).parent();
    if(elparent.hasClass('open')) {
      elparent.removeClass('open');
    } else {
      elparent.addClass('open');
    }
  }
}
