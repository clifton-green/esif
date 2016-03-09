// This file should never make it to production and is for development only.
// Note: The file will automatically be excluded by the build

/* global $, console, JSONEditor */

var DevTools = DevTools || {};

DevTools = {
	init: function () {
		'use strict';
		this.currentPage = location.pathname.substring(1);
		this.currentJSON = '/model/' + this.currentPage.replace('html', 'json');
		this.injectDependencies();
		this.toggleDevTools();
	},

	injectDependencies: function () {
		'use strict';
		$('<link href="jsoneditor/dist/jsoneditor.min.css" rel="stylesheet" type="text/css">').appendTo('head');
		$('<script src="jsoneditor/dist/jsoneditor.min.js"></script>').appendTo('head');
	},

  toggleDevTools: function() {
    'use strict';
    var dtb = $('<span style="cursor:pointer;position:absolute;top:0;left:0;font-size:10px;background-color:dodgerBlue;opacity:.5;padding:1px 2px;color:white;display:inline-block;height:10px;width:10px;">*</span>').prependTo('body');
		this.devtools = $('<div class="devtools" style="position:absolute;left:0;top:0;padding:1rem;background:#fff;z-index:1000;"></div>').prependTo('body');
    dtb.on('click', this.devToolsBar.bind(this));
  },

  //Shows the devtools toolbar.
  devToolsBar: function () {
    'use strict';
  	$('<span style="cursor:pointer;color:#fff;display:inline-block;background:green;padding:.5rem;margin: 0 1rem;">Show Components</span>').appendTo(this.devtools).on('click', this.showComponents.bind(this));
		$('<span style="cursor:pointer;color:#fff;display:inline-block;background:blue;padding:.5rem;margin: 0 1rem;">Show JSON</span>').appendTo(this.devtools).on('click', this.editJSON.bind(this));
		$('<span style="cursor:pointer;color:#fff;display:inline-block;background:red;padding:.5rem;margin: 0 1rem;">Disable form validation</span>').appendTo(this.devtools).on('click', this.toggleValidation.bind(this));
		$('<span style="cursor:pointer;color:#fff;display:inline-block;background:orange;padding:.5rem;margin: 0 1rem;">Close DevTools</span>').appendTo(this.devtools).on('click',this.devToolsBar.bind(this));

  },

	toggleValidation: function () {
		'use strict';
		$('form').attr('novalidate', '')
	},
	// Outlines all components on a page and shows their classes.
	// Note: If there are more than 12 components on a page then additional colours need to be added.
	showComponents : function () {
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
	},

	editJSON: function () {
		'use strict';
			// create the editor
		 $('<div id="jsoneditor" style="position:absolute;top:10%;left:10%;width:80%; height: 80%;background:white;z-index:10000;"></div>').prependTo('body');
		 var c = this,
		 container = document.getElementById('jsoneditor'),
		 source = c.currentJSON !== '/model/' ? c.currentJSON : '/model/index.json',
		 options = {
			 mode: 'form',
			 modes: ['form', 'text'], // allowed modes
			 onError: function (err) {
				 alert(err.toString());
			 },
			 onModeChange: function (newMode, oldMode) {
				 console.log('Mode switched from', oldMode, 'to', newMode);
			 }
		 },
		 editor = new JSONEditor(container, options);


     // set json
    var json = (function () {
    	json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': source,
	        'dataType': 'json',
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
		})();
		editor.set(json);
   // get json
   json = editor.get();
	}
}

$(document).ready(function() {
  'use strict';
  DevTools.init();
});
