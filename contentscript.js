// is the first thing run, initializes the other objects and wires them up to each other
var mainCtl = {};
$(document).ready(function () {
   mainCtl.uiCtl = uiCtlFactory();
   // mainCtl.scraper = scraperFactory();
   // mainCtl.visualizer = visualizerFactory();

   console.log("Twitch Emote Extension inititialization.");
});

// interval should be pulled out as a const

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
      emotePanel: {},

      init: function () {
         // emotePanel
         //create the initial panel / ui
         //BabyRage ?
         var self = this;

         $('body').append('<div id="emotePanel"><div id="emoteCircle"></div><img id="emoteButton" src="img/BibleThump.png"></div>');

         //create visualize panel
         $('body').append('<div id="visualizePanel"></div>');

         self.emotePanel = $("#emotePanel");
         self.emotePanel.click(function () {
            self.toggleUI();
         });

         self.emotePanel.append('<div id="recordButton" class="button-container"><img id="recordImg" class="button-img"><div id="record-text" class="button-text">Record</div></div>');
         document.getElementById("recordImg").src = chrome.extension.getURL("img/record.svg");

         self.emotePanel.append('<div id="visualizeButton" class="button-container"><img id="visualizeImg" class="button-img"><div class="button-text">Visualize</div></div>');
         document.getElementById("visualizeImg").src = chrome.extension.getURL("img/graph.svg");

         $("#recordButton").click(function (event) {
            self.toggleRecord();
            event.stopPropagation();
         });

         $("#visualizeButton").click(function (event) {
            self.toggleVisualize();
            event.stopPropagation();
         });
      },

      toggleUI: function () {
         this.uiOpen = !this.uiOpen;

         // all of this should be pulled out into the html if possible to hook in angular
         console.log(self);
         console.log(self.emotePanel);

         // XXX - should already be wrapped in $()
         self.emotePanel = $(self.emotePanel);
         if (this.uiOpen) {
            self.emotePanel.css({"width": "200px"});
            $(".button-container").css({"display": "inline-block"});
            setTimeout(function () {
               $(".button-container").css({"opacity": 1});
            }, 500);
         } else {
            $(".button-container").css({"opacity": 0});
            setTimeout(function () {
               $(".button-container").css({"display": "none"});
               self.emotePanel.css({"width": "60px"});
            }, 500);
         }
      },

      toggleRecord: function () {
         this.recording = !this.recording;
         if (this.recording) {
            console.log("Starting recording");
            $("#recordImg").attr("src", chrome.extension.getURL("img/pause.svg"));
            $("#record-text").html("Pause");

            //trigger recording
            $(".message-line").remove(); //clear out existing messages

            // resetting should be pulled into a separate function
            // same for triggering scraping
            emotesData = [];
            curMinute = 0;

            // scraper should manage its own interval
            // intervalID = setInterval(function () {
            //    // scrapeMessages();
            //    //scraper.startScraping();

            //    curMinute++;
            //    console.log(emotesData);
            // }, 20000); //currently, 10 seconds
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
         // on receiving event of new data
      },

      // should this also have explicit functions?
      toggleVisualize: function () {
         this.visualizing = !this.visualizing;
         if (this.visualizing) {
            $("#visualizeImg").css({"-webkit-filter": "grayscale(0%)"});
            $("#visualizePanel").css({"left": "0"});
            setTimeout(function () {
               $("#visualizePanel > svg").css({"opacity": "1"});
            }, 500);
         } else {
            $("#visualizeImg").css({"-webkit-filter": "grayscale(100%)"});
            $("#visualizePanel > svg").css({"opacity": "0"});
            setTimeout(function () {
               $("#visualizePanel").css({"left": "100%"});
            }, 500);
         }
      },
   }.init();
}

// watches chat, scrapes, and stores
// has accessor methods to give data
function scraperFactory () {
   var scraper;

   scraper.scrapeIndex = 0;
   scraper.emotesData = [];         //array of the emotes
   scraper.emotesSources = {}; //object with links to the image source
   scraper.intervalID;         //the timer interval that controls when scraping is done
   scraper.scraping = false;
   scraper.msInterval = 20000; //20 seconds

   scraper.toggleScraping = function () {
      this.scraping = !this.scraping;
      if (this.scraping) {
         this.startScraping();
      } else {
         this.stopScraping();
      }
   };

   scraper.startScraping = function () {
      scraper.intervalID = setInterval(function () {
         scraper.scrape();
         scraper.scrapeIndex++;
         console.log(emotesData);
      }, scraper.msInterval);

      console.log('Starting scraper');
   };

   scraper.stopScraping = function () {
      // clear interval
      clearInterval(scraper.msInterval);
      console.log('Stopping scraper');
   };

   scraper.scrape = function () {
      //get existing messages
      var newMessages = $(".message-line");

      //create a new object for the current minute
      var minuteData = emotesData[curMinute] = {};

      //count occurrences of emotes in each message
      for (var i = 0; i < newMessages.length; i++) {
        var messagetext = $(newMessages[i]).children(".message")[0];
        var emotes = $(messagetext).children("img");
        if (emotes.length > 0) {
            //console.log(emotes);
            for (var j = 0; j < emotes.length; j++) {
                //console.log(emotes[j].alt);
                var curEmote = emotes[j].alt; //get type of emote from the alt text of the image
                var emoteSource = emotes[j].src;

                //add to minuteData (and emotesData)
                if (minuteData.hasOwnProperty(curEmote)) {
                    //console.log("already has "+curEmote+" as property");
                    minuteData[curEmote]++;
                }
                else {
                    //console.log("adding new property "+curEmote+" to minuteData");
                    minuteData[curEmote] = 1;
                }

                //add img source to emotesSources
                if (!emotesSources.hasOwnProperty(curEmote)) {
                    emotesSources[curEmote] = emoteSource;
                    //console.log(emotesSources);
                }
            }
        }
      }

      // tag existing as viewed
      // newMessages.remove();

      //emit event to any open graphs telling them to redraw
      // redrawGraphs();
   }

   scraper.allData = function () {

   }

   scraper.lastMinute = function () {

   }

   scraper.currentEmote = function () {

   }

   // broadcast new data


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
