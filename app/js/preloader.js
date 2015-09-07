/* preloader.js
   модуль содержит функции для работы прелодера на странице на время ожидания
   ответа от сервера
   - создает элемент с картинкой во время инициализации модуля
   - по команде start блокирует активные элементы и показывает картинку
   - по команде stop скрывает картинку и разблокирует элементы

   Пример:
   для запуска прелоадера вызвать функцию: preloader.start()
*/

'use strict';

var preloader = (function (){

  var imgPreloader = {},   // элемент c картинкой прелоадера
      elemsForBlock = [];  // элементы, которые будут блокироваться на время работы прелоадера

  var init = function() {
      _createPreloader();
      elemsForBlock = $(app.CLASSES_BLOCKING_AT_PRELOADER);
  };


  // создание нового элемента с картинкой прелоада
  var _createPreloader = function() {
      imgPreloader = $('<img id="preloader" src="img/loader.gif"/>').appendTo('.generator__img-wrap');
      imgPreloader.css({ 'display': 'none',
                         'position': 'absolute',
                         'top': '50%',
                         'left': '50%',
                         '-webkit-transform': 'translate(-50%, -50%)',
                         'transform': 'translate(-50%, -50%)'
                       });
  };

  // блокировать активные элементы и показать картинку прелоадера
  var start = function() {
      elemsForBlock.attr('disabled', 'disabled');
      imgPreloader.css({ 'display': 'block' });
  };

  // скрыть картинку и разблокировать элементы
  var stop = function() {
      imgPreloader.css({ 'display': 'none' });
      elemsForBlock.removeAttr('disabled');

      // дополнительные проверки
      // если основная картинка не выбрана, то инпут вотермарка должен быть заблокирован
      if (!app.picture.url) {
        $('#input-watermark').attr('disabled', 'disabled');
      };
  };

  return {
    init: init,
    start: start,
    stop: stop
  };

})();

$(document).ready(function() {
  preloader.init();
});
