import "./index.css";
import Maze from "./maze";
import Line from "./line";

var maze;

function gen(type) {
    disable();

    var n = document.getElementById("size")?.value || 51;
    var size = parseInt(n);
    if(size % 2 == 0) {
        alert("请输入奇数");
        enable();
        return;
    }
    maze = new Maze(size);
    maze.render(document.getElementById("mazecontainer"));
    if (type == 1) {
        maze.depthFirstGen(document.getElementById("mazecontainer"), enable);
    } else {
        maze.randomPrimGen(document.getElementById("mazecontainer"), enable);
    }
}

function find() {
    disable();
    maze.findpath(document.getElementById("mazecontainer"), enable);
}

function disable() {
    document.getElementById("find").setAttribute("disabled", "true");
    document.getElementById("gen1").setAttribute("disabled", "true");
    document.getElementById("gen2").setAttribute("disabled", "true");
}
function enable() {
    document.getElementById("find").removeAttribute("disabled");
    document.getElementById("gen1").removeAttribute("disabled");
    document.getElementById("gen2").removeAttribute("disabled");
}

function buildMenu() {
    var menu = document.getElementById("menu");
    var menuItems = [{
        text: "深度优先生成",
        id: "gen1",
    }, {
        text: "随机Prim生成",
        id: "gen2",
    }, {
        text: "寻路",
        id: "find",
    }];

    const li = document.createElement("li");
    li.innerHTML = `<input type="text" id="size" placeholder="迷宫大小" />`;
    menu.appendChild(li);
    
    for (var i = 0; i < menuItems.length; i++) {
        var item = document.createElement("li");
        var btn = document.createElement("button");
        btn.id = menuItems[i].id;
        btn.innerHTML = menuItems[i].text;
        btn.onclick = function() {
            if (this.id == "gen1") {
                gen(1);
            } else if (this.id == "gen2") {
                gen(2);
            } else if (this.id == "find") {
                find();
            }
            maze.clear();
        }

        item.appendChild(btn);
        menu.appendChild(item);
    }
}

function initMaze() {
    gen(1);
}

window.onload = function() {
    const line = new Line(document.getElementById("mazecontainer"));
    buildMenu();
    initMaze();

    requestAnimationFrame(function draw() {
        line.render();
        requestAnimationFrame(draw);
    });
}