<?php
 /* upload.php
    модуль обрабатывает ajax-запроc от upload.js на сохранение файла с изображением
    - выполняются проверки:
      -- файл является изображением
      -- максимальный размер не превышает $maxSize
    - файл сохраняется в каталоге $target_dir
    - если изображение превышает размеры контейнера, то оно пропорционально уменьшается
    - возвращается ответ с информацией о том, каким элементам и какие значения нужно изменить
*/
session_start();

// подключим функцию для ресайзинга изображения при сохранении
require_once('resize.php');

$target_dir = $_POST['uploadDir'];  // каталог для загрузки файлов
$maxSize = $_POST['maxSize'];       // максимальный размер файла
$maxWidth = $_POST['maxWidth'];     // ширина контейнера для картинки
$maxHeight = $_POST['maxHeight'];   // высота контейнера для картинки
$filename = basename($_FILES[0]["name"]); // имя файла
$session_dir = session_id() . "/"; // уникализированное имя директории для файлов юзера
$tmp_file = $_FILES[0]["tmp_name"];  // временный файл
$target_file = "../" . $target_dir . $session_dir . $filename; // путь и имя будущего файла
$target_url = $target_dir . $session_dir . $filename;          // url к будущему файлу

if (!file_exists("../" . $target_dir . $session_dir)) {
    mkdir("../" . $target_dir . $session_dir);
}

$imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
$answer =  array();  // ответ от сервера

// проверить, что файл является изображением
if (!getimagesize($tmp_file)) {
    $answer['status'] = 'Error';
    $answer['text'] = 'Ошибка: файл не является изображением';
}
// проверить максимальный размер
else if ($_FILES[0]["size"] > $maxSize) {
    $answer['status'] = 'Error';
    $answer['text'] = 'Ошибка: размер файла превышает максимальный - ' . $maxSize;
}
// проверки пройдены, пробуем сохранить файл
else if (!move_uploaded_file($tmp_file, $target_file)) {
    $answer['status'] = 'Error';
    $answer['text'] = 'Ошибка: не удалось сохранить файл';
} else {
    // пробуем уменьшить изображение к размерам нашего контейнера
    $newSize = resize($target_file, $maxWidth, $maxHeight);
    if (!$newSize) {
        $answer['status'] = 'Error';
        $answer['text'] = 'Ошибка: не удалось обработать и уменьшить изображение';
    }
    // все удачно завершилось, сформировать ответ сервера
    else {
        $answer['status'] = 'OK';
        $answer['text'] = 'Файл сохранен: ' . $target_url . ' ('. $newSize['width'] . ' x ' . $newSize['height'] .')';
        $answer['url'] = $target_url;
        $answer['filename'] = $filename;
        $answer['width'] = $newSize['width'];
        $answer['height'] = $newSize['height'];
    };
}

header("Content-Type: application/json");
echo json_encode($answer);
