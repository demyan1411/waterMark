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


function startModulesAfterUpload() {
	containerWidth = app.picture.width;
    containerHeight = app.picture.height;

    elemWidth = app.watermark.width;
    elemHeight = app.watermark.height;

    elemRightPosition = containerWidth - elemWidth;
    elemBottomPosition = containerHeight - elemHeight;

    elemMiddlePositonWidth = (containerWidth / 2) - (elemWidth / 2);
    elemMiddlePositonHeight = (containerHeight / 2) - (elemHeight / 2);

    objPos = {
    	'top-left': {
    		'left': 0,
    		'top': 0
    	},
    	'top-middle': {
    		'left': elemMiddlePositonWidth,
    		'top': 0
    	},
    	'top-right': {
    		'left': elemRightPosition,
    		'top': 0
    	},
    	'middle-left': {
    		'left': 0,
    		'top': elemMiddlePositonHeight
    	},
    	'middle-middle': {
    		'left': elemMiddlePositonWidth,
    		'top': elemMiddlePositonHeight
    	},
    	'middle-right': {
    		'left': elemRightPosition,
    		'top': elemMiddlePositonHeight
    	},
    	'bottom-left': {
    		'left': 0,
    		'top': elemBottomPosition
    	},
    	'bottom-middle': {
    		'left': elemMiddlePositonWidth,
    		'top': elemBottomPosition
    	},
    	'bottom-right': {
    		'left': elemRightPosition,
    		'top': elemBottomPosition
    	}
    };



    // вызов функций, необходимых для дополнительных действий после выбора изображения
    $('.radio_position').draga({
        container: app.imgConteiner,
        inputPush: '#' + imgID
    });


    multiplyElem.init();
    opacity.init();

    if($('#watermark').hasClass('buttons')) {
  		drag.init();
  	}
}