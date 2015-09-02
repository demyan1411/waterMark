<?php
header('content-type: image/png');
header('Content-Disposition: attachment; filename="result.png"');
readfile($img_result);
?>