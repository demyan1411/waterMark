 <?php
 /* cleanuploads.php
		чтение содержимого каталог uploads, удаление устаревших директорий
*/

$olds = 5*60*60; // количество секунд, в течении которых директория считается свежей и не удаляется
$time_cur = time();
$dir_uploads = '../uploads/';
$dir_list = scandir($dir_uploads);

var_dump($dir_list);

$i=2; // начинаем с 2 элемента, потому что 0 и 1 это "." и ".."
while($i < count($dir_list)):
	$dir_time = filemtime($dir_uploads . $dir_list[$i]);
	if(is_dir($dir_uploads . $dir_list[$i]) && $time_cur-$dir_time > $olds) {
		full_del_dir($dir_uploads . $dir_list[$i]);
	}
	$i++;
endwhile;
exit;

// функция удаления директории со всеми файлами в ней
function full_del_dir ($directory) {
	$dir = opendir($directory);
	while(($file = readdir($dir)))
	{
		if ( is_file ($directory."/".$file))
		{
			unlink ($directory."/".$file);
		}
		else if ( is_dir ($directory."/".$file) &&
						 ($file != ".") && ($file != ".."))
		{
			full_del_dir ($directory."/".$file);
		}
	}
	closedir ($dir);
	rmdir ($directory);
}

?>