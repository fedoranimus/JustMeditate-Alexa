'use strict'

var storage = require('./storage'),
    textHelper = require('./textHelper');
    
var registerEventHandlers = function(eventHandlers, skillContext) {
    eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
        //if user said a one shot command that triggered an intent event,
        //it will start a new session, and then we should avoid speaking too many words.
        skillContext.needMoreHelp = false;
    };
    
    eventHandlers.onLaunch = function (launchRequest, session, response) {
        //speak welcome message and ask user questions
        storage.loadMeditation(session, function (currentMeditation) {
            var speechOutput = '',
                reprompt;
            //add responses based on state
        });
    };
};

exports.register = registerEventHandlers;