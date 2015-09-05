/* translate.js
   модуль устанавливает обработчик события на кнопки выбора языка
   и содержит функцию для изменения текста элементов с классом ".text"
*/
'use strict';

var translate = (function() {

  // инициализация
  var init = function () {
    _setupListeners();
  };

  // установка обработчиков событий
  var _setupListeners = function() {
    //$('.settings__btn-download').on('click', _makePicture);
  };

  // изменить текст элементов с атрибутом 'lang'
  var changeLang = function() {

    //event.preventDefault();

    $('[data-lang]').each(function() {
      var $this = $(this);
      $this.text( $this.data('lang')[1] );
    });
  };

  return {
    init : init,
    changeLang: changeLang
  };

})();

translate.init();