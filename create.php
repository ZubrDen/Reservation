<?php
    $text = $_POST["dates"];                //Получаю данные о забронированных датах
    $create_file = fopen("dates.txt", "w"); //Создаю файл для размещения данных о брони
    fwrite($create_file, $text);            //Записываю данные в файл
    fclose($create_file);                   //ЗАканчиваю запись данных и закрываю файл
?>