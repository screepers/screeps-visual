// jshint esnext: true
// ==UserScript==
// @name         Screeps Visual
// @namespace    https://screeps.com/
// @version      1.0.0
// @author       Adam Shumann, ags131
// @match        https://screeps.com/a/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://github.com/screepers/screeps-visual/raw/master/src/visual.screeps.user.js
// ==/UserScript==

function init() {
    if(!$('section.game').length) return setTimeout(init,100);
    let gameEl = angular.element($('section.game'));
    let Game = gameEl.scope().Game;
    let sock = gameEl.injector().get('Socket');
    sock.unsubscribe(`user:${Game.player}/memory/visual`);
    sock.on(`user:${Game.player}/memory/visual`,function(event){
        let raw = event.edata;
        if(!$('section.room').length) return;
        let roomScope = angular.element($('section.room')).scope();
        let room = roomScope.Room;
        let visuals = typeof raw == "string"?JSON.parse(raw):raw;
        let visual = visuals[room.roomName];
        
        let canvas = $('canvas.visual')[0];

        if(!canvas){
            canvas = document.createElement('canvas');
            canvas.className = 'visual';
            canvas.width = 2500;
            canvas.height = 2500;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            $('div.game-field').append(canvas);
        }
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        visual.forEach(function(v){
            let [cmd,rawargs] = v.split(' ');
            if(cmd == 'setCanvasScale'){
              let size = JSON.parse(rawargs);
              canvas.width = size*50;
              canvas.height = size*50;
              return;
            }
            if(typeof ctx[cmd] == 'function')
              ctx[cmd].apply(ctx,JSON.parse(rawargs));
            else
              ctx[cmd] = rawargs;
        });
    });
}

$(function () {
    // push the load to the end of the event queue
    setTimeout(init);
});