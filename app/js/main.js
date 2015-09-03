$(document).ready(function() {

	"use strict";

	opacity.init();
	// запуск плагина drag and coordinates
	addInputs.init();

	addArrows.init();

	

	//startDraga(false);
	$('form').on('submit', function(e) {
		e.preventDefault();
	});



}); // end ready
