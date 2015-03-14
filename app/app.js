var express = require('express');
var request = require('request');
var phantom = require('phantom');
var exphbs  = require('express-handlebars');
var data = require('./pages.json');

var app = express();
var port = 8090;
var hbs = exphbs.create({
    defaultLayout: 'main',
    partialsDir: __dirname + '/views',
});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views/');

app.get('/status/ping', function(req, res) {
res.send('pong');
});

app.get('/generate/:id', function(req, res) {
    var tempResponse;

    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(data.pages[req.params.id], function () {
                page.evaluate(function (remoteSiteBody) {
                    var branding = document.querySelector('#branding');
                    var attrTable = branding.querySelector('.table-c');

                    tempResponse = {
                        'mainTitle': branding.querySelector('h3').innerHTML,
                        'date': attrTable.querySelector('tr:first-child .col-b').innerHTML,
                        'duration': attrTable.querySelector('tr:first-child + tr .col-b').innerHTML,
                        'location': attrTable.querySelector('tr:first-child + tr + tr + tr .col-b').innerHTML.trim(),
                        'url': window.location.href
                    };

                    return tempResponse;
                }, function (details) {

                    res.render('index', {
                        layout: false,
                        details: details
                    });
                    console.log(details);
                    ph.exit();
                });

            });
        });
    });
});

app.listen(port, function () {
    console.log('server started on port ' + port);
});
