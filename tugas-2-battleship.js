const form = document.forms[0];
const playerOneField = document.forms[1];
const playerTwoField = document.forms[2];
const numOfSetsFields = form.elements['numSets'];
const saveSettingsBtn = document.getElementById("saveSettings");
const playerOneBtn = document.getElementById("playerOneBtn");
const playerTwoBtn = document.getElementById("playerTwoBtn");
const tableContainer = document.getElementById("board");
const playerOneCurrentScore = document.getElementById("playerOneCurrentScore");
const playerTwoCurrentScore = document.getElementById("playerTwoCurrentScore");
const playerOneSetScore = document.getElementById("playerOneSetScore");
const playerTwoSetScore = document.getElementById("playerTwoSetScore");
const playerOneInput = document.getElementById("playerOneInput");
const playerTwoInput = document.getElementById("playerTwoInput");
const setButton = document.getElementById("setButton");
const gameButton = document.getElementById("gameButton");
const overlayLayer = document.getElementById("overlay");
const setWonCard = document.getElementById("won-the-set");
const gameWonCard = document.getElementById("won-the-game");
const playerOneShipsSunk = document.getElementById("playerOneShipsSunk");
const playerTwoShipsSunk = document.getElementById("playerTwoShipsSunk");
form.onsubmit = () => {return false;};
playerOneField.onsubmit = () => {return false;};
playerTwoField.onsubmit = () => {return false;}

let userSettings = {
  handleSettings: function () {
    let boardSize = form.elements[0].value;
    let shipsAmount = form.elements[1].value;
    let numOfSets;
    let shipLength;
    let setDecided = false;

    // validate input
    if (boardSize === null && shipsAmount === null) {
      alert("You have to give us something to work with.");
      return false;
    } else {
      let validBoardSize;
      let validShipsAmount;

      if (boardSize % 2 === 0 || shipsAmount % 2 === 0) {
        alert(
          "The amount of ships and board size has to be an odd number!"
        );
        return false;
      }

      if (boardSize < 5 || boardSize > 13) {
        validBoardSize = false;
        alert(
          "Invalid input! Please choose a number from 5 to 13 for your board size."
        );
        return false;
      } else {
        validBoardSize = true;
      }

      if (shipsAmount < 1 || shipsAmount > 11) {
        validShipsAmount = false;
        alert(
          "Invalid input! Please choose a number from 1 to 11 for the amount of ships you would like to play with."
        );
        return false;
      } else {
        validShipsAmount = true;
      }

      // Check radio button inputs
      for (let i = 0; i < numOfSetsFields.length; i++) {
        if (numOfSetsFields[i].checked == true) {
          numOfSets = numOfSetsFields[i].value;
          setDecided = true;
        }
      }
      // none of the radio buttons are checked
      if (!setDecided) {
        alert("Please specify how many sets you would like to play.");
        return;
      }

      if (validBoardSize === true && validShipsAmount === true) {
        if (boardSize == 5) {
          shipLength = 1;
        } else if (boardSize == 7 || boardSize == 9) {
          shipLength = 2;
        } else if (boardSize == 11 || boardSize == 13) {
          shipLength = 3;
        }
        model.updateModel(boardSize, shipsAmount, shipLength, numOfSets);

        model.generateBoard();
        model.setupShips();
        model.generateShips();
        view.disableUserSettings();
      } else {
        alert("Invalid input! Please try again and read our guide.");
        return false;
      }
    }
  },
};

