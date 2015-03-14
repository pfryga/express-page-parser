var express = require('express');
var request = require('request');
var phantom = require('phantom');
var data = require('./pages.json');

var app = express();

var port = 8090;

app.get('/status/ping', function(req, res) {
    res.send('pong');
});

app.get('/generate', function(req, res) {
    var response;
    var temp;
    var tempResponse;

    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(data.pages[0], function () {
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
                }, function (result) {
                    console.log(result);
                    ph.exit();
                });

            });
        });
    });
});

app.listen(port, function () {
    console.log('server started on port ' + port);
});
