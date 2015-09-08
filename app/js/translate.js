/* translate.js
   модуль устанавливает обработчик события на кнопки выбора языка
   и содержит функцию для изменения текста элементов с атрибутом 'data-lang'
   - текущий язык запоминается и извлекается из cookies

   Пример:
   чтобы изменить язык на английский, набрать в консоли: translate.changeLang('en')
*/
'use strict';

var translate = (function() {

  var elemsWithLang = [],  // элементы страницы с атрибутом 'data-lang', у которых будем менять текст
      itemsLang = [];      // элементы меню со ссылкой для выбора языка

  // инициализация
  var init = function () {
    elemsWithLang = $('[data-lang]');
    itemsLang = $('.icons__language-item');
    _setupListeners();
    changeLang(getCookie('lang'));  // проверить кукис и если они установлены, то переключить язык
  };

  // установка обработчиков событий
  var _setupListeners = function() {
    $('.icons__language-link').on('click', function(event) {
      event.preventDefault();
      changeLang(this.getAttribute('href'));
    });
  };

  // изменить текст элементов с атрибутом 'data-lang'
  // var changeLang = function(numLang) {
  //   elemsWithLang.each(function() {
  //     var $this = $(this);
  //     // для простых элементов достаточно просто изменить текст
  //     // $this.text( $this.data('lang')[numLang] );

  //     // из-за фэйковых инпутов приходится делать проверку, что в них нет имени файла
  //     var arrTexts = $this.data('lang');
  //     if ($.inArray($this.text(), arrTexts) != -1) {
  //       $this.text( arrTexts[numLang] );
  //     };
  //   });
  // };

  // изменить текущий язык интерфейса
  var changeLang = function(newLang) {
    if (newLang && newLang !== app.currentLang) {

      // изменить классы
      itemsLang.removeClass('active');
      $('#'+newLang).addClass('active');

      // изменить текст элементов с атрибутом 'data-lang'
      elemsWithLang.each(function() {
        var $this = $(this);
        // для простых элементов достаточно просто изменить текст
        // $this.text( $this.data('lang')[app.LANGS[newLang]] );

        // из-за фэйковых инпутов приходится делать проверку, что в них нет имени файла
        var arrTexts = $this.data('lang');
        if ($.inArray($this.text(), arrTexts) != -1) {
          $this.text( arrTexts[app.LANGS[newLang]] );
        };
      });

      // изменить текущий язык
      app.currentLang = newLang;

      // установить кукис на 30 дней
      setCookie('lang', newLang, { expires: 30, path: '' });
    };
  };

  // функции для работы с куками (https://learn.javascript.ru/cookie)
  // ----------------------------------------------------------------
  // возвращает cookie с именем name, если есть, если нет, то undefined
  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  // устанавливает cookie c именем name и значением value
  // options - объект с свойствами cookie (expires, path, domain, secure)
  function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 24*60*60*1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }

    document.cookie = updatedCookie;
    //console.log(updatedCookie);
  };


  return {
    init : init,
    changeLang: changeLang
  };

})();

$(document).ready(function() {
  translate.init();
});
