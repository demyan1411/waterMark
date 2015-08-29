<?php
use PHPImageWorkshop\ImageWorkshop;
require_once('lib/PHPImageWorkshop/ImageWorkshop.php'); // Be sure of the path to the class

// Максимальный размер картинки в px
$WidthMax = 650;
$HeightMax = 537;

// путь к загружаемым картинкам
$img_path = "/../uploads/";

//Входные параметры
$img_main = $_POST['imgmain'];
$img_wmark = $_POST['imgwmark'];

// подключаем картинку
$mainLayer = ImageWorkshop::initFromPath(__DIR__.'/../uploads/2.jpg');

// получаем размеры картинки
$mainWidth = $mainLayer->getWidth();
$mainHeight = $mainLayer->getHeight();

if ($mainWidth > $mainHeight && $mainWidth > $WidthMax) {

	// ресайз по ширине
	$conserveProportion = true;
	$mainLayer->resizeInPixel($WidthMax, null, $conserveProportion);

	} elseif ( $mainHeight > $HeightMax ) {
		// ресайз по высоте
		$conserveProportion = true;
		$mainLayer->resizeInPixel(null, $HeightMax, $conserveProportion);
}

$image = $mainLayer->getResult();

header('Content-type: image/jpeg');
header('Content-Disposition: filename="butterfly.jpg"');
imagejpeg($image, null, 95); // We choose to show a JPEG (quality of 95%)
exit;

?>