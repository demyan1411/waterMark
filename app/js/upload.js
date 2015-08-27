var uploadModule = (function() {
	// инициализация функций
	var init = function () {
		// _setupListeners();
		_upLoad('#original-img');
		_upLoad('#water-mark');
	};


	// прослушка событий
	// var _setupListeners = function () {
	// 	$('input[type=file]').on('change', function(){
 //        var imgId = this.id;
 //        console.log(imgId);
 //        _upLoad(imgId);
 //    });
	// };


	var _upLoad = function (imgId) {
		var url = '../upload/index.php';
		$(imgId).fileupload({
				url: url,
				dataType: 'json',
				done: function (e, data) {
						$.each(data.result.files, function (index, file) {
								$('.generator__img-wrap').append('<img src="../upload/files/' + file.name + '" alt="" style="position: absolute; top: 98px; left:25px; overflow:hidden;">');
						});
				},
		});
	};



	return {
		init : init
	};

})();
