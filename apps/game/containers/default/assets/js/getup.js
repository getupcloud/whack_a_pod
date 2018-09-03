// Copyright 2018 GetupCloud. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var GAME_INTERVAL = 300;
var SCORE_INTERVAL = 10;
var PODS_INTERVAL = 500;
var CLOCK_INTERVAL = 100;

var MOLES_ENDPOINT = '192.168.13.37';

var RESET_NUMBER = 57; // it assumes the number 9 resets the pods

var molesStatus = new Array(5).fill('pending', 0);

function restart() {
    location.reload();
}

$(document).keypress(function(e) {
  var key = e.keyCode;

  // is it a number?
  if (key >= 48 && key <= 57) {
    if (key === RESET_NUMBER) {
      console.log('Restarting...');
      $("#restart").click();
    } else {
      var pod = key - 48;
      console.log('Killing pod', pod);
      $("#pod-" + pod + ' div:first').click();
    }
  } else {
    console.log('Key pressed is not a number =', key);
  }
});

function MOLES() {

  var successHandler = function (data) {
    console.log('Pod down: '+ data)
  };

  var errorHandler = function (e, i) {
    console.log('Pod error: '+ e)
  };

  this.Up = function (i, pod) {
    // var items = e.items;
    // var total = items ? items.length : 0;

    if (pod.phase === 'running' && molesStatus[i] !== 'running') {
      console.log('Up: ', i);
      $.post(MOLES_ENDPOINT, { pod: i, val: 1 })
      .done(function(data) { successHandler(data) })
      .fail(function(e) { errorHandler(e)});
    }

    console.log('i: ', i);
    console.log('pod: ', JSON.stringify(pod, null, 2));
  };

  this.KnockDown = function () {
    var i;
    for (i = 0; i <= 8; i++) {
      console.log('Informing pod '+ i +' of shutdown');

      $.post(MOLES_ENDPOINT, { pod: i, val: 0 })
      .done(function(data) { successHandler(data) })
      .fail(function(e) { errorHandler(e)});
    }
  }
};

var moles = new MOLES();