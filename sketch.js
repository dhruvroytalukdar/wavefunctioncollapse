const DIM = 20;
const WIDTH = 750;
const HEIGHT = 750;
let grid = [];
let tiles = [];
let tileImages = [];

function preload() {
  const path = "pipes";
  tileImages[0] = loadImage(`${path}/blank.png`);
  tileImages[1] = loadImage(`${path}/up.png`);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  tiles[0] = new Tile(tileImages[0], [0, 0, 0, 0]);
  tiles[1] = new Tile(tileImages[1], [1, 1, 0, 1]);
  tiles[2] = tiles[1].rotate(1);
  tiles[3] = tiles[1].rotate(2);
  tiles[4] = tiles[1].rotate(3);
  showGrid();
}

function showGrid() {
  let indexList = new Array(tiles.length).fill(0).map((x, i) => i);
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(indexList);
  }
}

function drawGrid() {
  const w = width / DIM;
  const h = height / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].image, i * w, j * h, w, h);
      } else {
        noFill();
        stroke(50);
        rect(i * w, j * h, w, h);
      }
    }
  }
}

function checkValid(collapsedIndex, currIndex, side) {
  return (
    tiles[collapsedIndex].sockets[(side + 2) % tiles[0].sockets.length] ==
    tiles[currIndex].sockets[side]
  );
}

function draw() {
  background(0);

  drawGrid();

  // pick element with minimum entropy and collapse it
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((cell) => cell.collapsed === false);
  gridCopy.sort((a, b) => a.options.length - b.options.length);
  if (gridCopy.length === 0) return;
  let minLen = gridCopy[0].options.length;
  gridCopy = gridCopy.filter((cell) => cell.options.length === minLen);
  let cell = random(gridCopy);

  cell.collapsed = true;
  cell.options = [random(cell.options)];

  // calculate the entropy of the grid
  let nextGrid = [];
  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      let index = i * DIM + j;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let validList = grid[index].options;
        let newList = [];

        // up
        let newIndex = (i - 1) * DIM + j;
        if (i > 0) {
          if (grid[newIndex].collapsed) {
            for (let k = 0; k < validList.length; k++) {
              if (checkValid(grid[newIndex].options[0], validList[k], 0))
                newList.push(validList[k]);
            }
            if (newList.length === 0) {
              showGrid();
              return;
            }
            validList = newList;
            newList = [];
          }
        }

        // down
        newIndex = (i + 1) * DIM + j;
        if (i < DIM - 1) {
          if (grid[newIndex].collapsed) {
            for (let k = 0; k < validList.length; k++) {
              if (checkValid(grid[newIndex].options[0], validList[k], 2))
                newList.push(validList[k]);
            }
            if (newList.length === 0) {
              showGrid();
              return;
            }
            validList = newList;
            newList = [];
          }
        }

        // left
        newIndex = i * DIM + (j - 1);
        if (j > 0) {
          if (grid[newIndex].collapsed) {
            for (let k = 0; k < validList.length; k++) {
              if (checkValid(grid[newIndex].options[0], validList[k], 3))
                newList.push(validList[k]);
            }
            if (newList.length === 0) {
              showGrid();
              return;
            }
            validList = newList;
            newList = [];
          }
        }

        // right
        newIndex = i * DIM + (j + 1);
        if (j < DIM - 1) {
          if (grid[newIndex].collapsed) {
            for (let k = 0; k < validList.length; k++) {
              if (checkValid(grid[newIndex].options[0], validList[k], 1))
                newList.push(validList[k]);
            }
            if (newList.length === 0) {
              showGrid();
              return;
            }
            validList = newList;
            newList = [];
          }
        }

        nextGrid[index] = new Cell(validList);
      }
    }
  }
  grid = nextGrid;
}
