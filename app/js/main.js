$(document).ready(function() {

	"use strict";

	opacity.init();
	// запуск плагина drag and coordinates
	addInputs.init();

	addArrows.init();

	picModule.init();

	//resetAll.init();

	//startDraga(false);
	$('form').on('submit', function(e) {
		e.preventDefault();
	});

    // инициализация плагина для сообщений об ошибках
    Toast.init();

}); // end ready


function startModulesAfterUpload(imgID) {


    var elemRightPosition = app.picture.width - app.watermark.width,
    		elemBottomPosition = app.picture.height - app.watermark.height,

		    elemMiddlePositonWidth = (app.picture.width / 2) - (app.watermark.width / 2),
		    elemMiddlePositonHeight = (app.picture.height / 2) - (app.watermark.height / 2);

    app.objPos = {
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


		if($('#watermark').hasClass('buttons')) {
			$('.settings__btn-reset, .settings__btn-download').addClass('js-form__btn');
    	multiplyElem.init();
    	opacity.init();
			drag.init();



			$('.ui-slider-handle').css({
				'cursor': 'pointer'
			});

		};

}
