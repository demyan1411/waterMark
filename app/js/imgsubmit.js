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
			app.watermark.coordx = parseInt($('.repeatBlock').css('left').slice(0, -2), 10);
			app.watermark.coordy = parseInt($('.repeatBlock').css('top').slice(0, -2), 10);
		} else {
			app.watermark.coordx = $('.posX').val();
			app.watermark.coordy = $('.posY').val();
		}

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
				_imgDownload(encodeURIComponent(answer));
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
