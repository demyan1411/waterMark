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

$(function () {

    // установить обработчик событий на кнопки загрузки файлов
    $('.settings__input-hide').on('change', function(event) {
        event.preventDefault();

        if (!this.files[0]) {
            console.log("Не выбран файл для загрузки");
            return;
        };

        var
            btn = $(this),          // нажатая кнопка для выбора файла
            url = "php/upload.php", // обработчик запроса
            data = new FormData();  // данные для запроса

        // заблокировать кнопку на время загрузки файла
        btn.attr('disabled', 'disabled');

        // добавить файл в FormData
        data.append(0, this.files[0]);

        // добавить информацию из дата-атрибутов, для каких элементов изменить значения после сохранения файла
        data.append('dataimg', this.dataset['img']);
        data.append('datafakeinput', this.dataset['fakeinput']);

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
        .done( function(answer) {
            console.log(answer.text);
            if (answer.status === 'OK') {
                // изменить url картинки для элемента, который указан в атрибуте 'data-img'
                // размеры картинки: answer.width, answer.height


                // добавляем картинки в контейнер .main-img-container
                $('.main-img-container').append('<img id="' + answer.dataimg.substr(1) +'">');

                // добавляем картинкам путь
                $(answer.dataimg).attr("src", answer.url);

                // при загрузке основной картинки задаём контейнеру ширину и высоту
                $('#picture').on('load', function() {

                  $(this).addClass('main-img');

                  $('.main-img-container').css({
                      'width': answer.width,
                      'height': answer.height
                  });

                  // при уже загруженном вотермарке и новой загрузке либо вотермарка, либо оновной картинки запускаем плагин (это нужно чтобы плагины пересчитал размеры)
                  if($('#watermark').hasClass('radio_position')) {
                    startDraga(true);
                  };

                });

                // при первой загрузке вотермарка запускам плагин с активными радио кнопками
                $('#watermark').on('load', function() {
                  $(this).addClass('opacity_block')
                         .addClass('draggable')
                         .addClass('radio_position');
                  startDraga(true);
                });

                // изменить текст фэйкового инпута на имя сохраненного файла
                $(answer.datafakeinput).text(answer.filename);
            };
            btn.removeAttr('disabled'); // разблокировать кнопку
        });
    });



});




/////////////////////////////////////////////////////////////
//////// Необходимо весь upload привести к такому виду
//////// это позволяет провести проверку на загрузку картинки
//////////////////////////////////////////////////////////////

$.postForm = function(thisInput, onSuccess) {

    var data = new FormData();

      data.append(0, thisInput.files[0]);


      data.append('dataimg', thisInput.dataset['img']);
      data.append('datafakeinput', thisInput.dataset['fakeinput']);

    var onAjaxSuccess = onSuccess || $.noop;
    var url = "php/upload.php";
    return $.ajax({
        url: url,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false
    })
    .done( onSuccess );

};


////////////////////////////////////////////////////////
//////// ПРОВЕРКА на загрузку картинки!!!!!
//////// плюс извлечение данных в тот момент когда это надо!!!!!
//////////////////////////////////////////////////////

$('.settings__input-hide').on('change', function(event) {
  event.preventDefault();
  $.postForm(this, function(answer) {
    console.log(answer.width);
  });

});


