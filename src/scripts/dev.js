// This file should never make it to production and is for development only.
// Note: The file will automatically be excluded by the build

/* global $, console, JSONEditor */

var DevTools = DevTools || {};

DevTools = {
	init: function () {
		'use strict';
		this.devtools = $('<div class="devtools"></div>').prependTo('body');
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
    var dtb = $('<span class="devButton">*</span>').prependTo('body');
		$('<span class="show-components">Show Components</span>').appendTo(this.devtools).on('click', { mode: 'add'}, this.showComponents.bind(this));
		$('<span class="show-json">Show JSON</span>').appendTo(this.devtools).on('click', { mode: 'add'}, this.editJSON.bind(this));
		$('<span class="form-validation">Disable form validation</span>').appendTo(this.devtools).on('click', this.toggleValidation.bind(this));
		$('<span class="close">X</span>').appendTo(this.devtools).on('click',this.devToolsBar.bind(this));
    dtb.on('click', this.devToolsBar.bind(this));
  },

  //Shows the devtools toolbar.
  devToolsBar: function () {
    'use strict';
		if(this.devtools.hasClass('visible')) {
			this.devtools.removeClass('visible');
		} else {
			this.devtools.addClass('visible');
		}
  },

	toggleValidation: function () {
		'use strict';
		$('form').attr('novalidate', '')
	},
	// Outlines all components on a page and shows their classes.
	// Note: If there are more than 12 components on a page then additional colours need to be added.
	showComponents : function (event) {
		'use strict';
    var colours = ['red', 'blue', 'orange', 'brown', 'pink', 'green', 'purple', 'deepPink', 'dodgerBlue', 'yellow', 'greenYellow', 'aqua' ];
		if(event.data.mode === 'add') {
			$('.show-components').html('Hide Components').off().on('click', { mode: 'remove'}, this.showComponents.bind(this));
		} else {
			$('.show-components').html('Show Components').off().on('click', { mode: 'add'}, this.showComponents.bind(this));
		}
    $('[class^="c-"]').each(function(i) {
			if(event.data.mode === 'add') {
				$(this).css({
	        position : 'relative',
	        border : '2px solid',
	        borderColor : colours[i]
	      });
	      var className = $(this).attr('class');
	      $('<div class="component-tag" style="position:absolute;top:0;right:0;padding:5px;color:white;background-color:'+colours[i]+';display:inline-block;">'+className+'</div>"').prependTo($(this));
			} else {
				$(this).css({
					border: 0
				})
				$(this).find('.component-tag').remove();
			}
    });
	},

	editJSON: function (event) {
		'use strict';
			// create the editor
			var el = $('<div id="jsoneditor" style="position:absolute;top:10%;left:10%;width:80%; height: 80%;background:white;z-index:10000;"></div>');
			if (event.data.mode === 'add') {
				el.prependTo('body');
				var c = this,
						container = document.getElementById('jsoneditor');
				var source = c.currentJSON !== '/model/' ? c.currentJSON : '/model/index.json',
				options = {
					mode: 'form',
					modes: ['form', 'text'], // allowed modes
					onError: function (err) {
						alert(err.toString());
					},
					onModeChange: function (newMode, oldMode) {
						console.log('Mode switched from', oldMode, 'to', newMode);
					}
				}
				$('.show-json').html('Hide JSON').off().on('click', { mode: 'remove'}, this.editJSON.bind(this));
				var editor = new JSONEditor(container, options);
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
			} else {
				$('.show-json').html('Show JSON').off().on('click', { mode: 'add'}, this.editJSON.bind(this));
				$('#jsoneditor').remove();
			}
	}
}

// cookie getter and setter
function createCookie(name, value, days) {
	'use strict'
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  } else {
      expires = '';
  }
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function readCookie(name) {
	'use strict'
  var nameEQ = encodeURIComponent(name) + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
      if (c.indexOf(nameEQ) === 0) {
				return decodeURIComponent(c.substring(nameEQ.length, c.length));
			}
  }
  return null;
}

function eraseCookie(name) {
	'use strict'
  createCookie(name, '', -1);
}

$(document).ready(function() {
  'use strict';
  DevTools.init();
});
