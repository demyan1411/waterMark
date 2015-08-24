 $(document).ready(function() {

 	"use strict";

	$('input, textarea').each(function() {
 		var $this = $(this),
 			inputPlaceholder = $this.attr('placeholder');
 		if(inputPlaceholder) {
 			$this.parent('.label').append('<div class="placeholder">' + inputPlaceholder + '</div>');
 		}
 	});

	$('.label')
		.focusin(function() {
			$(this).find('.placeholder').hide();
		})
		.focusout(function() {
			if($(this).find('input, textarea').val() === '') {
				$(this).find('.placeholder').show();
			} return false
		});

});