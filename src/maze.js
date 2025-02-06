import man from "./asset/man.gif";

const manImage = new Image();
manImage.src = man;
manImage.onload = () => {
    console.log("manImage loaded");
}

function Maze(n, canvas, successCallback) {
    this.n = n;
    this.canvas = canvas;
    this.maze = new Array(n);
    this.manLocation = {x : 0, y : 1};
    this.initData();
    this.initKeyBoard(successCallback);
}

Maze.prototype.size = function() {
    return this.n;
}

Maze.prototype.setSize = function(n) {
    return this.n = n;
}

Maze.prototype.setManLocation = function(x, y) {
    this.maze[this.manLocation.x][this.manLocation.y].hasMan = false;
    this.manLocation = {x, y};
    this.maze[this.manLocation.x][this.manLocation.y].hasMan = true;
}

Maze.prototype.initData = function() {
    let n = this.n;
    this.maze = new Array(n);
    for (var i = 0; i < this.maze.length; i++) {
        this.maze[i] = new Array(n);
    }

    for (var i = 0; i < this.maze.length; i++) {
        for(var j = 0; j < this.maze[i].length; j++) {
            this.maze[i][j] = new Node(i, j);
        }
    }

    this.maze[0][1].hasMan = true;
    this.maze[0][1].type = 3; // enter point
    this.maze[n - 1][n - 2].type = 4; // exit point

    for (var i = 1; i < this.maze.length; i += 2) {
        for(var j = 1; j < this.maze[i].length; j += 2) {
            this.maze[i][j].type = 1;
        }
    }
}

Maze.prototype.initKeyBoard = function(successCallback) {
    // 注册键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key == "ArrowUp") {
            if (this.manLocation.y - 1 >= 0 && this.manLocation.y - 1 <= this.n - 1 && this.maze[this.manLocation.x][this.manLocation.y - 1].type !== 0) {
                this.setManLocation(this.manLocation.x, this.manLocation.y - 1);
            }
        } else if (e.key == "ArrowDown") {
            if (this.manLocation.y + 1 >= 0 && this.manLocation.y + 1 <= this.n - 1 && this.maze[this.manLocation.x][this.manLocation.y + 1].type !== 0) {
                this.setManLocation(this.manLocation.x, this.manLocation.y + 1);
            }
        } else if (e.key == "ArrowLeft") {
            if (this.manLocation.x - 1 >= 0 &&  this.manLocation.x - 1 <= this.n - 1 && this.maze[this.manLocation.x - 1][this.manLocation.y].type !== 0) {
                this.setManLocation(this.manLocation.x - 1, this.manLocation.y);
            }
        } else if (e.key == "ArrowRight") {
            if (this.manLocation.x + 1 >= 0 &&  this.manLocation.x + 1 <= this.n - 1 && this.maze[this.manLocation.x + 1][this.manLocation.y].type !== 0) {
                this.setManLocation(this.manLocation.x + 1, this.manLocation.y);
            }
        }

        if (this.manLocation.x == this.n - 1 && this.manLocation.y == this.n - 2) {
            successCallback && successCallback();
            return;
        }
        this.render();
    });
}

Maze.prototype.reset = function() {
   this.initData();
}

Maze.prototype.render = function() {
    if (this.canvas.getContext) {
        const canvas = this.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        var ctx = canvas.getContext("2d");
        // drawing code here
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawMaze(ctx, Math.floor(canvas.width / this.n));
    } else {
        // canvas-unsupported code here
        console.log("canvas not supported");
    }
};

Maze.prototype.drawMaze = function(ctx, cellSize) {
    var maze = this.maze;
    var size = cellSize;
    for(var i = 0; i < maze.length; i++) {
        for(var j = 0; j < maze[i].length; j++) {
            if (maze[i][j].type == 0) { // wall
                ctx.fillStyle = "#000";
                ctx.fillRect(i * size, j * size, size, size);
            } else if (maze[i][j].type == 1) { // path
                ctx.fillStyle = "#fff";
                ctx.fillRect(i * size, j * size, size, size);
            } else if (maze[i][j].type == 2) { // the path to exit
                ctx.fillStyle = "#0f0";
                ctx.fillRect(i * size, j * size, size, size);
            } else if (maze[i][j].type == 3) { // enter point
                ctx.fillStyle = "#ff0";
                ctx.fillRect(i * size, j * size, size, size);
            } else if (maze[i][j].type == 4) { // exit point
                ctx.fillStyle = "#00f";
                ctx.fillRect(i * size, j * size, size, size);
            } else if (maze[i][j].type == 5) { // help point
                ctx.fillStyle = "#f00";
                ctx.fillRect(i * size, j * size, size, size);
            }

            if (maze[i][j].hasMan) {
                ctx.drawImage(manImage, i * size, j * size, size, size);
            }
        }
    }
}

