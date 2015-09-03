/* app.js
   Модуль содержит общие константы, переменные и функции для всего приложения,
   доступные через глопальную переменную app

   Пример: чтобы узнать или изменить высоту вотермарка, пишем: app.watermark.height
*/

'use strict';

var app = {

    // константы
    UPLOAD_DIR : "uploads/",  // каталог для загрузки файлов (относительно основной директории)
    FILE_MAX_SIZE : 1000000,  // максимальный размер файла
    URL_UPLOAD_REQUEST : "php/upload.php",  // обработчик запроса на загрузку картинок
    URL_WATERMARK_REQUEST : "../php/watermark.php",  // обработчик наложения вотермарка
    URL_IMGSAVE_REQUEST : "../php/imgsave.php",  // обработчик скачивания результирующей картинки
    FILENAME_RESULT : "result.png",  // имя файла результирующей картинки
    CONTAINER : { 'width': 650,      // размеры основного контейнера
                  'height': 538
                },

    // название контейнера для вотермарка
    imgConteiner : '.main-img-container',
    flag : true,
    uiSliderVal : 80,


    // данные по изображениям (их ключи должны совпадать с их id в html)
    // основная картинка
    picture : { 'url': '',
                'filename': '', // имя файла основной картинки
                'width': 0,
                'height': 0,
                'container': {}  // контейнер, в размеры которого необходимо вписываться
              },

    // водяной знак
    watermark : { 'url': '',
                  'filename': '', // имя файла вотермарка
                  'width': 0,
                  'height': 0,
                  'coordx': 0, // смещение по оси X
                  'coordy': 0, // смещение по оси Y
                  'marginx': 0, // расстояние между тайлами по оси X
                  'marginy': 0, // расстояние между тайлами по оси Y
                  'opacity': 1, // прозрачность от 0 до 1
                  'mode': 'notile', // режим наложения: tile или любое другое
                  'container': {}
                }

};


// задаем родительские контейнеры, чтобы вписываться в их размеры
app.picture.container = app.CONTAINER;  // <- для основной картинки размеры контейнера будут браться из константы
app.watermark.container = app.picture;  // <- а это поможет сжимать вотермарк по размерам основной картинки

var containerWidth = app.picture.width,
    containerHeight = app.picture.height,

    elemWidth = app.watermark.width,
    elemHeight = app.watermark.height,

    elemRightPosition = containerWidth - elemWidth,
    elemBottomPosition = containerHeight - elemHeight,

    elemMiddlePositonWidth = (containerWidth / 2) - (elemWidth / 2),
    elemMiddlePositonHeight = (containerHeight / 2) - (elemHeight / 2);

var objPos = {};
