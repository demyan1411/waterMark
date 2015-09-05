/* translate.js
   модуль устанавливает обработчик события на кнопки выбора языка
   и содержит функцию для изменения текста элементов с атрибутом 'data-lang'

   Пример:
   Чтобы изменить язык на английский, набрать в консоли: translate.changeLang(1)
*/
'use strict';

var translate = (function() {

  // элементы с атрибутом 'data-lang', у которых будем менять текст
  var elemsWithLang = [];

  // инициализация
  var init = function () {
    elemsWithLang = $('[data-lang]');
    _setupListeners();
  };

  // установка обработчиков событий
  var _setupListeners = function() {
    $('.icons__language-link').on('click', function(event) {
      event.preventDefault();
      changeLang(this.getAttribute("href"));
    });
  };

  // изменить текст элементов с атрибутом 'data-lang'
  var changeLang = function(numLang) {
    elemsWithLang.each(function() {
      var $this = $(this);
      $this.text( $this.data('lang')[numLang] );
    });
  };

  return {
    init : init,
    changeLang: changeLang
  };

})();

$(document).ready(function() {
  translate.init();
});
