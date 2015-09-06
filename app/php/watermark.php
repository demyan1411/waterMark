<?php
/* watermark.php
	 функция watermark для наложения одного изображения поверх другого по заданным параметрам
	 возвращает имя результирующего файла
*/
session_start();
$session_dir = session_id() . "/"; // уникализированное имя директории для файлов юзера

//Входные параметры
$img_main = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir . filter_input(INPUT_POST, 'imgmain');
$img_wmark = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir . filter_input(INPUT_POST, 'imgwmark');
$img_result = "../" . filter_input(INPUT_POST, 'uploaddir') . $session_dir . "result.png";
$coordx = filter_input(INPUT_POST, 'coordx');
$coordy = filter_input(INPUT_POST, 'coordy');
$marginx = filter_input(INPUT_POST, 'marginx');
$marginy = filter_input(INPUT_POST, 'marginy');
$opacity = filter_input(INPUT_POST, 'opacity') * 100;
$mode = filter_input(INPUT_POST, 'mode'); // tile or not

// открываем картинки
$bgpic = createImgObj($img_main);
$wmpic = createImgObj($img_wmark);

$bgpic_width = imagesx($bgpic);
$bgpic_height = imagesy($bgpic);
$wmpic_width = imagesx($wmpic);
$wmpic_height = imagesy($wmpic);

if ($mode == 'tile') {

	// увеличиваем ватермарк на величину отступов
	$wmpic_width += $marginx;
	$wmpic_height += $marginy;

	// создаём прозрачную канву
	$idest=imagecreate($wmpic_width, $wmpic_height);
	imagealphablending($idest, false);
	imagesavealpha($idest, true);

	//копируем исходное изображение на канву с левого верхнего края
	imagecopy($idest, $wmpic, 0, 0, 0, 0, imagesx($wmpic), imagesy($wmpic));

	// создаём слой для тайлов, на 1 тайл больший чем bgpic
	$tiles = imagecreate($bgpic_width+$wmpic_width, $bgpic_height+$wmpic_height);

	// замостить idest поверхность слоя tiles
	imagesettile($tiles, $idest);
	imagefilledrectangle($tiles, 0, 0, $bgpic_width+$wmpic_width, $bgpic_height+$wmpic_height, IMG_COLOR_TILED);

	// подготавливаем координаты к тайлингу. положительные координаты при тайлинге быть не могут
	($coordx > 0) ? $coordx = 0 : $coordx;
	($coordy > 0) ? $coordy = 0 : $coordy;

	imagecopymerge_alpha($bgpic, $tiles, $coordx, $coordy, 0,0 , $bgpic_width+$wmpic_width, $bgpic_height+$wmpic_height, $opacity );

	// освобождаем память
	imagedestroy($tiles);
	imagedestroy($idest);
	}
else {
	// простое наложение одиночного ватермарка
	imagecopymerge_alpha($bgpic, $wmpic, $coordx, $coordy, 0, 0, imagesx($wmpic), imagesy($wmpic), $opacity );
}

// сохраняем картинку-результат на сервере
imagepng($bgpic, $img_result, 6);

// уничтожаем объекты картинок
imagedestroy($bgpic);
imagedestroy($wmpic);

exit($img_result);

/**
 * imagecopymerge() с поддержкой альфа-канала;
 * http://sina.salek.ws/content/alpha-support-phps-imagecopymerge-function
 **/
function imagecopymerge_alpha($dst_im, $src_im, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $opacity) {
	// creating a cut resource
	$cut = imagecreatetruecolor($src_w, $src_h);

	// copying that section of the background to the cut
	imagecopy($cut, $dst_im, 0, 0, $dst_x, $dst_y, $src_w, $src_h);

	// placing the watermark now
	imagecopy($cut, $src_im, 0, 0, $src_x, $src_y, $src_w, $src_h);
	imagecopymerge($dst_im, $cut, $dst_x, $dst_y, $src_x, $src_y, $src_w, $src_h, $opacity);
	imagedestroy($cut);
}

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