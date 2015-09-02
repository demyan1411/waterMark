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
    $('.settings__input-hide').change(function(event) {
        event.preventDefault();

        if (!this.files[0]) {
            console.log("Не выбран файл для загрузки");
            return;
        };

        var
            btn = $(this),   // нажатая кнопка для выбора файла
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
            $(answer.dataimg).attr("src", answer.url);
            // изменить текст фэйкового инпута на имя сохраненного файла
            $(answer.datafakeinput).text(answer.filename);

            $('.radio_position').draga({
   				container: '.main-img-container',
   				containerWidth: answer.width,
   				containerHeight: answer.height,
                inputPush: btn.data('img')
     	   });
         opacity.init();

        };
        btn.removeAttr('disabled'); // разблокировать кнопку
    });

    });

});
