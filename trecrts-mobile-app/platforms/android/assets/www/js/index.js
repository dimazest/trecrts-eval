/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
          };
        return t;
        }(document, "script", "twitter-wjs"));


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log(id)
        console.log(window.plugins)
        var pushNotification = window.plugins.pushNotification;
        console.log(pushNotification)
        pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"412241308284","ecb":"app.onNotificationGCM"});
/*        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/
        //twttr.ready(function(twttr){
            //twttr.widgets.createTweet("633740686290874369",document.getElementById('tweet'),{});
            //$('#tweet').append("Is this tweet relevant to the information need? <button class='judge rel'>&#10004</button><button class='judge nrel'>&#10008</button>");
        //});
        console.log('Received Event: ' + id);
    },
    removeTweet : function(tweetid,rel){
        $("#div"+tweetid).remove();
        $.ajax({
            type: "POST",
            url: "http://lab.roegiest.com:33334/judge/"+tweetid+"/"+rel
        });
    },
    addTweet : function (tweetid){
        $("#tweets").append('<div id="div'+tweetid+'"></div>');
        twttr.widgets.createTweet(tweetid,document.getElementById('div'+tweetid),{})
        .then(function(){
            $("#div"+tweetid).append('Is this tweet relevant to the information need?');
            var relb = $('<button/>',{
                text: "\u2714",
                id:'rel'+tweetid,
                class: "judge rel",
                click: function(){app.removeTweet(tweetid,1);}
            });
            var nrelb = $('<button/>',{
                text: "\u2718",
                id:'rel'+tweetid,
                class: "judge nrel",
                click: function(){app.removeTweet(tweetid,-1);}
            });
            $("#div"+tweetid).append(relb); //'<button id="rel'+tweetid+'" class="judge rel">&#10004</button>');
            $("#div"+tweetid).append(nrelb); //'<button id="nrel'+tweetid+'" class="judge nrel">&#10008</button>');
/*            $("#rel"+tweetid).click(function(){
                app.removeTweet(tweetid,1);
            });
            $("#nrel"+tweetid).click(function(){
                app.removeTweet(tweetid,1);
            });*/
        });
    },
    successHandler: function(result) {
       // alert('Callback Success! Result = '+result);
    },
    errorHandler:function(error) {
        alert("Error found: " + error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    //alert('registration id = '+e.regid);
                    $.ajax({
                        type: "POST",
                        url: "http://lab.roegiest.com:33334/register",
                        data: JSON.stringify({"regid" : e.regid}),
                        contentType : "application/json",
                        dataType: "json"
                    }).fail(function(obj,err,thrown){
                        alert(err + " " + thrown);
                    });
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
              //twttr.widgets.createTweet(e.payload.tweetid,document.getElementById('tweet'),{});
              app.addTweet(e.payload.tweetid);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
    }
};

