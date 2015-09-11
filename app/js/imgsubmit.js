/* imgsubmit.js
	 модуль устанавливает обработчик события на кнопку Скачать
	 и делает запрос с параметрами к watemark.php
	 после чего вызывает imgsave.php для сохранения картинки у юзера
*/
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

	// ajax запрос на обработчик картинок watermark
	var _makePicture = function(event) {
		event.preventDefault();

		if(app.watermark.mode === 'tile') {

			app.watermark.coordx = parseInt($('.containmentForWatermarks').css('left').slice(0, -2), 10) + parseInt($('.repeatBlock').css('left').slice(0, -2), 10);
			app.watermark.coordy = parseInt($('.containmentForWatermarks').css('top').slice(0, -2), 10) + parseInt($('.repeatBlock').css('top').slice(0, -2), 10);

			console.log('coordx: ' + app.watermark.coordx);
			console.log('coordy: ' + app.watermark.coordy);

			app.watermark.marginx = parseInt($('.posX').val(), 10);
			app.watermark.marginy = parseInt($('.posY').val(), 10);
		} else {
			app.watermark.coordx = parseInt($('.posX').val(), 10);
			app.watermark.coordy = parseInt($('.posY').val(), 10);
		}

		// запустить прелоадер на время обработки файла
		preloader.start();

		$.ajax({
				url: app.URL_WATERMARK_REQUEST,
				type: "POST",
				data: {
					imgmain:app.picture.filename,
					imgwmark:app.watermark.filename,
					uploaddir: app.UPLOAD_DIR,
					coordx:app.watermark.coordx,
					coordy:app.watermark.coordy,
					marginx:app.watermark.marginx,
					marginy:app.watermark.marginy,
					opacity:app.watermark.opacity,
					mode:app.watermark.mode },
				})
			.done (function(answer) {
				console.log(answer);
				preloader.stop();  // остановить работу прелоадера
				_imgDownload(encodeURIComponent(answer));
				})
			.fail (function(answer) {
				console.log('fail');
				preloader.stop();  // остановить работу прелоадера
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