let view = {
  displayHit: function(guessObj) {
    let guessVal = guessObj.value;
    let guessedBy = guessObj.playerNum;
    let tableCellToDisplay = document.getElementById(guessVal);
    if (guessedBy == 1) {
      tableCellToDisplay.classList.add("hit-player-one");
      tableCellToDisplay.style.color = "transparent"
      return;
    } else {
      tableCellToDisplay.classList.add("hit-player-two");
      tableCellToDisplay.style.color = "transparent";
      return;
    }
  },
  
  displayMiss: function(guessObj) {
    let guessVal = guessObj.value;
    let guessedBy = guessObj.playerNum;
    let tableCellToDisplay = document.getElementById(guessVal);
    if (guessedBy == 1) {
      tableCellToDisplay.classList.add("miss-player-one");
      tableCellToDisplay.style.color = "transparent";

      return;
    } else {
      tableCellToDisplay.classList.add("miss-player-two");
      tableCellToDisplay.style.color = "transparent";
      return;
    }
  },

  displayScore: function(playerNum, updatedScore) {
    if (playerNum == 1) {
      playerOneCurrentScore.innerHTML = updatedScore;
    } else {
      playerTwoCurrentScore.innerHTML = updatedScore;
    }
  },

  updateSetScore: function(playerNum, setScore) {
    if (playerNum == 1) {
      playerOneSetScore.lastElementChild.innerHTML = setScore;
    } else if (playerNum == 2) {
      playerTwoSetScore.lastElementChild.innerHTML = setScore;
    }
  },

  disableUserSettings: function() {
    let boardSizeSettings = form.elements[0];
    let shipsAmountSettings = form.elements[1];
    saveSettingsBtn.disabled = true;
    boardSizeSettings.disabled = true;
    shipsAmountSettings.disabled = true;
    for (let i = 0; i < numOfSetsFields.length; i++) {
      numOfSetsFields[i].disabled = true;
    }
    return;
  },

  displaySetWinner: function(playerNum, score) {
    overlayLayer.style.display = "initial";
    setWonCard.style.display = "initial";
    setWonCard.firstElementChild.innerHTML = "Player " + playerNum + " has won the set!";
    let playerOneScore = score.playerOne;
    let playerTwoScore = score.playerTwo;
    setWonCard.children[2].innerHTML = playerOneScore +  " - " + playerTwoScore;
  },

  displayGameWinner: function(playerNum, setScore) {
    overlayLayer.style.display = 'initial';
    gameWonCard.style.display = 'initial';
    gameWonCard.firstElementChild.innerHTML = "Player " + playerNum + " has won the game!";
    let playerOneSetScore = setScore.setPlayerOne;
    let playerTwoSetScore = setScore.setPlayerTwo;
    gameWonCard.children[4].innerHTML = playerOneSetScore + " - " + playerTwoSetScore;
  },
};

let controller = {
  handleFirePlayerOne: function () {
    let gridLocs = model.allLocations;
    let playerOneGuessObj = {
      playerNum: 1,
      value: playerOneInput.value,
    };

    if (gridLocs.indexOf(playerOneGuessObj.value) >= 0) {
      model.fire(playerOneGuessObj);
    } else {
      alert("Invalid input! Your guess is not on this board.");
    }
  },

  handleFirePlayerTwo: function() {
    let gridLocs = model.allLocations;
    let playerTwoGuessObj = {
      playerNum: 2,
      value: playerTwoInput.value
    };
    if (gridLocs.indexOf(playerTwoGuessObj.value) >= 0) {
      model.fire(playerTwoGuessObj);
    } else {
      alert("Invalid input! Your guess is not on this board.");
    }
  }
};

