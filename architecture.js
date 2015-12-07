// is the first thing run, initializes the other objects and wires them up to each other
var mainCtl;
$(document).ready(function () {
   mainCtl.uiCtl = uiCtlFactory();
   mainCtl.scraper = scraperFactory();
   mainCtl.visualizer = visualizerFactory();

});

// handles user input, binds actions of other objects to UI state
   // FUNCTIONS:
   // toggleUI - expanded, ui_open
   // toggleRecord() - recording
      // startRecording
      // stopRecording
      // toggleRecording
   // redrawIcon
   // toggleVisualize
function uiCtlFactory () {
   return uiCtl = {
      uiOpen: false,
      recording: false,
      visualizing: false,
      curMinute: 0,

      init: function () {
         // emotePanel
         //create the initial panel / ui
         //BabyRage ?
         $('body').append('<div id="emotePanel"><div id="emoteCircle"></div><img id="emoteButton" src="img/BibleThump.png"></div>');

         this.emotePanel = $("#emotePanel");
         this.emotePanel.click(function () {
            toggleUI();
         });

         this.emotePanel.append('<div id="recordButton" class="button-container"><img id="recordImg" class="button-img"><div id="record-text" class="button-text">Record</div></div>');
         document.getElementById("recordImg").src = chrome.extension.getURL("img/record.svg");

         this.emotePanel.append('<div id="visualizeButton" class="button-container"><img id="visualizeImg" class="button-img"><div class="button-text">Visualize</div></div>');
         document.getElementById("visualizeImg").src = chrome.extension.getURL("img/graph.svg");

         $("#recordButton").click(function (event) {
            toggleRecord();
            event.stopPropagation();
         });

         $("#visualizeButton").click(function (event) {
            toggleVisualize();
            event.stopPropagation();
         });
      },

      toggleUI: function () {
         this.uiOpen = !this.uiOpen;
         if (this.uiOpen) {
            $("#emotePanel").css({"width": "200px"});
            $(".button-container").css({"display": "inline-block"});
            setTimeout(function () {
               $(".button-container").css({"opacity": 1});
            }, 500);
         } else {
            $(".button-container").css({"opacity": 0});
            setTimeout(function () {
               $(".button-container").css({"display": "none"});
               $("#emotePanel").css({"width": "60px"});
            }, 500);
         }
      },

      toggleRecord: function () {
         this.recording = !this.recording;
         if (recording) {
            console.log("Starting recording");
            $("#recordImg").attr("src", chrome.extension.getURL("img/pause.svg"));
            $("#record-text").html("Pause");

            //trigger recording
            $(".message-line").remove(); //clear out existing messages
            emotesData = [];
            curMinute = 0;
            intervalID = setInterval(function () {
               scrapeMessages();
               curMinute++;
               console.log(emotesData);
            }, 20000); //currently, 10 seconds
         } else {
            console.log("Stopping recording");
            $("#recordImg").attr("src", chrome.extension.getURL("img/record.svg"));
            $("#record-text").html("Record");
            clearInterval(intervalID);
            recording = false;
         }
      },

      startRecording: function () {
         this.recording = true;
      },

      stopRecording: function () {
         this.recording = false;
      },

      // should maybe be in the visualizer?
      redrawIcon: function () {

      },

      // should this also have explicit functions?
      toggleVisualize: function () {

      },
   }.init();
}

// watches chat, scrapes, and stores
// has accessor methods to give data
function scraperFactory () {
   var scraper;

   var emotesData;         //array of the emotes
   var emotesSources = {}; //object with links to the image source
   var intervalID;         //the timer interval that controls when scraping is done

   scraper.scrape = function () {

   }

   scraper.allData = function () {

   }

   scraper.lastMinute = function () {

   }

   scraper.currentEmote = function () {

   }


   return scraper;
}


// requests data from the scraper
// draws the data
   // init graph
   // redrawGraphs
   function visualizerFacotry () {
      var visualizer;

      visualizer.initGraph = function () {

      };

      visualizer.drawStackedAreaChart = function () {

      };

      return visualizer;
   }
