/**
 * Created by zackaman on 8/30/15.
 */

$(document).ready(function () {
    console.log("CONTENT SCRIPT LOADED");

    //create the initial panel / ui
    //BabyRage ?
    $('body').append('<div style="position:fixed;top:20px;right:20px;width:60px;height:60px;background:white;z-index:9999;border: 1px solid #aaa;border-radius:60px;"><img id="emoteButton" src="img/BibleThump.png" style="line-height:60px;position:absolute;right:12.5px;top:13px;"></div>');

    var imgURL = chrome.extension.getURL("img/BibleThump.png");
    document.getElementById("emoteButton").src = imgURL;

});


