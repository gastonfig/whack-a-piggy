import io from 'socket.io-client';
import { piggySnort, ohNo, blop, whenSoundsLoad } from './modules/sounds';
import { randomInt } from './modules/utils';
import { classes, socketPort, timeoutTimes } from './modules/constants';

const css = require('./styles/main.scss');

import piggySvg from './images/piggy.svg';
import xSvg from './images/x.svg';

const socket = io.connect(`http://localhost:${socketPort}`);

const body = document.querySelector('body');
const circles = document.querySelectorAll('.circleItem');
const circlesList = Array.from(circles);
const circlesMap = [
  { index: 0, color: 'orange'},
  { index: 1, color: 'purple'},
  { index: 2, color: 'crimson'},
  { index: 3, color: 'darkblue'},
];

let isRunning = false;
let randomCircle = null;
let prevSelection = null;

const timeouts = {
  onHitTimeout: undefined,
  selectTimeout: undefined,
  hitAction: undefined,
};

const getRandCircleIndex = () => {
  const randomIndex = randomInt(0, 3);

  if (prevSelection === randomIndex) {
    // Try again if we get a repeat
    getRandCircleIndex();
    return;
  } else {
    randomCircle = randomIndex;
    prevSelection = randomCircle;
  }
}

const selectCircle = () => {
  getRandCircleIndex();

  circlesList.map((circle, i) => {
    if (i === randomCircle) {
      circle.classList.add(classes.SELECTED);
      blop.start();
    } else {
      circle.classList.remove(classes.SELECTED);
    }
  });

  clearTimeout(timeouts.selectTimeout);

  // Prevents hits before animation finishes
  timeouts.selectTimeout = setTimeout(() => {
    isRunning = false;
  }, timeoutTimes.selectCircle);
}

const toggleCircle = (circleIndex, isSelected, circleClass, sound) => {
  const circle = circlesList[circleIndex];

  if (isSelected) {
    circle.classList.add(circleClass);
    body.classList.add(circleClass);
    sound.start();
  } else {
    circle.classList.remove(circleClass);
    body.classList.remove(circleClass);
  }
}

const hitAction = (index, isCorrect) => {
  const circleClass = isCorrect ? classes.CORRECT : classes.WRONG;
  const sound = isCorrect ? piggySnort : ohNo;
  toggleCircle(index, true, circleClass, sound);

  clearTimeout(timeouts.hitAction);

  timeouts.hitAction = setTimeout(() => {
    toggleCircle(index, false, circleClass, sound);
  }, timeoutTimes.restart);
}

const onHit = (i) => {
  const index = circlesMap[i].index;

  console.log(index)

  if (isRunning) { return; };

  let isHitCorrect = null;

  isRunning = true;

  if (index === randomCircle) {
    isHitCorrect = true;
    hitAction(index, true);
  } else {
    isHitCorrect = false;
    hitAction(index, false);
  }

  clearTimeout(timeouts.onHitTimeout);

  timeouts.onHitTimeout = setTimeout(() => {
    selectCircle();
  }, timeoutTimes.restart);
}

// INIT
whenSoundsLoad(selectCircle);

socket.on('knock', function (data) {
  onHit(data);
});

circlesList.map((circle, i) => {
  const circleClass = circlesMap[i].color;

  circle.classList.add(circleClass);
  circle.addEventListener('click', () => {
    buttonClick(i);
  });
});

const buttonClick = (i) => {
  onHit(i);
}
