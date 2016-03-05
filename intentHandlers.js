'use strict';
var textHelper = require('./textHelper'),
    storage = require('./storage'),
    AlexaSkill = require('./AlexaSkill');
    
var registerIntentHandlers = function(intentHandlers, skillContext) {
    intentHandlers.NewMeditationIntent = function(intent, session, response) {
        //ask the user to start a dynamic or static meditation
        storage.loadMeditation(session, function(currentMeditation) {
            var speechOutput, reprompt;
            if(currentMeditation.data.level == 1 && currentMeditation.data.progress == 0) {
                speechOutput = 'Welcome to Just Meditate. Say begin or specify a duration.';
                reprompt = 'Please specify a duration, or just say begin.';
            } else {
                //isn't the first time, say their level and progress
                speechOutput = 'Welcome to Just Meditate. You\'re ' + (100 - currentMeditation.data.progress) + ' of the way from level ' + (currentMeditation.data.level+1) + '. Say begin or specify a duration.';
                reprompt = 'Please specify a duration, or just say begin.';
            }
            response.ask(speechOutput, reprompt);
        });
    };
    
    intentHandlers.DynamicMeditationIntent = function(intent, session, response) {
        //calculate how long the meditation should be
        storage.loadMeditation(session, function(currentMeditation) {
            
            var level = currentMeditation.data.level;
            var progress = currentMeditation.data.progress;
            var baseTime = 3000 * 60; //3 minutes
            //var minuteInMillis = 60000;
            var calculatedDuration = baseTime + Math.round(100000*(level*Math.log10(level))); //convert from milliseconds to something speakable
            var speechDuration = calculatedDuration;
            var speechText = 'Your meditation will last ' + speechDuration + '. Get comfortable and let\'s begin. 3. <break time=\"1.0s\" /> 2. <break time=\"1.0s\" /> 1. <break time=\"1.0s\" />'; //do a 3 seconds countdown?
            var speechOutput = {
                speech: '<speak>' + speechText + '</speak>',
                type: AlexaSkill.speechOutputType.SSML
            } 
            response.tell(speechOutput);
            window.setTimeout(function (params) {
                var leveled = false;
                progress += (100 / (level + 1));

                if(progress >= 100) {
                    level++;
                    leveled = true;
                    progress = progress - 100;
                }
                //save meditation with new values
                var speechOutputEnd;
                if(leveled) {
                    speechOutputEnd = "Awesome! You reached level " + level + "! Keep it up.";
                } else {
                    speechOutputEnd = 'Great job. You\'re ' + (100 - currentMeditation.data.progress) + ' of the way from level ' + (currentMeditation.data.level+1) + '.';
                }
                response.tell(speechOutputEnd);
            }, calculatedDuration);
        });
    };
    
    intentHandlers.StaticMeditationIntent = function (intent, session, response) {
        //use the duration the user specified
    };
    
    intentHandlers['AMAZON.HelpIntent'] = function (intent, session, response) {
        //ask for help
    };
    
    intentHandlers['AMAZON.CancelIntent'] = function(intent, session, response){
        //cancel the meditation
    };
    
    intentHandlers['AMAZON.StopIntent'] = function (intent, session, response) {
        //stop the skill
        //response.tellWithCard();
    };
}

exports.register = registerIntentHandlers;