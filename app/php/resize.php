<?
/* resize.php
   модуль содержит функцию resize для пропорционального ресайзинга изображения
   по заданным максимальным размерам
*/

// работаем с библиотекой для обработки изображений
use PHPImageWorkshop\ImageWorkshop;
require_once('PHPImageWorkshop/ImageWorkshop.php');

function resize($filename, $maxWidth, $maxHeight) {
    // функция проверяет размеры изображения и если они превышают заданные,
    // то пропорционально уменьшает картинку и перезаписывает файл
    // возвращает: размеры картинки или false, если произошла ошибка

    $layer = ImageWorkshop::initFromPath($filename, true);
    $width = $layer->getWidth();
    $height = $layer->getHeight();

    if ($width > $maxWidth  || $height > $maxHeight) {
      try {
        $layer->resizeToFit($maxWidth, $maxHeight, true);
        $layer->save('./', $filename);
        // получить изменившиеся размеры
        $width = $layer->getWidth();
        $height = $layer->getHeight();
      } catch (Exception $e) {
        // если поймали исключение, то записать в лог и продолжить работу
        error_log($e->getMessage());
        return false;
      };
    };
    return array("width" => $width, "height" => $height);
};
