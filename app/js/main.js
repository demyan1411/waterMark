$(document).ready(function() {

 	"use strict";

 	opacity.init;
 	// запуск плагина drag and coordinates
	inputs.init;
	$('.settings__input-hide').on('change', function(event) {
	 	$('#watermark').load(function() {
	        $('.radio_position').draga({
	            container: '.main-img',
	            arrows: true,
	            radio: true
	        });

	    });
	 });



}); // end ready