Maze.prototype.depthFirstGen = async function(enable) {
    this.reset();
    var n = this.n;
    var maze = this.maze;
    
    var startX = 1;
    var startY = 1;
    var visited = [];
    var index = 1;
    visited[0] = {x : 0, y : 0};
    visited[index++] = {x : startX, y : startY};
    var current = visited[1];
    maze[startX][startY].visited = true;    
    while(index != 0) {
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};
        var tmp = [];
        
        if (!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)) {
            if (!maze[up.x][up.y].visited) {
                tmp.push(up);
            }
        }
        if (!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)) {
            if(!maze[right.x][right.y].visited) {
                tmp.push(right);
            }
        }
        if (!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)) {
            if(!maze[down.x][down.y].visited) {
                tmp.push(down);
            }    
        }
        if (!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)) {
            if(!maze[left.x][left.y].visited) {  
                tmp.push(left);
            }    
        }
        if (tmp.length == 0) {
            if (index <= 2) {
                break;
            }
            current = visited[--index];
            maze[current.x][current.y].type = 1;
            current = visited[--index];
            maze[current.x][current.y].type = 1;
            current = visited[index - 1];
        } else {
            var r = Math.ceil(Math.random() * tmp.length);
            r--;
            var rX = (tmp[r].x + current.x) / 2;
            var rY = (tmp[r].y + current.y) / 2;
            maze[rX][rY].type = 2;
            visited[index++] = maze[rX][rY];
            maze[tmp[r].x][tmp[r].y].visited = true;
            visited[index++] = maze[tmp[r].x][tmp[r].y];
            current = visited[index - 1];    
            maze[current.x][current.y].type = 2;
        }

        await sleep(1);
    }
    enable();
};


Maze.prototype.randomPrimGen = async function(enable) {
    this.reset();
    var n = this.n;
    var maze = this.maze;
    
    var startX = 1;
    var startY = 1;
    var visited = [];
    var currentIndex = 1;
    var index = 1;
    visited[0] = {x : 1, y : 1};
    visited[index++] = {x : startX, y : startY};
    var current = visited[1];
    maze[startX][startY].visited = true;    
    while(index != 0) {
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};
        var tmp = [];
        
        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)) {
            if(!maze[up.x][up.y].visited) {
                tmp.push(up);
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)) {
            if(!maze[right.x][right.y].visited) {
                tmp.push(right);
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)) {
            if(!maze[down.x][down.y].visited) {
                tmp.push(down);
            }    
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)) {
            if(!maze[left.x][left.y].visited) {    
                tmp.push(left);
            }    
        }
        if(tmp.length == 0) {
            if(index <= 1) {
                break;
            }
            current = visited[currentIndex];
            maze[current.x][current.y].type = 1;

            current = visited[currentIndex - 1];
            maze[current.x][current.y].type = 1;
            
            for(var i = currentIndex; i < index - 2; i++) {
                visited[i - 1] = visited[i + 1];
                visited[i] = visited[i + 2];
            }
            index -= 2;
            
            currentIndex = Math.ceil(Math.random() * index);
            currentIndex--;
            if(currentIndex % 2 == 0) {
                currentIndex++;
            }
            current = visited[currentIndex];
        } else {
            var r = Math.ceil(Math.random() * tmp.length);
            r--;
            var rX = (tmp[r].x + current.x) / 2;
            var rY = (tmp[r].y + current.y) / 2;
            maze[rX][rY].type = 2;
            visited[index++] = maze[rX][rY];
            maze[tmp[r].x][tmp[r].y].visited = true;
            visited[index++] = maze[tmp[r].x][tmp[r].y];
            current = visited[index - 1];    
            maze[current.x][current.y].type = 2;

            currentIndex = Math.ceil(Math.random() * index);
            currentIndex--;
            if(currentIndex % 2 == 0) {
                currentIndex++;
            }
            current = visited[currentIndex];
        }
        await sleep(1);
    }
    enable();
};

