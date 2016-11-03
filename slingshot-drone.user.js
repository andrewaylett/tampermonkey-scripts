// ==UserScript==
// @name         Slingshot Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create button to open Slingshot if Drone succeeds
// @author       andrewaylett
// @match        http://drone.eu-west-1.prod.aws.skyscanner.local/*
// @grant        none
// ==/UserScript==

// Thanks to pbsinclair42 for first version.

(function() {
    'use strict';

    var timer = window.setInterval(openSlingshot,1000);
    var buildSummary = $('<div class="build-summary" id="links">');
    buildSummary.insertAfter($('.build-btn-group'));

    function openSlingshot(){
        var o=$('#output').html();
        buildSummary.empty();
        var regionRe = /http:\/\/slingshot.([^.].*).prod.aws.skyscanner.local\/workflow?[^"]*workflow_id=(.*)-[^"]*/g;
        var item;
        while ((item = regionRe.exec(o)) !== null) {
            try{
                var url = item[0].replace('&amp;','&');
                console.log(item[0]);
                $('<p><a href="' + url + '" class="btn btn-info">' + item[1] + ' ' + item[2] + '</a></p>').appendTo(buildSummary);
            } catch(e) {
                console.log(e);
            }
        }
        if ($('.success').length > 0) {
            clearInterval(timer);
        }
    }

    window.setTimeout(openSlingshot, 0);
})();
