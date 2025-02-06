import "./index.css";
import Maze from "./maze";
import Line from "./line";
import man from "./asset/man.gif";

let maze;
let line;

function clearLine() {
    line.points = [];
}

function gen(type) {
    disable();

    var n = document.getElementById("size")?.value || 41;
    var size = parseInt(n);
    if(size % 2 == 0) {
        alert("请输入奇数");
        enable();
        return;
    }
    maze.setSize(size);
    maze.render();
    if (type == 1) {
        maze.depthFirstGen(enable);
    } else {
        maze.randomPrimGen(enable);
    }
}

function find() {
    disable();
    maze.findpath(enable);
}

function disable() {
    document.getElementById("find").setAttribute("disabled", "true");
    document.getElementById("gen1").setAttribute("disabled", "true");
    document.getElementById("gen2").setAttribute("disabled", "true");
    document.getElementById("clear").setAttribute("disabled", "true");
}
function enable() {
    document.getElementById("find").removeAttribute("disabled");
    document.getElementById("gen1").removeAttribute("disabled");
    document.getElementById("gen2").removeAttribute("disabled");
    document.getElementById("clear").removeAttribute("disabled");
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
    }, {
        text: "清除画线",
        id: "clear",
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
            } else if (this.id == "clear") {
                clearLine();
            }
        }

        item.appendChild(btn);
        menu.appendChild(item);
    }
}

function showSuccess() {
    var menu = document.getElementById("menu");
    const li = document.createElement("li");
    const img = new Image();
    img.src = man;
    li.appendChild(img);
    menu.appendChild(li);
}

function initMaze() {
    gen(2);
}

window.onload = function() {
    const canvas = document.getElementById("mazecontainer");
    maze = new Maze(41, canvas, () => showSuccess());
    line = new Line(canvas);
    buildMenu();
    initMaze();

    requestAnimationFrame(function draw() {
        maze.render();
        line.render();
        requestAnimationFrame(draw);
    });
   
}