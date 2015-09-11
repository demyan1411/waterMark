/* upload.js
   модуль устанавливает обработчик событий на поля для выбора файла с изображением
   - поля должны иметь класс '.settings__input-hide'
   - поля должны иметь атрибут 'data-for' с указанием на элемент, для которого
     будет выбрано изображение (например, '#picture')
   - выбранный файл с помощью ajax-запроса передается php-обработчику upload.php
   - после ответа сервера у элемента с изображением изменяется src-атрибут
   - после ответа сервера у элемента с фэйковым инпутом меняется текст
   - в общие переменные записываются новые значения
   - выполняются проверки на соответствие размеров основной картинки и вотермарка
   - ошибки выводятся в консоль и в в виде уведомления на экран
*/

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
            data = new FormData();  // данные для запроса


        // запустить прелоадер на время загрузки файла
        preloader.start();

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
            var message = "Ошибка: сервер не ответил, попробуйте попозже";
            app.showMessage(message);
            console.log(message);
            preloader.stop();  // остановить работу прелоадера
        })
        .done( function(answer) {
            if (answer.status === 'OK') {
                // изменить url картинки для элемента, который указан в атрибуте 'data-img'
                //$('#'+imgID).attr("src", answer.url);

                // хак, который позволяет принудительно загрузить картинку, даже если она есть в кэше браузера
                // $('#'+imgID).attr("src", answer.url+'?' + new Date().getTime());

                // изменить текст фэйкового инпута на имя сохраненного файла
                $('#'+fakeinputID).text(answer.filename);

                // сохраняем данные картинки в общих переменных
                app[imgID].url = answer.url;
                app[imgID].filename = answer.filename;
                app[imgID].width = answer.width;
                app[imgID].height = answer.height;

                // эта проверка сейчас проходит в модуле preload.js в функции preloader.stop()
                // ----------------------------------------
                // если выбрали основную картинку, а инпут вотермарка заблокирован,
                // то разблокировать его
                // if (input.id === 'input-picture' && $('#input-watermark').prop('disabled')) {
                //     $('#input-watermark').removeAttr('disabled');
                //     console.log('Поле для ввода водяного знака разблокировано');
                // };
                // ----------------------------------------

                // если выбрали основную картинку с размерами меньше уже загруженного вотермарка,
                // то удаляем вотермарк, чтобы пользователь его тоже перевыбрал
                if (input.id === 'input-picture') {
                    if (app.picture.width < app.watermark.width || app.picture.height < app.watermark.height) {
                        $('#watermark').attr("src", '');
                        $('#input-watermark').val('');
                        //$('#fakeinput-watermark').text('Выберите файл');
                        var $fakeinput = $('#fakeinput-watermark');
                        $fakeinput.text( $fakeinput.data('lang')[app.LANGS[app.currentLang]] );
                        app.watermark.url = '';
                        app.watermark.width = 0;
                        app.watermark.height = 0;
                        var message = 'Водяной знак удален, т.к. его размеры превышают размеры основной картинки';
                        app.showMessage(message);
                        console.log(message);
                    };
                };

                $('#'+imgID).attr("src", '');
                startModulesAfterUpload(imgID);
                $('#'+imgID).attr("src", answer.url+'?' + new Date().getTime());

            } else {
                app.showMessage(answer.text); // показать пользователю сообщение об ошибке
            };

            console.log(answer.text);
            preloader.stop();  // остановить работу прелоадера
        });
    });

});
