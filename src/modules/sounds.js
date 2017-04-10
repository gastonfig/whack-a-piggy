import Tone from 'tone';

export const piggySnort = new Tone.Player({
  'url' : '/sounds/piggy-snort.wav'
}).toMaster();

export const ohNo = new Tone.Player({
  'url' : '/sounds/oh-no.wav'
}).toMaster();

export const blop = new Tone.Player({
  'url' : '/sounds/blop.wav'
}).toMaster();

export const whenSoundsLoad = (callback) => {
  Tone.Buffer.on('load', () => {
    callback();
  });
}
