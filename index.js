class Game {
  constructor() {
    this.size = 30;
    const rows = this.size / 5;
    this.grid = [];
    for (let row = 0; row < rows; row++) {
      const rowArr = [];
      for (let cell = 0; cell < 5; cell++) {
        const tile = new Tile(0);
        rowArr.push(tile);
      }
      this.grid.push(rowArr);
    }
    this.time = 1;
  }
  checkIfGameOver() {
    if (this.time === this.size / 5) {
      document.getElementById("game-over-score").innerText = document
        .getElementById("score")
        .innerText.split("Score:")[1];
      document.getElementById("modal").classList.remove("hidden");
    }
    this.time += 1;
  }
  getNewRow() {
    const newCell = [];
    for (let cell = 0; cell < 5; cell++) {
      const tile = new Tile(Math.ceil(Math.random() * 8 + 1), true);
      newCell.push(tile);
    }

    this.grid.pop();
    this.grid.unshift(newCell);
  }
  paintBox() {
    const rows = this.size / 5;
    const gridBox = document.getElementById("tile-box");
    gridBox.innerHTML = null;
    for (let row = 0; row < this.grid.length; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (let cell = 0; cell < this.grid[row].length; cell++) {
        const cellDiv = document.createElement("div");
        const id = `${row} ${cell}`;
        cellDiv.id = id;
        this.grid[row][cell].setId(id);
        cellDiv.onclick = this.grid[row][cell].onSelect.bind(
          this.grid[row][cell]
        );
        cellDiv.innerText = this.grid[row][cell].txt;
        if (this.grid[row][cell].isSelected) {
          cellDiv.classList.add("selected");
        }
        cellDiv.classList.add("box");

        rowDiv.appendChild(cellDiv);
      }
      gridBox.appendChild(rowDiv);
    }
  }
  adjustBoard() {
    let noOfLeadingEmptyLeadingRow = 0;
    for (let row = 0; row < this.time; row++) {
      let noOfLeadingEmptyLeadingCell = 0;
      for (let cell = 0; cell < this.grid[row].length; cell++) {
        if (
          this.grid[row][cell].isSelected ||
          !this.grid[row][cell].isRendered
        ) {
          this.grid[row][cell].onDestroy();
          noOfLeadingEmptyLeadingCell += 1;
        } else {
          noOfLeadingEmptyLeadingCell = 0;
        }
      }
      if (noOfLeadingEmptyLeadingCell === this.grid[row].length) {
        noOfLeadingEmptyLeadingRow += 1;
      } else {
        noOfLeadingEmptyLeadingRow = 0;
      }
    }

    if (noOfLeadingEmptyLeadingRow >= 1) {
      this.time -= noOfLeadingEmptyLeadingRow.toFixed(0);
    }
  }
}
class ScoreBoard {
  constructor() {
    this.score = 0;
    this.curr = 0;
    this.target = 0;
  }
  createTarget() {
    this.target = Math.ceil(Math.random() * 58 + 1);
  }
  addToCurr(val) {
    this.curr += val;
  }
  checkIfWon() {
    if (this.curr === this.target) {
      this.score += 10;
      this.createTarget();
      this.curr = 0;
      game.adjustBoard();
    }

    this.render();
  }
  render() {
    console.log("200", 2000);
    document.getElementById("target").innerText = `Target: ${this.target}`;
    document.getElementById("score").innerText = `Score: ${this.score}`;
    document.getElementById("curr").innerText = `Current: ${this.curr}`;
  }
}
let score = null;
let game = null;
class Tile {
  constructor(txt, render) {
    this.isSelected = false;
    this.txt = txt;
    this.isRendered = render;
  }
  onSelect() {
    if (!this.isRendered) {
      return;
    }
    this.isSelected = !this.isSelected;
    if (this.isSelected) {
      score.addToCurr(this.txt);
      document.getElementById(this.id).classList.add("selected");
    } else {
      score.addToCurr(-this.txt);
      document.getElementById(this.id).classList.remove("selected");
    }

    score.checkIfWon();
  }
  setId(id) {
    this.id = id;
  }
  onDestroy() {
    this.txt = 0;
    this.onSelect();
    this.isRendered = false;
    this.render();
  }
  render() {
    document.getElementById(this.id).innerText = this.txt;
  }
}
let intervalId = null;
const start = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  document.getElementById("modal").classList.add("hidden");
  game = new Game();
  score = new ScoreBoard();
  game.getNewRow();
  game.paintBox();
  score.createTarget();
  score.render();
  intervalId = setInterval(() => {
    console.log("intervalId", intervalId);
    game.checkIfGameOver();
    game.getNewRow();
    game.paintBox();
  }, 10000);
};