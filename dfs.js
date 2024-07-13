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
var next_to_visited = [];

//? Defining the spot 
class Stack {
    constructor() {
        this.data = [];
        this.top = 0;
    }
    push(element) {
        this.data[this.top] = element;
        this.top = this.top + 1;
    }
    length() {
        return this.top;
    }
    peek() {
        return this.data[this.top - 1];
    }
    isEmpty() {
        return this.top === 0;
    }
    pop() {
        if (this.isEmpty() === false) {
            this.top = this.top - 1;
            return this.data.pop(); // removes the last element
        }
    }
}
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
        if (this.wall) {
            fill(0);
        }
        noStroke(0);
        rect(w * this.i, h * this.j, w - 1, h - 1);
    }
    this.showpath = function (col) {
        fill(col);
        if (this.wall)
            fill(0);

        noStroke(0);
        ellipese(w * this.i + w / 2, h * this.j + h / 2, w / 2, h / 2);
    }
    this.addNbr = function (grid) {

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
var St = new Stack();
function setup() {
    createCanvas(500, 500);
    w = (width / rows);
    h = (height / cols);
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
    }
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
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
    St.push(start);
    start.wall = false;
    end.wall = false;


}
function draw() {

    if (St.length) {
        var u = St.pop();
        // u.show(color(0, 0, 255));
        var temp = u;
        path = [];
        while (temp) {
            path.push(temp);
            temp = temp.previous;
        }

        if (u == end) {
            noLoop();
            return;
        }
        next_to_visited = [];
        if (visited.includes(u) == false) {
            visited.push(u);
            var nbrs = u.nbr;
            for (var i = 0; i < nbrs.length; i++) {
                var nbrit = nbrs[i];
                if (visited.includes(nbrit) || nbrit.wall == true) {
                    continue;
                }
                nbrit.previous = u;
                next_to_visited.push(u);
                St.push(nbrit);
            }
        }
        for (var i = 0; i < St.length; i++) {
            St[i].show(color(0));
        }
    } else {
        console.log("NO Solution");
        noLoop();
        return;
    }
    background(0);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(color(255));

        }
    }
    for (var i = 0; i < visited.length; i++) {
        visited[i].show(color('yellow'));
        end.show(color(0, 225, 0));
        start.show('purple');
    }
    for (var i = 0; i < next_to_visited.length; i++) {
        next_to_visited[i].show(color(255, 0, 0));
    }
    noFill();
    stroke("purple");
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);

    }
    endShape();


}