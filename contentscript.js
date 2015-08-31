/**
 * Created by zackaman on 8/30/15.
 */

var emotePanel;

$(document).ready(function () {
    console.log("CONTENT SCRIPT LOADED");

    //create the initial panel / ui
    //BabyRage ?
    $('body').append('<div id="emotePanel" style="position:fixed;top:20px;right:20px;width:60px;height:60px;background:white;z-index:9999;border: 1px solid #aaa;border-radius:60px;transition: 0.5s ease;"><img id="emoteButton" src="img/BibleThump.png" style="line-height:60px;position:absolute;right:12.5px;top:14px;"></div>');

    var imgURL = chrome.extension.getURL("img/BibleThump.png");
    document.getElementById("emoteButton").src = imgURL;

    emotePanel = $("#emotePanel");
    emotePanel.click(function(){
        toggleUI();
    });

    emotePanel.append('<div id="recordButton" class="button-container"><img id="recordImg" class="button-img"><div class="button-text">Record</div></div>');
    document.getElementById("recordImg").src = chrome.extension.getURL("img/record.svg");

    emotePanel.append('<div id="visualizeButton" class="button-container"><img id="visualizeImg" class="button-img"><div class="button-text">Visualize</div></div>');
    document.getElementById("visualizeImg").src = chrome.extension.getURL("img/graph.svg");

    //$("#recordButton").hide();
    //$("#visualizeButton").hide();

});

var ui_open = false;

function toggleUI(){
    console.log("toggling UI");


    if(ui_open){

        $(".button-container").css({"opacity":0});
        //$(".button-container").hide(500);

        setTimeout(function(){
            $(".button-container").css({"display":"none"});
            $("#emotePanel").css({"width":"60px"});
        },500);



        ui_open = false;

    }
    else{
        $("#emotePanel").css({"width":"200px"});
        $(".button-container").css({"display":"inline-block"});
        setTimeout(function(){
            $(".button-container").css({"opacity":1});
        },500);

        //$(".button-container").show();

        ui_open = true;
    }

}


