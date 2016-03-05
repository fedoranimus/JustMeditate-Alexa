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
        console.log("JustMeditate onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
        
        //speak welcome message and ask user questions
        storage.loadMeditation(session, function (currentMeditation) {
            var speechOutput = 'Welcome to Just Meditate. Say begin to track your progess or just specify a duration',
                reprompt = textHelper.completeHelp;
            //add responses based on state
            
            response.ask(speechOutput, reprompt);
        });
    };
    
    eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
      console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);  
    };
    
    
    
};

exports.register = registerEventHandlers;