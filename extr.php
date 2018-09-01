
<?php
    // Получает содержимое файла в виде массива. В данном примере мы используем
    $lines = file('dates.txt');
    $pieces = explode(",", $lines[0]);
    $reserved_dates = array();
    foreach ($pieces as $value) {
        //echo "Значение: $value<br />\n";
        array_push($reserved_dates, array('reserved' => $value));
    }
    echo json_encode(array('otvet' => $reserved_dates));
?>
