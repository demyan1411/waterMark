<?php
use PHPImageWorkshop\ImageWorkshop;
require_once('lib/PHPImageWorkshop/ImageWorkshop.php');

// Максимальный размер картинки в px
$WidthMax = 650;
$HeightMax = 537;

//Входные параметры
$img_main = $_GET['imgmain'];
$img_wmark = $_GET['imgwmark'];

// сохранять пропорции картинки?
$conserveProportion = true;

// путь к загружаемым картинкам
$img_path = __DIR__.'/../uploads/';
// подключаем картинки
// $layer = ImageWorkshop::initFromPath($_FILES['image']['tmp_name']); - так подключаем из формы
$mainLayer = ImageWorkshop::initFromPath($img_path .$img_main);
$wmarkLayer = ImageWorkshop::initFromPath($img_path .$img_wmark);

resizeToCanvas($mainLayer);
resizeToCanvas($wmarkLayer);
showImage($mainLayer);
// showImage($wmarkLayer);
exit;


// ресайз картинки, если она больше канваса
function resizeToCanvas($imgLayer)
{
	global $WidthMax, $HeightMax, $conserveProportion;
	// получаем размеры картинки
	$imgWidth = $imgLayer->getWidth();
	$imgHeight = $imgLayer->getHeight();

	if ($imgWidth > $imgHeight && $imgWidth > $WidthMax) {

		// ресайз по ширине
		$imgLayer->resizeInPixel($WidthMax, null, $conserveProportion);

		} elseif ( $imgHeight > $HeightMax ) {
			// ресайз по высоте
			$imgLayer->resizeInPixel(null, $HeightMax, $conserveProportion);
	}

	return $imgLayer;
}

// показать результат (для теста)
function showImage($imgLayer)
{
	$image = $imgLayer->getResult("ffffff");
	header('Content-type: image/png');
	imagepng($image, null, 8);
	return true;
}
?>