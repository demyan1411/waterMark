<?php
/* watermark.php
	 функция watermark для наложения одного изображения поверх другого по заданным параметрам
	 возвращает имя результирующего файла
*/

// работаем с библиотекой для обработки изображений
use PHPImageWorkshop\ImageWorkshop;
require_once('PHPImageWorkshop/ImageWorkshop.php');

session_start();
$session_dir = session_id() . "/"; // уникализированное имя директории для файлов юзера

// Параметры
$result_filename = "result.png"; // имя результирующего файла (формат png)
$createFolders = true; // создавать директории при сохранении?
$backgroundColor = transparent; // transparent, only for PNG (otherwise it will be white if set null)
$imageQuality = 80; // useless for GIF, usefull for PNG and JPEG (0 to 100%)

// Входные параметры
$img_main = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir . filter_input(INPUT_POST, 'imgmain');
$img_wmark = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir . filter_input(INPUT_POST, 'imgwmark');
$dir2save = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir;
$coordx = filter_input(INPUT_POST, 'coordx');
$coordy = filter_input(INPUT_POST, 'coordy');
$marginx = filter_input(INPUT_POST, 'marginx');
$marginy = filter_input(INPUT_POST, 'marginy');
$opacity = filter_input(INPUT_POST, 'opacity') * 100;
$mode = filter_input(INPUT_POST, 'mode'); // tile or not

// открываем картинки
$bgpic = ImageWorkshop::initFromPath($img_main);
$wmpic = ImageWorkshop::initFromPath($img_wmark);

// узнать размеры картинок
$bgpic_width = $bgpic->getWidth();
$bgpic_height = $bgpic->getHeight();
$wmpic_width = $wmpic->getWidth();
$wmpic_height = $wmpic->getHeight();

if ($mode == 'tile') {

	// увеличиваем ватермарк на величину отступов
	$wmpic_width += $marginx;
	$wmpic_height += $marginy;

	// дефолтные размеры контейнера для тайлов
	$layerWidth = $bgpic_width;
	$layerHeight = $bgpic_height;

	// оптимизируем слой для тайлов, чтобы не тайлить в невидимой области
	if ($coordx > 0) {
		$layerWidth = $bgpic_width - $coordx;
	}
	if ($coordy > 0) {
		$layerHeight = $bgpic_height - $coordy;
	}
	if ($coordx < 0) {
		$coordx = $coordx - $wmpic_width * intval($coordx / $wmpic_width);
		$layerWidth = $bgpic_width + abs($coordx);
	}
	if ($coordy < 0) {
		$coordy = $coordy - $wmpic_height * intval($coordy / $wmpic_height);
		$layerHeight = $bgpic_height + abs($coordy);
	}

	// количество тайлов по ширине и высоте
	$col_x = ceil($layerWidth / $wmpic_width);
	$col_y = ceil($layerHeight / $wmpic_height);

	// создаём прозрачный слой для замощения
	$layer = ImageWorkshop::initVirginLayer($layerWidth, $layerHeight);
	// функция наложения ватермарков в цикле по одному — очень медленно
	$tile_y = 0;
	$y=0;
	while ($y++<$col_y) {
		$tile_x = 0;
		$x=0;
		while ($x++<$col_x) {
			$layer->addLayer(1, $wmpic, $tile_x, $tile_y, "LT");
			$tile_x += $wmpic_width;
		}
		$tile_y += $wmpic_height;
	}

	$wmpic = clone ($layer);
}

// применяем прозрачность к вотермарку и накладываем на основу
$wmpic->opacity($opacity);
$bgpic->addLayer(1, $wmpic, $coordx, $coordy, "LT");

// сохранение картинки на сервере
$bgpic->save($dir2save, $result_filename, $createFolders, $backgroundColor, $imageQuality);

exit($dir2save . $result_filename);

/**
 * функция создания объёкта картинки в соответствии с её типом
 * входной параметр - имя файла картинки с путём
 **/
function createImgObj($imagesrc) {
	$type = mime_content_type($imagesrc);
	switch($type){
		 case 'image/jpeg':
				 $image = imagecreatefromjpeg($imagesrc);
				 break;
		 case 'image/png':
				 $image = imagecreatefrompng($imagesrc);
				 break;
		 case 'image/gif':
				 $image = imagecreatefromgif($imagesrc);
				 break;
		 default:
				 $image = null;
	}
	return $image;
}
?>