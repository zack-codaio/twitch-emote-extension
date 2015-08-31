/**
 * Created by zackaman on 8/30/15.
 */

var emotePanel;         //the actual panel itself
var ui_open = false;    //is the panel open or closed?
var recording = false;  //boolean toggle for if recording is happening
var intervalID;         //the timer interval that controls when scraping is done
var curMinute;          //track the current minute / interval
var emotesData;         //array of the emotes
var emotesSources = {}; //object with links to the image source

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

    emotePanel.append('<div id="recordButton" class="button-container"><img id="recordImg" class="button-img"><div id="record-text" class="button-text">Record</div></div>');
    document.getElementById("recordImg").src = chrome.extension.getURL("img/record.svg");

    emotePanel.append('<div id="visualizeButton" class="button-container"><img id="visualizeImg" class="button-img"><div class="button-text">Visualize</div></div>');
    document.getElementById("visualizeImg").src = chrome.extension.getURL("img/graph.svg");

    $("#recordButton").click(function(event){
       toggleRecord();
        event.stopPropagation();

    });
    $("#visualizeButton").click(function(event){
        //visualize();
        event.stopPropagation();
    })

});

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



function toggleRecord(){

    if(recording){
        console.log("Stopping recording");
        $("#recordImg").attr("src", chrome.extension.getURL("img/record.svg"));
        $("#record-text").html("Record");
        clearInterval(intervalID);
        recording = false;
    }
    else{
        console.log("Starting recording");
        $("#recordImg").attr("src", chrome.extension.getURL("img/pause.svg"));
        $("#record-text").html("Pause");

        //trigger recording
        $(".message-line").remove(); //clear out existing messages
        emotesData = [];
        curMinute = 0;
        intervalID = setInterval(function(){
            scrapeMessages();
            curMinute++;
            console.log(emotesData);
        },20000); //currently, 10 seconds

        recording = true;
    }
}

function scrapeMessages(){
    //get existing messages
    var newMessages = $(".message-line");

    //create a new object for the current minute
    var minuteData = emotesData[curMinute] = {};

    //count occurrences of emotes in each message
    for(var i = 0; i < newMessages.length; i++){
        var messagetext = $(newMessages[i]).children(".message")[0];
        var emotes = $(messagetext).children("img");
        if(emotes.length > 0){
            //console.log(emotes);
            for(var j = 0; j < emotes.length; j++){
                //console.log(emotes[j].alt);
                var curEmote = emotes[j].alt; //get type of emote from the alt text of the image
                var emoteSource = emotes[j].src;

                //add to minuteData (and emotesData)
                if(minuteData.hasOwnProperty(curEmote)){
                    //console.log("already has "+curEmote+" as property");
                    minuteData[curEmote]++;
                }
                else{
                    //console.log("adding new property "+curEmote+" to minuteData");
                    minuteData[curEmote] = 1;
                }


                //add img source to emotesSources
                if(!emotesSources.hasOwnProperty(curEmote)){
                    emotesSources[curEmote] = emoteSource;
                    //console.log(emotesSources);
                }
            }
        }
    }

    //clear messages from DOM
    newMessages.remove();

    //emit event to any open graphs telling them to redraw
}