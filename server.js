'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

var rooms = {}

wss.on('connection', (ws) => {
  var room = "";
  console.log('Client connected');
  var firstHit = false
  ws.on('message', function message(data){
    
    if (!firstHit){
      console.log("First data:")
      console.log(data)
      if (!(data in rooms)){
        rooms[data] = new Set()
      }
      rooms[data].add(ws)
      room = data
      firstHit = true

      var msg = "Current online user : " + rooms[room].size
      for (const x of rooms[room]){
        x.send(msg)
      }
    }

    else{
      for (const x of rooms[room]){
        x.send(data)
      }
    }

  })
  
  ws.on('close', () => {
    console.log('Client disconnected')
    rooms[room].delete(ws)
    var msg = "Current online user : " + rooms[room].size
      for (const x of rooms[room]){
        x.send(msg)
      }
  }
  );


});


