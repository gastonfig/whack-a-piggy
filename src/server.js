const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Johnny-five setup
const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function () {
  const globalFreq = 40;

  // Init Sensors
  const sensors = new five.Sensors([
    {
      pin: 'A0',
      freq: globalFreq,
    },
    {
      pin: 'A1',
      freq: globalFreq,
    },
    {
      pin: 'A2',
      freq: globalFreq,
    },
    {
      pin: 'A3',
      freq: globalFreq,
    },
  ]);

  sensorsPlaying = [
    false,
    false,
    false,
    false,
  ];

  io.on('connection', (socket) => {
    sensors.on("change", (sensor) => {
      const {
        pin,
        scaleTo,
        value,
      } = sensor;

      const sensorValue = sensor.scaleTo(0, 180);

      if (sensorValue >= 5 && !sensorsPlaying[pin]) {
        console.log(`${pin}: ${value}`);
        sensorsPlaying[pin] = true;

        socket.emit('knock', pin);
      } else {
        sensorsPlaying[pin] = false;
      }
    });
  });
});

app.use('/public', express.static(`${__dirname}/public`));
app.get('/', (req, res) => {
  res.redirect('/public/index.html');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
