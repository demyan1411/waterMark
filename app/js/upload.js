var uploadModule = (function() {
	// инициализация функций
	var init = function () {
		// _setupListeners();
		_upLoad();
	};


	// прослушка событий
	var _setupListeners = function () {
		// $('#original-img').on('change', _whatFiles);
	};


	var _upLoad = function () {
		var url = '../upload/index.php';
		$('#original-img').fileupload({
				url: url,
				dataType: 'json',
				done: function (e, data) {
						$.each(data.result.files, function (index, file) {
								$('.generator__img-wrap').html('<img src="../upload/files/' + file.name + '" alt="">');
						});
				},
		});
	};



	return {
		init : init
	};

})();
