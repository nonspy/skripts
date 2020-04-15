var Nightmare = require('nightmare'),
    nodemailer = require("nodemailer");
    nightmare = Nightmare({
        // switches: {
        //     'proxy-server': nodeIp // set the proxy server here ...
        // },
        openDevTools: {
            mode: 'detach'
        },
        typeInterval: 20,
        show: true,
        executionTimeout: 5000
    });

var initConnection = connectToDB();
getSSGarages(function() {
    updateGarageAction();
    // getSSFlats1(function() {
    //     getSSFlats2(function() {
    //         nightmare.end();
    //         updateFlatAction();
    //     });
    // });
});




function getSSGarages(callback) {
    nightmare
        .goto('https://www.ss.com/ru/real-estate/premises/garages/riga/today-5/sell/')
        .wait('#head_line')
        .evaluate(function () {
            var items = document.querySelectorAll('[id^=\'tr_4\']'),
                output = [];

            [].forEach.call(items,function (tr) {
                var item = tr.querySelectorAll('td');
                var object = {};

                object.id = tr.id;
                object.link = item[1] ? item[1].querySelector('a').href : null;
                object.image = item[1] ? item[1].querySelector('img').src : null;
                object.title = item[2] ? item[2].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.place = item[3] ? item[3].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.size = item[4] ? item[4].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.price = item[5] ? item[5].querySelector('a').innerText.replace(/[&<"']/g, '') : 0;
                output.push(object);
            });

            return output;
        })
        .then(function (objects) {
            addGaragesToDb(objects, 'ss.lv');
            callback();
        })
}

function getSSFlats1(callback) {
    nightmare
        .goto('https://www.ss.com/ru/real-estate/flats/riga/all/sell/')
        .wait('#head_line')
        .type('#f_o_8_min', '15000')
        .type('#f_o_8_max', '25000')
        .select('select[name="topt[1][min]"]', '1')
        .select('select[name="topt[1][max]"]', '1')
        .click('input[type="submit"]')
        .wait(3000)
        .evaluate(function () {
            var items = document.querySelectorAll('[id^=\'tr_4\']'),
                output = [];

            [].forEach.call(items,function (tr) {
                var item = tr.querySelectorAll('td');
                var object = {};

                object.id = tr.id;
                object.link = item[1] ? item[1].querySelector('a').href : null;
                object.image = item[1] ? item[1].querySelector('img').src : null;
                object.title = item[2] ? item[2].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.place = item[3] ? item[3].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.rooms = item[4] ? item[4].querySelector('a').innerText : null;
                object.size = item[5] ? item[5].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.storey = item[6] ? item[6].querySelector('a').innerText : null;
                object.series = item[7] ? item[7].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.price = item[8] ? item[8].querySelector('a').innerText : 0;
                output.push(object);
            });

            return output;
        })
        .then(function (objects) {
            addFlatsToDb(objects, 'ss.lv');
        callback();
    })
}

function getSSFlats2(callback) {
    nightmare
        .goto('https://www.ss.com/ru/real-estate/flats/riga/all/sell/')
        .wait('#head_line')
        .type('#f_o_8_min', '15000')
        .type('#f_o_8_max', '60000')
        .select('select[name="topt[1][min]"]', '2')
        .select('select[name="topt[1][max]"]', '3')
        .click('input[type="submit"]')
        .wait(3000)
        .evaluate(function () {
            var items = document.querySelectorAll('[id^=\'tr_4\']'),
                output = [];

            [].forEach.call(items,function (tr) {
                var item = tr.querySelectorAll('td');
                var object = {};

                object.id = tr.id;
                object.link = item[1] ? item[1].querySelector('a').href : null;
                object.image = item[1] ? item[1].querySelector('img').src : null;
                object.title = item[2] ? item[2].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.place = item[3] ? item[3].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.rooms = item[4] ? item[4].querySelector('a').innerText : null;
                object.size = item[5] ? item[5].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.storey = item[6] ? item[6].querySelector('a').innerText : null;
                object.series = item[7] ? item[7].querySelector('a').innerText.replace(/[&<"']/g, '') : null;
                object.price = item[8] ? item[8].querySelector('a').innerText : 0;
                output.push(object);
            });

            return output;
        })
        .end()
        .then(function (objects) {
            addFlatsToDb(objects, 'ss.lv');
            callback();
        })
}

function addGaragesToDb(objects, source) {
    console.log(objects);
    objects.forEach(function (object) {
        initConnection.query(
            "INSERT INTO garages" +
            "(ss_id, link, image, title, place, size, price, source)" +
            "VALUES " +
            "('" + object.id + "'," +
            " '" + object.link + "'," +
            " '" + object.image + "'," +
            " '" + object.title + "'," +
            " '" + object.place + "'," +
            " '" + object.size + "'," +
            " '" + object.price + "'," +
            " '" + source + "')" +
            "ON DUPLICATE KEY UPDATE " +
            "title = '" + object.title + "'," +
            "place = '" + object.place + "'," +
            "size = '" + object.size + "'," +
            "price = '" + object.price + "';"
            , function(err, items) {
                if (err) throw err;
            });
    });
}

function addFlatsToDb(objects, source) {
    console.log(objects);
    objects.forEach(function (object) {
        initConnection.query(
            "INSERT INTO flats" +
            "(ss_id, link, image, title, place, size, price, storey, series, rooms, source)" +
            "VALUES " +
            "('" + object.id + "'," +
            " '" + object.link + "'," +
            " '" + object.image + "'," +
            " '" + object.title + "'," +
            " '" + object.place + "'," +
            " '" + object.size + "'," +
            " '" + object.price + "'," +
            " '" + object.storey + "'," +
            " '" + object.series + "'," +
            " '" + object.rooms + "'," +
            " '" + source + "')" +
            "ON DUPLICATE KEY UPDATE " +
            "title = '" + object.title + "'," +
            "place = '" + object.place + "'," +
            "size = '" + object.size + "'," +
            "price = '" + object.price + "';"
            , function(err, items) {
                if (err) throw err;
            });
    });
}

function updateGarageAction() {
    console.log('------- UPDATE --------');
    initConnection.query(
        "SELECT * FROM garages WHERE email_sent = 0;", function(err, objects) {
            if (err) throw err;

            console.log(objects);

            if (objects.length) {
                console.log('Sending ' + objects.length + ' items');
                sendGarageMail(objects);
            } else {
                console.log('Nothing to send');
            }

            initConnection.query("UPDATE garages SET email_sent = 1;", function(err) {
                if (err) throw err;
            });
        });
}

function updateFlatAction() {
    console.log('------- UPDATE --------');
    initConnection.query(
        "SELECT * FROM flats WHERE email_sent = 0;", function(err, objects) {
            if (err) throw err;

            console.log(objects);

            if (objects.length) {
                console.log('Sending ' + objects.length + ' items');
                sendFlatMail(objects);
            } else {
                console.log('Nothing to send');
            }

            initConnection.query("UPDATE flats SET email_sent = 1;", function(err) {
                if (err) throw err;

                initConnection.end();
            });
        });
}

function sendGarageMail(objects){
    var transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'postmaster@99parts.lv',
            pass: '54be624340eb532d4dad4dc333896198-059e099e-7d3b32ab'
        }
    });

    var trs = '';

    objects.forEach(function(object) {
         trs += "<tr>" +
            "<td style='padding: 5px;border: 1px solid #666'><a href='" + object.link + "'><img src='" + object.image + "' border='0' width='90'></a></td>" +
            "<td style='padding: 5px;border: 1px solid #666'><a href='" + object.link + "'>" + object.title + "</a></td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.place + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + (object.size ? object.size : '-') + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.price + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.source + "</td>" +
            "</tr>";
    });



   transporter.sendMail({
        from: '<no-reply@99parts.lv>', // sender address
        to: "sticker.turbo@gmail.com", // list of receivers
        subject: "SS garage: " + objects.length + " new items", // Subject line
        html: '<body>' +
                '<table style="table-layout: fixed; min-width: 640px; width: 100%; border-collapse: collapse; border: 1px solid #666">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 100px">Фото</th>' +
                            '<th style="width: 50%">Описание</th>' +
                            '<th style="width: 20%">Место</th>' +
                            '<th style="width: 20%">Размер</th>' +
                            '<th style="width: 10%">Цена</th>' +
                            '<th style="width: 10%">Источник</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' + trs + '</tbody>' +
                '</table>' +
            '</body>'
    });

}

function sendFlatMail(objects){
    var transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'postmaster@99parts.lv',
            pass: '54be624340eb532d4dad4dc333896198-059e099e-7d3b32ab'
        }
    });

    var trs = '';

    objects.forEach(function(object) {
        trs += "<tr>" +
            "<td style='padding: 5px;border: 1px solid #666'><a href='" + object.link + "'><img src='" + object.image + "' border='0' width='90'></a></td>" +
            "<td style='padding: 5px;border: 1px solid #666'><a href='" + object.link + "'>" + object.title + "</a></td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.place + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + (object.size ? object.size : '-') + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.storey + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.series + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.rooms + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.price + "</td>" +
            "<td style='padding: 5px;border: 1px solid #666'>" + object.source + "</td>" +
            "</tr>";
    });



    transporter.sendMail({
        from: '<no-reply@99parts.lv>', // sender address
        to: "sticker.turbo@gmail.com", // list of receivers
        subject: "SS flats: " + objects.length + " new items", // Subject line
        html: '<body>' +
            '<table style="table-layout: fixed; min-width: 640px; width: 100%; border-collapse: collapse; border: 1px solid #666">' +
            '<thead>' +
            '<tr>' +
            '<th style="width: 100px">Фото</th>' +
            '<th style="width: 50%">Описание</th>' +
            '<th style="width: 20%">Место</th>' +
            '<th style="width: 10%">Размер</th>' +
            '<th style="width: 10%">Этаж</th>' +
            '<th style="width: 10%">Серия</th>' +
            '<th style="width: 10%">Кол. комнат</th>' +
            '<th style="width: 15%">Цена</th>' +
            '<th style="width: 10%">Источник</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' + trs + '</tbody>' +
            '</table>' +
            '</body>'
    });

}


function connectToDB() {
    var mysql      = require('mysql'),
        connection = mysql.createConnection({
            host     : '207.154.223.239',
            user     : 'nonspy',
            password : 'iMJK7&321',
            database : 'grabber',
            charset: "utf8_general_ci"
        });

    connection.connect(function(err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
            return;
        }
    });

    return connection;
}


