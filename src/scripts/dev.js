// This file should never make it to production and is for development only.
// Note: The file will automatically be excluded by the build

/* global $, console */

var DevTools = DevTools || {};

DevTools = {
	init: function () {
		'use strict';
		this.toggleDevTools();
	},

  toggleDevTools: function() {
    'use strict';
    var dtb = $('<span style="cursor:pointer;position:absolute;top:0;left:0;font-size:10px;background-color:dodgerBlue;opacity:.5;padding:1px 2px;color:white;display:inline-block;height:10px;width:10px;">*</span>').prependTo('body');
    dtb.on('click', this.showComponents.bind(this));
  },

  showComponents: function() {
    'use strict';
    var colours = ['red', 'blue', 'orange', 'brown', 'pink', 'green', 'purple', 'deepPink', 'dodgerBlue', 'yellow', 'greenYellow', 'aqua' ];
    $('[class^="c-"]').each(function(i) {
      $(this).css({
        position : 'relative',
        border : '2px solid',
        borderColor : colours[i]
      });
      var className = $(this).attr('class');
      $('<div style="position:absolute;top:0;right:0;padding:5px;color:white;background-color:'+colours[i]+';display:inline-block;">'+className+'</div>"').prependTo($(this));
    });

  }
}

$(document).ready(function() {
  'use strict';
  DevTools.init();
});