let model = {
  allLocations: [],
  shipsSunk: 0,
  shipsSunkBy: {
    playerOne: 0,
    playerTwo: 0
  },
  numShips: 0,
  shipLength: 0,
  boardSize: 0,
  numOfSets: 0,
  hitScore: 0,
  setScore: {
    setPlayerOne: 0,
    setPlayerTwo: 0
  },
  currentScore: {
    playerOne: 0,
    playerTwo: 0
  },

  ships: [],

  updateModel: function(boardSize, shipsAmount, shipLength, numOfSets) {
    this.boardSize = boardSize;
    this.numShips = shipsAmount;
    this.shipLength = shipLength;
    this.numOfSets = numOfSets;
  },

  changeTurns: function(playerNum) {
    // do something here
    if (playerNum == 1) {
      playerTwoInput.disabled = false;
      playerTwoBtn.disabled = false;
      playerOneInput.disabled = true;
      playerOneBtn.disabled = true;
      return;
    } else {
      playerOneInput.disabled = false;
      playerOneBtn.disabled = false;
      playerTwoInput.disabled = true;
      playerTwoBtn.disabled = true;
      return;
    }
  },

  fire: function (guessObj) {
    // fire a battleship
    let currentShip;
    let index;

    for (let i = 0; i < this.numShips; i++) {
      currentShip = this.ships[i];
      index = currentShip.locations.indexOf(guessObj.value);

      if (index >= 0) {
        // player guessed correctly
        if (currentShip.hits[index] === 'hit') {
          alert("You've already hit this ship! Try other locations!");
          return;
        } else {
          currentShip.hits[index] = "hit";
          view.displayHit(guessObj);
          this.addPlayerScore(guessObj.playerNum);
          this.changeTurns(guessObj.playerNum);
          if (this.shipLength == 1) {
            this.shipsSunk++;
            if (guessObj.playerNum == 1) {
              this.shipsSunkBy.playerOne++;
              playerOneShipsSunk.innerHTML = "Player 1 : " + this.shipsSunkBy.playerOne;
            } else {
              this.shipsSunkBy.playerTwo++;
              playerTwoShipsSunk.innerHTML = "Player 2 : " + this.shipsSunkBy.playerTwo;
            }
          } else if (this.shipLength == 2) {
            this.shipsSunk += 0.5;
            if (guessObj.playerNum == 1) {
              this.shipsSunkBy.playerOne++;
              playerOneShipsSunk.innerHTML = "Player 1 : " + this.shipsSunkBy.playerOne;
            } else {
              this.shipsSunkBy.playerTwo++;
              playerTwoShipsSunk.innerHTML = "Player 2 : " + this.shipsSunkBy.playerTwo;
            }
          } else {
            this.shipsSunk += 0.34;
            if (guessObj.playerNum == 1) {
              this.shipsSunkBy.playerOne++;
              playerOneShipsSunk.innerHTML = "Player 1 : " + this.shipsSunkBy.playerOne;
            } else {
              this.shipsSunkBy.playerTwo++;
              playerTwoShipsSunk.innerHTML = "Player 2 : " + this.shipsSunkBy.playerTwo;
            }
          }

          if (this.shipsSunk >= this.numShips) {
            if (this.currentScore.playerOne > this.currentScore.playerTwo) {
              this.setScore.setPlayerOne++;
              view.updateSetScore(1, this.setScore.setPlayerOne);
              view.displaySetWinner(1, this.currentScore);
              setButton.onclick = () => {
                this.resetBoardAndSet();
                overlayLayer.style.display = "none";
                setWonCard.style.display = "none";
                if (
                  this.numOfSets ==
                  this.setScore.setPlayerOne +
                    this.setScore.setPlayerTwo
                ) {
                  if (
                    this.setScore.setPlayerOne >
                    this.setScore.setPlayerTwo
                  ) {
                    view.displayGameWinner(1, this.setScore);
                    gameButton.onclick = () => {
                      location.reload();
                    }
                  } else {
                    view.displayGameWinner(2, this.setScore);
                    gameButton.onclick = () => {
                      location.reload();
                    };
                  }
                }
                return false;
              }
              return;
            } else {
              this.setScore.setPlayerTwo++;
              view.updateSetScore(2, this.setScore.setPlayerTwo);
              view.displaySetWinner(2, this.currentScore);
              setButton.onclick = () => {
                this.resetBoardAndSet();
                overlayLayer.style.display = "none";
                setWonCard.style.display = "none";
                if (this.numOfSets == this.setScore.setPlayerOne + this.setScore.setPlayerTwo) {
                  if (
                    this.setScore.setPlayerOne >
                    this.setScore.setPlayerTwo
                  ) {
                    view.displayGameWinner(1, this.setScore);
                    gameButton.onclick = () => {
                      location.reload();
                    };
                  } else {
                    view.displayGameWinner(2, this.setScore);
                    gameButton.onclick = () => {
                      location.reload();
                    };
                  }
                }
                return false;
              }
              return;
            }
          }
          return true;
        }
      }
    }
    // player missed the guess
    view.displayMiss(guessObj);
    this.changeTurns(guessObj.playerNum);
    return false;
  },

  addPlayerScore: function (playerNum) {
    if (playerNum == 1) {
      this.currentScore.playerOne += this.hitScore;
      view.displayScore(1, this.currentScore.playerOne);
    } else {
      this.currentScore.playerTwo += this.hitScore;
      view.displayScore(2, this.currentScore.playerTwo);
    }
  },

  resetBoardAndSet: function () {
    this.generateBoard();
    this.shipsSunk = 0;
    this.shipsSunkBy = {
      playerOne: 0,
      playerTwo: 0,
    }
    playerOneShipsSunk.innerHTML = "Player 1 : 0";
    playerTwoShipsSunk.innerHTML = "Player 2 : 0";
    this.currentScore.playerOne = 0;
    this.currentScore.playerTwo = 0;
    view.displayScore(1, 0);
    view.displayScore(2, 0);
    this.setupShips();
    this.generateShips();
  },

  generateBoard: function() {
    // Reset all current settings
    const currentTable = document.getElementById("tableBoard");

    while (currentTable.firstChild) {
      currentTable.removeChild(currentTable.firstChild);
    };

    let newTableHeader = document.createElement("th");
    newTableHeader.innerHTML = "BATTLESHIPS BOARD";
    currentTable.appendChild(newTableHeader)
    // Divider

    let tableHeader = document.querySelector("th");
    tableHeader.colSpan = this.boardSize;

    for (let i = 0; i < this.boardSize; i++) {
      var newTableRow = document.createElement("tr");
      for (let j = 0; j < this.boardSize; j++){
        var newTableData = document.createElement("td");
        newTableData.setAttribute("id", i + "" + j);
        newTableData.innerHTML = "<center>" +
        "" + i + "" + j + "" + "</center>";
        this.allLocations.push(i + "" + j);
        newTableRow.appendChild(newTableData);
      }
      currentTable.appendChild(newTableRow)
    }
  },

  setupShips: function() {
    this.ships = [];
    let shipObj;
    for (let i = 0; i < this.numShips; i++) {
      shipObj = {
        locations: [],
        hits: [],
        player: 1
      };
      for (let j = 0; j < this.shipLength; j++) {
        shipObj.locations.push(0);
        shipObj.hits.push("");
      }
      this.ships.push(shipObj)
    }
  },

  generateShips: function () {
    // decide how much points to add to score if you correctly guess a ship location
    if (this.shipLength == 1) {
      this.hitScore = 30;
    } else if (this.shipLength == 2) {
      this.hitScore = 20;
    } else if (this.shipLength == 3) {
      this.hitScore = 10;
    }
    // generate ships based on numShips
    let shipLocations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        shipLocations = this.generateShipLocations(this.ships[i]);
      } while (this.isCollision(shipLocations));

      this.ships[i].locations = shipLocations;
    }
    // Test print statement
    console.log("ships are generated:");
    for (let j = 0; j < this.numShips; j++) {
      console.log(this.ships[j].locations[0]);
    };
    // Test print statement
  },

  generateShipLocations: function() {
    // generate ship locations based on shipLength
    let row = Math.floor(Math.random() * this.boardSize);
    let column = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    let shipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      shipLocations.push(row + "" + (column + i));
    }

    return shipLocations;
  },

  isCollision: function (shipLocations) {
    // Check if any of the ship's location can collide with other ships' locations
    for (let i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (let j = 0; j < shipLocations.length; j++) {
        if (ship.locations.indexOf(shipLocations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
}

playerOneBtn.onsubmit = () => {
  return false;
};
saveSettingsBtn.onclick = userSettings.handleSettings;
playerOneBtn.onclick = controller.handleFirePlayerOne;
playerTwoBtn.onclick = controller.handleFirePlayerTwo;