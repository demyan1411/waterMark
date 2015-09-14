/* socialsharing.js
*/
'use strict';

var sharingModule = (function() {

	// объявление переменных
	var
			host = window.location.hostname,
			title = document.title,
			text = document.getElementsByName('description')[0].getAttribute('content'),
			screenshot = location.protocol + '//' + host + "/img/watermark-screenshot1.jpg",
			shareWindowWidth = 626, // ширина окна шаринга
			shareWindowHeight = 436, // высота окна шаринга
			shareWindowLeft = screen.availWidth / 2 - shareWindowWidth / 2, // отступ слева
			shareWindowTop = screen.availHeight / 2 - shareWindowHeight / 2; // отступ сверху

	// инициализация функций
	var init = function () {
		_setupListeners();
	};

	// прослушка событий
	var _setupListeners = function(event) {
		$('.icons__share-link').on('click', _sharing);
	};

	// вызов соответствующего апи шаринга
	var _sharing = function(event) {
		event.preventDefault();

		if ($(this).attr("id") == 'tw') {_twitter(host, title)};
		if ($(this).attr("id") == 'vk') {_vk(host, title, screenshot, text)};
		if ($(this).attr("id") == 'fb') {_facebook(host, title, screenshot, text)};

	};


	var _vk = function(purl, ptitle, pimg, text) {
			var url  = 'http://vkontakte.ru/share.php?';
			url += 'url='          + encodeURIComponent(purl);
			url += '&title='       + encodeURIComponent(ptitle);
			url += '&description=' + encodeURIComponent(text);
			url += '&image='       + encodeURIComponent(pimg);
			url += '&noparse=true';
			_popup(url);
	};

	var _facebook = function(purl, ptitle, pimg, text) {
			var url  = 'http://www.facebook.com/sharer.php?s=100';
			url += '&p[title]='     + encodeURIComponent(ptitle);
			url += '&p[summary]='   + encodeURIComponent(text);
			url += '&p[url]='       + encodeURIComponent(purl);
			url += '&p[images][0]=' + encodeURIComponent(pimg);
			_popup(url);
	};

	var _twitter = function(purl, ptitle) {
			var url  = 'http://twitter.com/share?';
			url += 'text='      + encodeURIComponent(ptitle);
			url += '&url='      + encodeURIComponent(purl);
			url += '&counturl=' + encodeURIComponent(purl);
			_popup(url);
	};

	var _popup = function(url) {
		window.open(url,'','toolbar=no,status=no,width=' + shareWindowWidth + ',height=' + shareWindowHeight + 'left=' + shareWindowLeft + ', top=' + shareWindowTop);
	};

	return {
		init : init
	};

})();
