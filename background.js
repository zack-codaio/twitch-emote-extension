/**
 * Created by zackaman on 8/30/15.
 */

//var messages = document.getElementsByClassName("message-line");

var recording = false;
var minute = 0;

//control recording state
//start interval
var start_recording = function(){
    console.log("start_recording()");
    recording = true;

    //call log_minute every 60 seconds
    setInterval(log_minute(), 6000);
}

var log_minute = function(){
    console.log("logging minute "+minute);

    minute++;
}


//stop recording state
var stop_recording = function(){
    recording = false;
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("Twitch Emote Visualizer -- Loaded");

    //create panel

    //send message to



});