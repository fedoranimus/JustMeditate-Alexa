'use strict';
var AWS = require("aws-sdk");

var storage = (function () {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'}); //what api version should I use?
    
    /*
    * The Meditation class stores all meditation states for the user
    */
    function Meditation(session, data) {
        if (data) {
            this.data = data;
        } else {
            this.data = {
                level: 1,
                progress: 0
            };
        }
        this._session = session;
    }
    
    Meditation.prototype = {
        save: function (callback) {
            //save the meditation information
            this._session.attributes.currentMeditation = this.data;
            dynamodb.putItem({
                TableName: 'JustMeditateUserData',
                Item: {
                    UserKey: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    }
                }
            }, function(err, data) {
                if(err) {
                    console.log(err, err.stack);
                }
                if(callback) {
                    callback();
                }
            });
        }
    }
    
    return {
        loadMeditation: function(session, callback) {
            //load meditation information
            if(session.attributes.currentMeditation) {
                console.log('get meditation from session=' + session.attributes.currentMeditation);
                callback(new Meditation(session, session.attributes.currentMeditation));
                return;
            }
            dynamodb.getItem({
                TableName: 'JustMeditateUserData',
                Key: {
                    UserKey: {
                        S: session.user.userId
                    }
                }
            }, function (err, data) {
                var currentMeditation;
                if(err) {
                    console.log(err, err.stack);
                    currentMeditation = new Meditation(session);
                    session.attributes.currentMeditation = currentMeditation.data;
                    callback(currentMeditation);
                } else if(data.Item === undefined) {
                    currentMeditation = new Meditation(session);
                    session.attributes.currentMeditation = currentMeditation.data;
                    callback(currentMeditation);
                } else {
                    console.log('get meditation from dynamodb=' + data.Item.Data.S);
                    currentMeditation = new Meditation(session, JSON.parse(data.Item.Data.S));
                    session.attributes.currentMeditation = currentMeditation.data;
                    callback(currentMeditation);
                }
            });
        },
        newMeditation: function(session) {
            return new Meditation(session);
        }
    }
})();
module.exports = storage;