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

    if (document.getElementsByClassName("navbar-form").length === 0) {
        window.location = '/authorize';
    }

    var buildSummary = $('<div class="build-summary" id="links">');

    function openSlingshot() {
        console.log("Looking for Slingshot URLs");
        var o=$(outputElement).html();
        buildSummary.empty();
        var regionRe = /http:\/\/slingshot.([^.]+).([^.]+).aws.skyscanner.local[^"]+workflow_id=(.*)-[^"]+/g;
        var item;
        while ((item = regionRe.exec(o)) !== null) {
            try{
                var url = item[0].replace('&amp;','&');
                console.log(item[0]);
                $('<p><a href="' + url + '" class="btn btn-info">' + item[1] + ' ' + item[2] + ' ' + item[3] + '</a></p>').appendTo(buildSummary);
            } catch(e) {
                console.log(e);
            }
        }
    }

    var outputElement = document.getElementById('output');

    if (outputElement) {
        buildSummary.insertAfter($('.build-btn-group'));

        // create an observer instance
        var observer = new MutationObserver(openSlingshot);

        // configuration of the observer:
        var config = { attributes: true, childList: true, characterData: true };

        // pass in the target node, as well as the observer options
        observer.observe(outputElement, config);

        window.setTimeout(openSlingshot, 0);
    }
})();
