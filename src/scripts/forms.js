/* global $, console */

// Namespacing
var Forms = Forms || {};

Forms = {
	init: function () {
    'use strict';
    //find any forms on the page and cache them.
    this.form = $('form');
		// Add event listeners
		this.form.on('click', '.radio-group input, .checkbox-group input', {class: 'selected'}, this.selectFocusClass);
    this.form.on('focus', '.radio-group input, .checkbox-group input', {class: 'focus'}, this.selectFocusClass);
    this.form.on('blur', '.radio-group input, .checkbox-group input', {class: 'blur'}, this.selectFocusClass);

		// start onload events
		var conditionalClasses = '.prev-yes, .prev-no';
		if(this.form.find(conditionalClasses).length) {
			this.toggleHidden(conditionalClasses);
		}
	},

  selectFocusClass : function (event) {
    'use strict';
    var el = $(event.currentTarget),
        getClass = event.data.class;

    if(getClass === 'blur') {
      el.parent().removeClass('focus')
    } else {
      el.parent().siblings().removeClass(getClass);
      el.parent().addClass(getClass)
    }
  },
	toggleHidden : function (classes) {
		'use strict';
		var el = this.form.find(classes),
				getClass = el.attr('class'),
				type = getClass.replace('prev-', ''),
				getValue = function (prevInput) {
					if(prevInput.attr('type') === 'radio') {
						var groupName = prevInput.attr('name');
						return prevInput.parent().find('input[name="'+groupName+'"]:checked').val()
					} else {
						return prevInput.val();
					}
				};
		for (var i = 0; i < el.length; i++) {
			var thisel = $(el[i]),
					prevInput = thisel.parent().prev().find('input, textarea');
			thisel.parent().hide();
			prevInput.change(function() {
				if(getValue(prevInput) === type) {
					thisel.parent().slideDown();
				} else {
					thisel.parent().slideUp();
				}
			})

		}
	},
}

$(document).ready(function() {
  'use strict';
	Forms.init();
})
