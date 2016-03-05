'use strict'
var AlexaSkill = require('./AlexaSkill'),
    eventHandlers = require('./eventHandlers'),
    intentHandlers = require('./intentHandlers');
    
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var skillContext = {};

var JustMeditate = function() {
    AlexaSkill.call(this, APP_ID);
    skillContext.needMoreHelp = true;
}

JustMeditate.prototype = Object.create(AlexaSkill.prototype);
JustMeditate.prototype.constructor = JustMeditate;

eventHandlers.register(JustMeditate.prototype.eventHandlers, skillContext);
intentHandlers.register(JustMeditate.prototype.intentHandlers, skillContext);

module.exports = JustMeditate;