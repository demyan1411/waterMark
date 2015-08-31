$(document).ready(function() {

 	"use strict";

 	opacity.init;
 	// запуск плагина drag and coordinates
	inputs.init;

  startDraga(false, false);


}); // end ready

function startDraga(startRadioButtons, startSizeOn) {
  $('.radio_position').draga({
      container: '.main-img-container',
      arrows: true,
      startRadio: startRadioButtons,
      startSize: startSizeOn

  });
}
