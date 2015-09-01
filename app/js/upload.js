/* upload.js
   модуль устанавливает обработчик событий на поля для выбора файла с изображением
   - поля должны иметь класс '.settings__input-hide'
   - поля должны иметь атрибут 'data-for' с указанием на элемент, для которого
     будет выбрано изображение (например, '#picture')
   - выбранный файл с помощью ajax-запроса передается php-обработчику upload.php
   - после ответа сервера у элемента с изображением изменяется src-атрибут
   - после ответа сервера у элемента с фэйковым инпутом меняется текст
   - ошибки выводятся в консоль
*/

'use strict';


////////////////////////////////////////////////////////////////////
/////привёл к виду $.postForm(thisInput, onSuccess)/////////////////
///// onSuccess - функция которая выеполняется в .done(...)
/////////////////////////////////////////////////////////////////////

var btn;


// установить обработчик событий на кнопки загрузки файлов
$('.settings__input-hide').on('change', function(event) {
    event.preventDefault();

    var input = $(this);

    $.postForm(this, function(answer) {
        console.log(answer.text);
        if (answer.status === 'OK') {
            // изменить url картинки для элемента, который указан в атрибуте 'data-img'
            // размеры картинки: answer.width, answer.height

            // добавляем картинкам путь
            $(answer.dataimg).attr("src", answer.url);

            // изменить текст фэйкового инпута на имя сохраненного файла
            $(answer.datafakeinput).text(answer.filename);


            $('.radio_position').draga({
    					container: '.main-img-container',
    					containerWidth: answer.width,
    					containerHeight: answer.height,
              inputPush: input.data('img')
    			  });

        };
        btn.removeAttribute('disabled'); // разблокировать кнопку
    });

});



$.postForm = function(thisInput, onSuccess) {

  if (!thisInput.files[0]) {
      console.log("Не выбран файл для загрузки");
      return;
  };

  btn = thisInput; // нажатая кнопка для выбора файла

  var
      url = "php/upload.php", // обработчик запроса
      data = new FormData();  // данные для запроса

  // заблокировать кнопку на время загрузки файла
  btn.setAttribute('disabled', 'disabled');

  // добавить файл в FormData
  data.append(0, thisInput.files[0]);

  // добавить информацию из дата-атрибутов, для каких элементов изменить значения после сохранения файла
  data.append('dataimg', thisInput.dataset['img']);
  data.append('datafakeinput', thisInput.dataset['fakeinput']);

  // выполнить ajax-запрос
  $.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: data,
      processData: false, // не обрабатывать файлы
      contentType: false  // установить в false, т.к. jQuery отправит серверу query string request
  })
  .fail( function(answer) {
      console.log('Ошибка: сервер не ответил, попробуйте попозже');
      btn.removeAttr('disabled'); // разблокировать кнопку
  })
  .done( onSuccess );
};


////////////////////////////////////////////////////////
//////// ПРОВЕРКА на загрузку картинки!!!!!
//////// плюс извлечение данных в тот момент когда это надо!!!!!
//////////////////////////////////////////////////////

// $('.settings__input-hide').on('change', function(event) {
//   event.preventDefault();
//   $.postForm(this, function(answer) {
//     console.log(answer.width);
//   });
//
// });
