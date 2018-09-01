$(document).ready(function () {
    loadReservedDates();                                                                    //При загрузке страницы, загружаю данные из текстового файла
});

$("body").on("click", "#reserv div", function(){                                            //Обработка клика на дату
    var attr = $(this).attr("pushed");
    if (typeof attr !== typeof undefined && attr !== false) {                               //Проверяю наличие атрибута "pushed" - нажато (атрибут в исходной разметке не указывается во избежания потери читаемости)
        if ($(this).attr("pushed") == "no"){                                                //если он есть, и имеет значение "no" - не нажато -
            $(this).attr({pushed: "yes", new: "yes"});                                      //то меняю на "yes" - нажато,
            $(this).css({"background-color":"green", "color":"white"});                     //раскрашиваю фон в зелёный, а цифры в белый цвет
        } else if ($(this).attr("pushed") == "yes"){                                        //и наоборот (снимаю бронирование)
            $(this).attr({pushed: "no", new: "no"});
            $(this).css({"background-color":"", "color":""})
        }
    } else {
        $(this).attr({pushed: "yes", new: "yes"});
        $(this).css({"background-color":"green", "color":"white"})
    }

    var new_res = 0;                                                                        //Показывать или нет кноп "Забронировать"
    $("#reserv div").each(function(){
        if ($(this).attr("new") == "yes"){                                                  //Подсчёт количества  выбранных дат в текущей сессии
            new_res = new_res +1;
        }
    });
    $("#send-data").remove();
    if(new_res > 0){                                                                        //Если new_res будет больше нуля, то показываю кноп "Забронировать"...
        $("<button id='send-data'></button>").appendTo("#for-button");
    } else {
        $("#send-data").remove();                                                           //... если равен нулю, то кноп удаляю (следствие снятия выделения зелёным цветом со всех дат)
    }
});

$("body").on("click", "#send-data", function(){                                             //Нажимаю кноп "Забронировать"
    var arr = [];                                                                           //Массив для забронированных дней
    $("#reserv div").each(function(){
        if ($(this).attr("pushed") == "yes"){                                               //Если на день нажали, то ...
            arr.push($(this).attr("day"));                                                  //...добавляю очередной день в массив
        }
    })
    $("<form name='case' id='case' method='post'></form>").appendTo("#main-container");     //Создаю форму для отправки данных в файл
    $("<input type='hidden' name='dates' id='dates' />").appendTo("#case");                 //Добавляю в форму скрытое поле для отправки данных в файл
    $("#dates").val(arr);                                                                   //Передаю массив с забронированными днями в скрытое поле
    var dates = $("#case").serializeArray();                                                //Сериализация данных
    $.post("create.php", dates);                                                            //Отправляю данные в файл
    $("#case").remove();                                                                    //Удаляю форму
    $("#reserv div[style='background-color: green; color: white;']").addClass("reserved");  //Отбираю только что забронированные (зелёные) и блокирую нажатие (класс reserved)
    $("#send-data").remove();                                                               //Удаляю кноп "Забронировать"
    $("<div id='notice'>Данные обновятся через <span id='nums'>5</span> секунды...</div>").appendTo("#for-button");
    countDown();
});

function countDown(){
    $("#reserv div").each(function(){
       $(this).addClass("wait_renew");                                                  //Устанавливаю блокировку выбора даты, пока не закончится обратный отсчёт
    });
    var num = 5;                                                                        //Количество секунд до начала обновления данных
    var countDown = setInterval(function(){
        num = num - 1;
        $("#nums").text(num);                                                           //Передаю в span количество оставшихся секунд
        if(num < 1){
            clearInterval(countDown);                                                   //Останавливаю обратный отсчёт по достижении 0
            loadReservedDates();                                                        //Обновляю данные бронирования
            $("#notice").text("Бронирование успешно завершено.").css({color: "green"});
            var notice = setTimeout(function(){
                $("#notice").remove();                                                  //Через 2 секунды удаляю уведомление об успешном бронировании
            }, 2000);
        }
    }, 1000);
}

function loadReservedDates (){                                                          //Загрузка данных из текстового файла
    $.getJSON("extr.php", function (json) {
        $.each(json.otvet, function () {    // Получаю из сводной таблицы значения дат
            var denj = this['reserved'];
            $("#reserv div").each(function(){
                if ($(this).attr("day") == denj){
                    $(this).css({"background-color":"red", "color":"white"}).attr({pushed: "yes"}).addClass("reserved").removeAttr("new");
                };
                $(this).removeClass("wait_renew");          //Снимаю блокировку выбора даты, установленную на период действия обратного отсчёта до обновления данных бронирования
            })
        });
    });
}