// /* imgsubmit.js
//    модуль устанавливает обработчик события на кнопку Скачать
//    и делает запрос с параметрами к watemark.php
//    после чего вызывает imgsave.php для сохранения картинки у юзера
// */
'use strict'

var picModule = (function() {
	// инициализация функций
	var init = function () {
		_setupListeners();
	};

	// прослушка событий
	var _setupListeners = function () {
		$('.settings__btn-download').on('click', _makePicture);
	};

	var _makePicture = function(ev) {
		ev.preventDefault();
		$.ajax({
				url: app.URL_WATERMARK_REQUEST,
				type: "POST",
				data: {
					imgmain:app.picture.url,
					imgwmark:app.watermark.url,
					imgresult:app.FILENAME_RESULT,
					coordx:app.watermark.coordx,
					coordy:app.watermark.coordy,
					marginx:app.watermark.marginx,
					marginy:app.watermark.marginy,
					opacity:app.watermark.opacity,
					mode:app.watermark.mode },
				})
			.done (function(answer) {
				// console.log(answer);
				_imgDownload(app.FILENAME_RESULT);
				})
			.fail (function(answer) {
				console.log('fail');
			});

		return true;
	};

// вызывает imgsave.php для сохранения картинки у юзера
	var	_imgDownload = function(fname) {
		var href = app.URL_IMGSAVE_REQUEST + '?fname=' + fname;
		window.open(href, '_self');
	};

	return {
		init : init
	};

})();

picModule.init();