const cols = 30;
const rows = 30;
var grid = new Array(cols);
var openSet = [];
var closeSet = [];
var start;
var end;
var w, h;
var path = [];

function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === elt) {
            arr.splice(i, 1);
        }
    }
}

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.nbr = [];
    this.previous = undefined;
    this.wall = false;
    if (random(1) < 0.3) {
        this.wall = true;
    }
    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0);
        }
        noStroke(0);
        rect(w * this.i, h * this.j, w - 1, h - 1);
    }
    this.showstart = function (col) {
        fill(col);
        if (this.wall)
            fill(0);
        noStroke(0);
        rect(w * this.i, h * this.j, w - 1, h - 1);
    }
    this.showend = function (col) {
        fill(col);
        if (this.wall)
            fill(0);
        noStroke(0);
        rect(w * this.i, h * this.j, w - 1, h - 1);
    }
    this.addNbr = function (grid) {
        var i = this.i;
        var j = this.j;
        // if (this.wall) {
        //     continue;
        // }
        if (i + 1 < rows)
            this.nbr.push(grid[i + 1][j]);
        if (i > 0)
            this.nbr.push(grid[i - 1][j]);
        if (j > 0)
            this.nbr.push(grid[i][j - 1]);
        if (j < cols - 1)
            this.nbr.push(grid[i][j + 1]);
        if (i > 0 && j > 0) {
            this.nbr.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < cols - 1) {
            this.nbr.push(grid[i - 1][j + 1]);
        }
        if (i < rows - 1 && j > 0) {
            this.nbr.push(grid[i + 1][j - 1]);
        }
        if (i < rows - 1 && j < cols - 1) {
            this.nbr.push(grid[i + 1][j + 1]);
        }
    }
}
function heuristic(a, b) {
    var x1 = a.i;
    var y1 = a.j;
    var x2 = b.i;
    var y2 = b.j;
    var diff = abs(x1 - x2);
    var diff2 = abs(y1 - y2);
    var l = 0;
    if (diff > diff2) {
        l = diff;
    } else l = diff2;
    // var d=abs(diff-l)+abs(diff2-l);
    // return dist(a.i,a.j,b.i,b.j);
    return l;



    // return d;
}

// *! GRid SEtup start and end
function setup() {
    createCanvas(500, 500);
    console.log("A*");

    w = width / rows;
    h = width / cols;
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            grid[i][j].addNbr(grid);
        }
    }
    start = grid[0][0];
    start.wall = false;
    end = grid[rows - 1][cols - 1];
    end.wall = false;
    openSet.push(start);
    console.log(grid);
}

// !* Path Drawer 
function draw() {

    if (openSet.length > 0) {
        // we can keep going
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];
        if (current === end) {
            noLoop();
            console.log("DONE !!!");
        }
        removeFromArray(openSet, current);
        closeSet.push(current);
        var nbrs = current.nbr;
        for (let i = 0; i < nbrs.length; i++) {
            var nbr = nbrs[i];
            if (closeSet.includes(nbr) || nbr.wall)
                continue;
            var tempG = current.g + 1;
            if (openSet.includes(nbr)) {
                if (tempG < nbr.g)
                    nbr.g = tempG;
            } else {
                nbr.g = tempG;
                openSet.push(nbr);
            }
            nbr.h = heuristic(nbr, end);
            nbr.f = nbr.g + nbr.h;
            nbr.previous = current;
        }
    }
    else {

        for (let i = 0; i < openSet.length; i++) {
            openSet[i].show(color('cyan'));
        }
        for (var i = 0; i < path.length; i++) {
            path[i].show(color('cyan'));

        }
        console.log('NO Path');
        noLoop();
        return;

    }
    background(0);


    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(color(255));
        }
    }
    for (let i = 0; i < closeSet.length; i++) {
        closeSet[i].show(color('cyan'));
    }
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color('yellow'));
    }
    var temp = current;
    path = [];
    path.push(temp);
    while (temp.previous) {
        path.push(temp);
        temp = temp.previous;
    }
    path.push(temp);
    noFill();
    stroke("purple");
    strokeWeight(w / 3);
    beginShape();
    // start.showpath("red");
    // end.showpath("green");
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);

    }
    endShape();

}