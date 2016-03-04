/**
 * Examples:
 * Dialog model:
 * 
 * 
 * 
 * One-shot model:
 * User: "Alexa, tell Just Meditate to begin"
 * Alexa: "Get comfortable and ready to meditate for X minutes and Y seconds"
 * 
 * User: "Alexa, Just Meditate for 5 minutes"
 * Alexa: "Get comfortable and ready to meditate for 5 minutes"
 */

'use strict';
var JustMeditate = require('./justMeditate');

exports.handler = function(event, context) {
    var justMeditate = new JustMeditate();
    justMeditate.execute(event, context);
}