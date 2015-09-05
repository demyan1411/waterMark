/* translate.js
   модуль устанавливает обработчик события на кнопки выбора языка
   и содержит функцию для изменения текста элементов с атрибутом 'data-lang'

   Пример:
   чтобы изменить язык на английский, набрать в консоли: translate.changeLang(1)
*/
'use strict';

var translate = (function() {

  var elemsWithLang = [],  // элементы страницы с атрибутом 'data-lang', у которых будем менять текст
      // buttonsLang = [];    // кнопки для выбора языка
      itemsLang = [];      // элементы меню со ссылкой для выбора языка

  // инициализация
  var init = function () {
    elemsWithLang = $('[data-lang]');
    //buttonsLang = $('.icons__language-link');
    itemsLang = $('.icons__language-item');
    _setupListeners();
  };

  // установка обработчиков событий
  var _setupListeners = function() {
    $('.icons__language-link').on('click', function(event) {
      event.preventDefault();

      var newLang = this.getAttribute('href');

      if (newLang !== app.currentLang) {
        // buttonsLang.removeClass('active');
        itemsLang.removeClass('active');
        $(this).parents('.icons__language-item').addClass('active');
        changeLang( app.LANGS[newLang] );
        app.currentLang = newLang;
      };
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
