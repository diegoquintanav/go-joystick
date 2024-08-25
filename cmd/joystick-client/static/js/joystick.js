let ws;

function connectWebSocket() {
  const joystickId = document.getElementById("joystick-id").value;
  console.log("joystickId: ", joystickId);

  if (!joystickId) {
    alert("Please enter a Joystick ID");
    return;
  }

  ws = new WebSocket(serverAddr);

  ws.onopen = function () {
    enableControls();
    printToOutput(`(${joystickId}) OPEN`);
  };

  ws.onclose = function () {
    disableControls();
    printToOutput(`(${joystickId}) CLOSE`);
    ws = null;
  };

  ws.onmessage = function (evt) {
    printToOutput(`(${joystickId}) RESPONSE: ${evt.data}`);
  };

  ws.onerror = function (evt) {
    printToOutput(`(${joystickId}) ERROR: ${evt.data}`);
  };
}

function enableControls() {
  document.getElementById("close").disabled = false;
  document.getElementById("close").classList.replace("bg-green-300", "bg-green-500");
  document.getElementById("close").classList.remove("cursor-not-allowed", "opacity-50");

  ["d-up", "d-left", "d-down", "d-right", "action-1", "action-2"].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = false;
    el.classList.replace("bg-blue-300", "bg-blue-500");
    el.classList.replace("bg-green-300", "bg-green-500");
    el.classList.remove("cursor-not-allowed", "opacity-50");
  });
}



function disableControls() {
  document.getElementById("close").disabled = true;
  document.getElementById("close").classList.replace("bg-green-500", "bg-green-300");
  document.getElementById("close").classList.add("cursor-not-allowed", "opacity-50");

  ["d-up", "d-left", "d-down", "d-right", "action-1", "action-2"].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = true;
    el.classList.replace("bg-blue-500", "bg-blue-300");
    el.classList.replace("bg-green-500", "bg-green-300");
    el.classList.add("cursor-not-allowed", "opacity-50");
  });
}

function printToOutput(message) {
  const output = document.getElementById("output");
  const d = document.createElement("div");
  d.textContent = message;
  output.appendChild(d);
  output.scrollTop = output.scrollHeight;
}

function sendCommand(actionMessage, commandSuffix) {
  if (ws) {
    const joystickId = document.getElementById("joystick-id").value;
    printToOutput(`(${joystickId}) ${actionMessage}`);
    ws.send(`${joystickId}${commandSuffix}`);
  }
}

document.getElementById("open").onclick = function () {
  connectWebSocket();
};

document.getElementById("close").onclick = function () {
  if (ws) {
    ws.close();
  }
};

// Function to set user name in the input field
function setUser(username) {
  document.getElementById('joystick-id').value = username;
  document.getElementById('dropdown-menu').classList.add('hidden');  // Hide the dropdown after selection
}

// Toggle the dropdown visibility
document.getElementById('dropdown-button').addEventListener('click', function () {
  let dropdownMenu = document.getElementById('dropdown-menu');
  dropdownMenu.classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', function () {

  const users = [
    { name: 'User1', icon: '/static/img/user1.png' },
    { name: 'User2', icon: '/static/img/user2.png' },
    { name: 'User3', icon: '/static/img/user3.png' },
    { name: 'User4', icon: '/static/img/user4.png' },
    { name: 'User5', icon: '/static/img/user5.png' },
    { name: 'User6', icon: '/static/img/user6.png' },
    { name: 'User7', icon: '/static/img/user7.png' }
  ];

  const userListContainer = document.getElementById('user-list');

  users.forEach(user => {
    const button = document.createElement('button');
    button.className = 'flex flex-col items-center justify-center text-sm text-gray-700 hover:bg-gray-100 p-2 rounded';
    button.onclick = function () {
      setUser(user.name);
    };

    const img = document.createElement('img');
    img.src = user.icon;
    img.alt = user.name;
    img.className = 'w-6 h-6 mb-1';

    const span = document.createElement('span');
    span.textContent = user.name;

    button.appendChild(img);
    button.appendChild(span);
    userListContainer.appendChild(button);
  });

  
  // Add event listeners to the buttons
  // Function to handle button press and release events
  function handleButtonEvent(buttonId, actionMessage, commandSuffix) {
    const button = document.getElementById(buttonId);

    // Event listener for mousedown event
    button.addEventListener('mousedown', function () {
      sendCommand(actionMessage, commandSuffix + "-pressed");
      // Here you can also send a message to a WebSocket or perform other actions
      console.log('Button' + actionMessage + 'Pressed');
    });

    // Event listener for mouseup event
    button.addEventListener('mouseup', function () {
      sendCommand(actionMessage, commandSuffix + "-released");
      // Here you can also send a different message to a WebSocket or perform other actions
      console.log('Button' + actionMessage + 'Released');
    });
  }

  // Add event listeners to the buttons
  handleButtonEvent('d-up', "MOVE: UP", "_move_up");
  handleButtonEvent('d-left', "MOVE: LEFT", "_move_left");
  handleButtonEvent('d-down', "MOVE: DOWN", "_move_down");
  handleButtonEvent('d-right', "MOVE: RIGHT", "_move_right");
  handleButtonEvent('action-1', "ACTION: 1", "_action_1");
  handleButtonEvent('action-2', "ACTION: 2", "_action_2");
});

