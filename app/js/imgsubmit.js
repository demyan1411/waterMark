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
		var imgmain = "1.jpg",
			imgwmark = "w1.png",
			imgresult = "result.png",
			coordx = "-100",
			coordy = "-50",
			marginx = "40",
			marginy = "50",
			opacity = "0.65",
			mode = "tile",
			url = '../php/watermark.php';
		ev.preventDefault();
		$.ajax({
				url: url,
				type: "POST",
				data: {imgmain:imgmain,imgwmark:imgwmark,imgresult:imgresult,coordx:coordx,coordy:coordy,marginx:marginx,marginy:marginy,opacity:opacity,mode:mode},
				})
			.done (function(answer) {
				_imgDownload(imgresult);
				})
			.fail (function(answer) {
				console.log('fail');
			});

		return true;
	};

	var	_imgDownload = function(fname) {
		var href = '../php/imgsave.php?fname=' + fname;
		window.open(href, '_self');
	};

	return {
		init : init
	};

})();

picModule.init();