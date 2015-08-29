<?
/* resize.php
   модуль содержит функцию resize для пропорционального ресайзинга изображения
   по заданным максимальным размерам
*/

// работаем с библиотекой для обработки изображений
use PHPImageWorkshop\ImageWorkshop;
require_once('PHPImageWorkshop/ImageWorkshop.php');

function resize($filename, $maxWidth, $maxHeight) {

    $layer = ImageWorkshop::initFromPath($filename);

    if ($layer->getWidth() > $maxWidth  || $layer->getHeight() > $maxHeight) {
      try {
        $layer->resizeToFit($maxWidth, $maxHeight, true);
        $layer->save('./', $filename);
      } catch (Exception $e) {
        // если поймали исключение, то записать в лог и продолжить работу
        error_log($e->getMessage());
        return false;
      };
    };
    return true;
};
