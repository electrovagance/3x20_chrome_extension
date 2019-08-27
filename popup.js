// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

// variable for google chrome alarms apo
let COUNTDOWN;
// variable for the setTimeout function
let countDownTimer;

// bool value
let isTimerOn;

// gets countdown display
let displayCountDown = document.getElementById('countDown');

function setAlarm(event) {
  console.log('Set alarm!')
  let minutes = parseFloat(event.target.value);
  chrome.browserAction.setBadgeText({text: 'ON'});
  // add 20 min in milliseconds to current time
  chrome.alarms.create(COUNTDOWN, {when: Date.now() + 1200000});
  chrome.storage.sync.set({minutes: minutes});

  // Save state using the Chrome extension storage API
  chrome.storage.sync.set({'doesTimerExist': true}, function() {
    // Notify that we saved.
    console.log('Set doesTimerExist to true in chrome storage');
  });
  displayTime();
}

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: 'OFF'});
  chrome.alarms.clearAll();
  console.log('Cleared timer!');
  clearTimeout(countDownTimer);
  displayCountDown.innerHTML = '';
}

function displayTime() {
  chrome.storage.sync.get(['doesTimerExist'], function(result) {
    // Notify the return value
    if (result.doesTimerExist === true) timeLeft();
  });

}

function timeLeft() {
  let timeLeftTemp, formattedTime;

  chrome.alarms.get(COUNTDOWN, function(alarm) {
    if (alarm !== undefined) {
      timeLeftTemp = alarm.scheduledTime - new Date().getTime();
      formattedTime = new Date(timeLeftTemp).toISOString().slice(14, -5);
  
      console.log(formattedTime);
      displayCountDown.innerHTML = formattedTime;
    }
    else displayCountDown.innerHTML = 'Did you forget to turn the reminder on?';
  });
}

document.getElementById('sampleSecond').addEventListener('click', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);
document.getElementById('timeLeft').addEventListener('click', timeLeft);
