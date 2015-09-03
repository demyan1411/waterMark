// /* upload.js
//    модуль устанавливает обработчик событий на поля для выбора файла с изображением
//    - поля должны иметь класс '.settings__input-hide'
//    - поля должны иметь атрибут 'data-for' с указанием на элемент, для которого
//      будет выбрано изображение (например, '#picture')
//    - выбранный файл с помощью ajax-запроса передается php-обработчику upload.php
//    - после ответа сервера у элемента с изображением изменяется src-атрибут
//    - после ответа сервера у элемента с фэйковым инпутом меняется текст
//    - в общие переменные записываются новые значения
//    - выполняются проверки на соответствие размеров основной картинки и вотермарка
//    - ошибки выводятся в консоль
// */

'use strict';

$(document).ready(function() {

    // установить обработчик событий на кнопки загрузки файлов
    $('.settings__input-hide').on('change', function(event) {
        event.preventDefault();

        if (!this.files[0]) {
            console.log("Не выбран файл для загрузки");
            return;
        };

        var
            input = this,    // текущий инпут
            imgID = this.dataset['img'],  // id изображения, соответствующего инпуту
            fakeinputID = this.dataset['fakeinput'], // id фэйкового инпута, соответствующего текщему
            btn = $(this),   // нажатая кнопка для выбора файла
            data = new FormData();  // данные для запроса

        // заблокировать кнопку на время загрузки файла
        btn.attr('disabled', 'disabled');

        // сформировать данные для запроса
        data.append(0, this.files[0]);
        data.append('uploadDir', app.UPLOAD_DIR);
        data.append('maxSize', app.FILE_MAX_SIZE);
        data.append('maxWidth', app[imgID].container.width);
        data.append('maxHeight', app[imgID].container.height);

        // выполнить ajax-запрос
        $.ajax({
            url: app.URL_UPLOAD_REQUEST,
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
                $('#'+imgID).attr("src", answer.url);

                // изменить текст фэйкового инпута на имя сохраненного файла
                $('#'+fakeinputID).text(answer.filename);

                // сохраняем данные картинки в общих переменных
                app[imgID].url = answer.url;
                app[imgID].width = answer.width;
                app[imgID].height = answer.height;

                // если выбрали основную картинку, а инпут вотермарка заблокирован,
                // то разблокировать его
                if (input.id === 'input-picture' && $('#input-watermark').prop('disabled')) {
                    $('#input-watermark').removeAttr('disabled');
                    console.log('Поле для ввода водяного знака разблокировано');
                };

                // если выбрали основную картинку с размерами меньше уже загруженного вотермарка,
                // то удаляем вотермарк, чтобы пользователь его тоже перевыбрал
                if (input.id === 'input-picture') {
                    if (app.picture.width < app.watermark.width || app.picture.height < app.watermark.height) {
                        $('#watermark').attr("src", '');
                        $('#input-watermark').val('');
                        $('#fakeinput-watermark').text('Выберите файл');
                        app.watermark.url = '';
                        app.watermark.width = 0;
                        app.watermark.height = 0;
                        console.log('Водяной знак удален, т.к. его размеры превышают размеры основной картинки');
                    };
                };

                // вызов функций, необходимых для дополнительных действий после выбора изображения
                $('.radio_position').draga({
                    container: '.main-img-container',
                    containerWidth: answer.width,
                    containerHeight: answer.height,
                    inputPush: '#'+imgID
                });
            };
            btn.removeAttr('disabled'); // разблокировать кнопку
        });
    });

});




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

/*
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
*/
