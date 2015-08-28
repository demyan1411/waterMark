<?php
 /* upload.php
    модуль обрабатывает ajax-запроc от upload.js на сохранение файла с изображением
    - выполняются проверки:
      -- файл является изображением
      -- максимальный размер не превышает $maxSize
    - файл сохраняется в каталоге $target_dir
    - возвращается ответ с информацией о том, каким элементам и какие значения нужно изменить
*/

$target_dir = "uploads/";  // каталог для загрузки файлов (относительно основной директории)
$maxSize = 1000000;        // максимальный размер файла

$filename = basename($_FILES[0]["name"]);
$tmp_file = $_FILES[0]["tmp_name"];  // временный файл
$target_file = "../" . $target_dir . $filename; // путь и имя будущего файла
$target_url = $target_dir . $filename;          // url к будущему файлу

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
else if (move_uploaded_file($tmp_file, $target_file)) {
    $answer['status'] = 'OK';
    $answer['text'] = 'Файл сохранен: ' . $target_url;
    $answer['url'] = $target_url;
    $answer['filename'] = $filename;
    $answer['dataimg'] = $_POST['dataimg'];
    $answer['datafakeinput'] = $_POST['datafakeinput'];
} else {
    $answer['status'] = 'Error';
    $answer['text'] = 'Ошибка: не удалось сохранить файл';
};

header("Content-Type: application/json");
echo json_encode($answer);