Maze.prototype.findpath = async function(enable) {
    var n = this.n;
    var maze = this.maze;
    var start = {x : 1, y : 1};
    var end = {x : n - 2, y : n - 2};

    for(var i = 0; i < maze.length; i++) {
        for(var j = 0; j < maze[i].length; j++) {
            maze[i][j].visited = false;
        }
    }    
    var queue = [];
    var front = 0, rear = 0;
    maze[end.x][end.y].level = 0;
    queue[rear++] = maze[end.x][end.y];
    var current = maze[end.x][end.y];
    var pre = current;
    while (front != rear) {
        pre = current;
        current = queue[front++];
        current.visited = true;
        maze[current.x][current.y].type = 1;

        if (current.x == start.x && current.y == start.y) {
            while(front != rear) {
                current = queue[front++];
                maze[current.x][current.y].type = 1;
            }
            break;
        }
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};

        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)) {
            if(maze[(current.x + up.x) / 2][(current.y + up.y) / 2].type == 1) {
                if(!maze[up.x][up.y].visited) {
                    maze[up.x][up.y].visited = true;
                    maze[up.x][up.y].level = current.level + 1;
                    queue[rear++] = maze[up.x][up.y];
                    maze[up.x][up.y].type = 2;
                    maze[(current.x + up.x) / 2][(current.y + up.y) / 2].type = 1;
                }
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)) {
            if(maze[(current.x + right.x) / 2][(current.y + right.y) / 2].type == 1) {
                if(!maze[right.x][right.y].visited) {
                    maze[right.x][right.y].visited = true;
                    maze[right.x][right.y].level = current.level + 1;
                    queue[rear++] = maze[right.x][right.y];
                    maze[right.x][right.y].type = 2;
                    maze[(current.x + right.x) / 2][(current.y + right.y) / 2].type = 1;
                }
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)) {
            if(maze[(current.x + down.x) / 2][(current.y + down.y) / 2].type == 1) {
                if(!maze[down.x][down.y].visited) {
                    maze[down.x][down.y].visited = true;
                    maze[down.x][down.y].level = current.level + 1;
                    queue[rear++] = maze[down.x][down.y];
                    maze[down.x][down.y].type = 2;
                    maze[(current.x + down.x) / 2][(current.y + down.y) / 2].type = 1;
                }    
            }
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)) {
            if(maze[(current.x + left.x) / 2][(current.y + left.y) / 2].type == 1) {
                if(!maze[left.x][left.y].visited) {
                    maze[left.x][left.y].visited = true;    
                    maze[left.x][left.y].level = current.level + 1;
                    queue[rear++] = maze[left.x][left.y];
                    maze[left.x][left.y].type = 2;
                    maze[(current.x + left.x) / 2][(current.y + left.y) / 2].type = 1;
                }    
            }
        }
        await sleep(1);
    }
    current  = maze[start.x][start.y];
    pre = current;

    while (true) {
        maze[(current.x + pre.x) / 2][(current.y + pre.y) / 2].type = 2;
        maze[current.x][current.y].type = 2;
        await sleep(20);
        if(current.x == end.x && current.y == end.y) {
            break;
        }
        var up = {x : current.x, y : current.y + 2};
        var right = {x : current.x + 2, y : current.y};
        var down = {x : current.x, y : current.y - 2};
        var left = {x : current.x - 2, y : current.y};

        if(!(up.x < 0 || up.x >= n || up.y < 0 || up.y >= n)) {
            if(maze[(current.x + up.x) / 2][(current.y + up.y) / 2].type == 1) {
                if(maze[up.x][up.y].level == current.level - 1) {
                    pre = current;
                    current = maze[up.x][up.y];
                    continue;
                }
            }
        }
        if(!(right.x < 0 || right.x >= n || right.y < 0 || right.y >= n)) {
            if(maze[(current.x + right.x) / 2][(current.y + right.y) / 2].type == 1) {
                if(maze[right.x][right.y].level == current.level - 1) {
                    pre = current;
                    current = maze[right.x][right.y];
                    continue;
                }
            }
        }
        if(!(down.x < 0 || down.x >= n || down.y < 0 || down.y >= n)) {
            if(maze[(current.x + down.x) / 2][(current.y + down.y) / 2].type == 1) {
                if(maze[down.x][down.y].level == current.level - 1) {
                    pre = current;
                    current = maze[down.x][down.y];
                    continue;
                }  
            }
        }
        if(!(left.x < 0 || left.x >= n || left.y < 0 || left.y >= n)) {
            if(maze[(current.x + left.x) / 2][(current.y + left.y) / 2].type == 1) {
                if(maze[left.x][left.y].level == current.level - 1) {
                    pre = current;
                    current = maze[left.x][left.y];
                    continue;
                }  
            }
        }
        break;
        
    }
    enable();
};

function Node(x, y) {
    this.x = x;
    this.y = y;
    this.level = 0;
    this.visited = false;
    this.type = 0;
    this.hasMan = false;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Maze;
