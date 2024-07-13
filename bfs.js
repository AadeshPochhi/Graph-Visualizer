const cols = 30;
const rows = 30;
var grid = new Array(cols);
var openSet = [];
var closeSet = [];
var start;
var end;
var w, h;
var path = [];
var visited = [];

class Queue {
    items = []
    enqueue = (item) => this.items.splice(0, 0, item)
    deque = () => this.items.pop()
    isempty = () => this.items.length === 0
    empty = () => (this.items.length = 0)
    size = () => this.items.length
}
var d = 0;
var Q = new Queue();
function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.nbr = [];
    this.previous = undefined;
    this.wall = false;
    if (random(1) < 0.3) {
        this.wall = true;
    }
    this.show = function (col) {
        fill(col);
        if (this.wall)
            fill(0);
        noStroke(0);
        rect(w * this.i, h * this.j, w - 1, h - 1);
    }
    this.showpath = function (col) {
        fill(col);
        if (this.wall)
            fill(0);
        noStroke(0);
        ellipse(w * this.i + w / 2, h * this.j + h / 2, w / 2, h / 2);
    }
    this.addNbr = function (grid) {
        var i = this.i;
        var j = this.j;

        if (j < cols - 1)
            this.nbr.push(grid[i][j + 1]);
        if (i > 0)
            this.nbr.push(grid[i - 1][j]);
        if (j > 0)
            this.nbr.push(grid[i][j - 1]);
        if (i + 1 < rows)
            this.nbr.push(grid[i + 1][j]);

    }
}

function setup() {
    createCanvas(500, 500);
    console.log("BFS");
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
    end = grid[rows - 1][cols - 1];
    start.wall = false;
    end.wall = false;
    visited.push(start);
    Q.enqueue(start);
    console.log(grid);
}

function draw() {

    if (Q.size() > 0) {
        var u = Q.deque();
        //    log(u);
        if (u === end) {

            console.log('Done');
            noLoop();
        }
        var nbrs = u.nbr;
        for (let i = 0; i < nbrs.length; i++) {
            var nbr = nbrs[i];
            if (visited.includes(nbr) || nbr.wall)
                continue;

            visited.push(nbr);
            Q.enqueue(nbr);
            nbr.previous = u;
        }
    } else {
        for (let i = 0; i < visited.length; i++) {
            visited[i].show(color('cyan'));

        }
        noLoop();
        return;
    }
    background(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(color(255));
        }
    }
    for (let i = 0; i < visited.length; i++) {
        visited[i].show(color('cyan'));
        //    d++;
    }
    for (let i = 0; i < Q.items.length; i++) {
        Q.items[i].show(color("yellow"));
    }
    var temp = u;
    path = [];
    path.push(temp);
    while (temp.previous) {
        path.push(temp);
        temp = temp.previous;
    }
    path.push(temp);
    noFill();
    stroke("purple");
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);

    }
    endShape();
    start.showpath("red");
    end.showpath("green");
}


