/* global $, console */

// Namespacing
var Forms = Forms || {};

Forms = {
	init: function () {
    'use strict';
    //find any forms on the page and cache them.
    this.form = $('form');
    this.form.on('click', '.radio-group input, .checkbox-group input', {class: 'selected'}, this.selectFocusClass);
    this.form.on('focus', '.radio-group input, .checkbox-group input', {class: 'focus'}, this.selectFocusClass);
    this.form.on('blur', '.radio-group input, .checkbox-group input', {class: 'blur'}, this.selectFocusClass);
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
  }
}

$(document).ready(function() {
  'use strict';
	Forms.init();
})
