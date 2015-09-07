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

    URL_UPLOAD_REQUEST : "php/upload.php",        // обработчик запроса на загрузку картинок
    URL_WATERMARK_REQUEST : "php/watermark.php",  // обработчик наложения вотермарка
    URL_IMGSAVE_REQUEST : "php/imgsave.php",      // обработчик скачивания результирующей картинки
    FILENAME_RESULT : "result.png",               // имя файла результирующей картинки
    CONTAINER : { 'width': 650, 'height': 538 },  // размеры основного контейнера
    LANGS : { 'ru': 0, 'en': 1 },                 // нумерация языков интерфейса

    // классы элементов, которые нужно блокировать на время работы прелоадера
    CLASSES_BLOCKING_AT_PRELOADER : '.settings__input-hide, .settings__btn-download, .settings__btn-reset',

    // название контейнера для вотермарка
    imgConteiner : '.main-img-container',
    flag : true,
    uiSliderVal : 80,

    currentLang : 'ru',  // текущий язык интерфейса страницы

    // данные по изображениям (их ключи должны совпадать с их id в html)
    // основная картинка
    picture : { 'url': '',
                'filename': '',
                'width': 0,
                'height': 0,
                'container': {}  // контейнер, в размеры которого необходимо вписываться
              },

    // водяной знак
    watermark : { 'url': '',
                  'filename': '',
                  'width': 0,
                  'height': 0,
                  'coordx': 0, // смещение по оси X
                  'coordy': 0, // смещение по оси Y
                  'marginx': 0, // расстояние между тайлами по оси X
                  'marginy': 0, // расстояние между тайлами по оси Y
                  'opacity': 1, // прозрачность от 0 до 1
                  'mode': 'notile', // режим наложения: tile или любое другое
                  'container': {}
                },
    objPos: {}
};


// задаем родительские контейнеры, чтобы вписываться в их размеры
app.picture.container = app.CONTAINER;  // <- для основной картинки размеры контейнера будут браться из константы
app.watermark.container = app.picture;  // <- а это поможет сжимать вотермарк по размерам основной картинки
