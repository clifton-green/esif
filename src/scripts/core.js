/* global $, console */

// Namespacing
var Core = Core || {};

Core = {
	init: function () {
    'use strict';

    // enables js related CSS
    $('html').removeClass('no-js').addClass('js');

    // Event activators
    $('body').on('click', '.js-big-target', this.bigTarget.bind(this))
    $('body').on('click', '.js-nav-toggle', this.navToggle.bind(this))
	},

  /**
   * [bigTarget description]
   * @method bigTarget
   * @param  el The click event
   * @return redirects to href attribute of last link found in the current target of the event
   */
  bigTarget : function (el) {
    'use strict';
    var link = $(el.currentTarget).find('a:last-of-type').attr('href');
    return window.location = link;
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
	Core.init();
})
