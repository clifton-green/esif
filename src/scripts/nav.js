var $ = require('jquery'),
    Nav = Nav || {};

Nav = {
	init: function () {
    'use strict';
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

$(document).ready(function() {
  'use strict';
	Nav.init();
})
