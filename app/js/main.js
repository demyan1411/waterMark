$(document).ready(function() {

 	"use strict";

 	opacity.init;
 	// запуск плагина drag and coordinates
	$('.radio_position').draga({
		container: '.js-container',
	    arrows: true,
	    radio: true
	});

	
	//proportion.init;
	


}); // end ready

var proportion = (function() {
	var cont = $('.js-container'),
		contWidth,
		contHeight,


		mainImg,
		mainImgWidth,
		mainImgHeight;
 

 var start = function() {
      _setUpListeners();
    },
    _setUpListeners = function() {
    	$('.settings__input-hide').on('change', function() {

			contWidth = cont.width(),
			contHeight = cont.height(),


			mainImg = $('.img'),
			mainImgWidth = mainImg.width(),
			mainImgHeight = mainImg.height();

     		_calc();
     	});
    },
    _calc = function() {

      cont.css({
        'width': mainImgWidth,
        'height': mainImgHeight
      });

    }


  return {
        init: start()
  }

})();