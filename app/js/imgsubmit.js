'use strict'

var testModule = (function() {
	// инициализация функций
	var init = function () {
		_setupListeners();
	};

	// прослушка событий
	var _setupListeners = function () {
		$('#img-submit').on('click', _submitProject);
	};

	var _submitProject = function(ev) {
		var imgmain = "3.jpg",
			imgwmark = "w1.png",
			coordx = "-100",
			coordy = "-50",
			marginx = "40",
			marginy = "50",
			opacity = "0.65",
			mode = "tile",
			url = '../php/watermark.php';
			// data = info.serialize();
		ev.preventDefault();
		$.ajax({
				url: url,
				type: "POST",
				data: {imgmain:imgmain,imgwmark:imgwmark,coordx:coordx,coordy:coordy,marginx:marginx,marginy:marginy,opacity:opacity,mode:mode},
				})
			.done (function(answer) {
				console.log('ok');
				})
			.fail (function(answer) {
				console.log('fail');
			});

		return true;
	};

	var	_imgDownload = function(answer) {
		var href = '../php/imgsave.php';
		window.downloadFile = function(url) {
			window.open(url, '_self');
		}
		window.downloadFile(href);
	};

	return {
		init : init
	};

})();

testModule.init();