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

  // изменить текст элементов с классом ".text"
  var changeLang = function() {

    //event.preventDefault();

    $('.text').each(function() {
      var $this = $(this);
      $this.text($this.data('en'));
    });
  };

  return {
    init : init,
    changeLang: changeLang
  };

})();

translate.init();