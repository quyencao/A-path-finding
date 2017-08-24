var cols = 50;
var rows = 50;
var w, h;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;

var path = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if(random(1) < 0.4) {
        this.wall = true;
    }
    
    this.show = function (col) {
        var x = this.i * w;
        var y = this.j * h;

        fill(col);

        if(this.wall) {
            fill(0);
        }

        rect(x, y, w - 1, h - 1);
    };

    this.addNeighbors = function (grid) {
        var x = this.i;
        var y = this.j;

        if(y > 0) {
            this.neighbors.push(grid[x][y - 1]);
        }
        if(x < cols - 1) {
            this.neighbors.push(grid[x + 1][y]);
        }
        if(y < rows - 1) {
            this.neighbors.push(grid[x][y + 1]);
        }
        if(x > 0) {
            this.neighbors.push(grid[x - 1][y]);
        }

        // More neighbor
        if(x > 0 && y > 0) {
            this.neighbors.push(grid[x - 1][y - 1]);
        }

        if(x < cols - 1 && y > 0) {
            this.neighbors.push(grid[x + 1][y - 1]);
        }

        if(x < cols - 1 && y < rows - 1) {
            this.neighbors.push(grid[x + 1][y + 1]);
        }

        if(x > 0 && y < rows - 1) {
            this.neighbors.push(grid[x - 1][y + 1]);
        }
    };
}

function heuristic(neighbor, end) {
    var d = abs(neighbor.i - end.i) + abs(neighbor.j - end.j);
    return d;
}

function setup() {
    createCanvas(600, 600);

    // Do rong cua col va row
    w = width / cols;
    h = height / rows;

    for(var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // grid[i][j] => i column, j row

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols-1][cols -1];
    start.wall = false;
    end.wall = false;

    openSet.push(start);

    //console.log(grid);
}

function draw() {
    background(51);

    if(openSet.length > 0) {

        var lowestIndex = 0;
        for(var i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var current = openSet[lowestIndex];

        if(current === end) {
            console.log('DONE!!!');

            noLoop();
        }

        openSet.splice(lowestIndex, 1); // Remove current in openset
        closedSet.push(current);

        var neighbors = current.neighbors;

        for(var i = 0; i < neighbors.length; i++) {

            var neighbor = neighbors[i];

            if(!_.includes(closedSet, neighbor) && !neighbor.wall) {

                if (abs(current.i - neighbor.i) === 1 &&
                    abs(current.j - neighbor.j) === 1) {
                    var tempG = current.g + 1.5;
                } else {
                    var tempG = current.g + 1;
                }
                // if(!_.includes(openSet, neighbor)) {
                //     openSet.push(neighbor);
                // }
                //
                // if(tempG >= neighbor.g) {
                //     continue;
                // }
                //
                // neighbor.previous = current;
                // neighbor.g = tempG;
                // neighbor.f = neighbor.g + heuristic(neighbor, end);

                if(!_.includes(openSet, neighbor)) {

                    neighbor.g = tempG;
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                    openSet.push(neighbor);

                } else {

                    if(tempG < neighbor.g) {
                        neighbor.g = tempG;
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }

                }

            }

        }

    } else {

        // No solution
        console.log('No solution');
        noLoop();
        showColor();
        return;
    }

    showColor();

    // Find the path
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }


    for(var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}

function showColor() {
    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    for(var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for(var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }
}