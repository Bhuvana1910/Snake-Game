const board=document.querySelector('.board');
const startButton=document.querySelector('.btn-start');
const modal=document.querySelector('.modal');
const StartGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const highScoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight=50;
const blockWidth=50;

let highScore=localStorage.getItem("highScore")||0;
let score=0;
let time=`00-00`;
highScoreElement.innerText=highScore;

let IntervalId=null;
let timerIntervalId=null;

const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);
const blocks=[];

let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
let snake=[{ x:1, y:3 }];
let direction="down";

for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        const block=document.createElement('div');
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`]=block;
    } 
}

snake.forEach(seg => blocks[`${seg.x}-${seg.y}`].classList.add("fill"));

function render(){
    let head;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction==='left') head={x:snake[0].x,y:snake[0].y-1};
    else if(direction==="right") head={x:snake[0].x,y:snake[0].y+1};
    else if(direction==="down") head={x:snake[0].x+1,y:snake[0].y};
    else if(direction==="up") head={x:snake[0].x-1,y:snake[0].y};

    
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        gameOver();
        return;
    }

   
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        snake.unshift(head);
        score+=10;
        scoreElement.innerText=score;

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    } else {
        snake.forEach(seg => blocks[`${seg.x}-${seg.y}`].classList.remove("fill"));
        snake.unshift(head);
        snake.pop();
    }

    snake.forEach(seg => blocks[`${seg.x}-${seg.y}`].classList.add("fill"));
}


function gameOver() {
    clearInterval(IntervalId);
    clearInterval(timerIntervalId);

    modal.style.display = "flex";
    StartGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
}



startButton.addEventListener("click", () => {
    modal.style.display = "none";

    IntervalId = setInterval(render, 200);

    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        sec++;
        if(sec === 60){ min++; sec = 0; }
        time = `${String(min).padStart(2,'0')}-${String(sec).padStart(2,'0')}`;
        timeElement.innerText = time;
    }, 1000);
});


restartButton.addEventListener("click", restartGame);

function restartGame(){
    clearInterval(IntervalId);
    clearInterval(timerIntervalId);

    score = 0;
    time = `00-00`;
    direction = "right";

    scoreElement.innerText = score;
    timeElement.innerText = time;

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(seg => blocks[`${seg.x}-${seg.y}`].classList.remove("fill"));
        

    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
    snake = [{ x:1, y:3 }];

    modal.style.display = "none";
    gameOverModal.style.display = "none";
    StartGameModal.style.display = "none";

    IntervalId = setInterval(render, 200);
    timerIntervalId = setInterval(() => {
        let [min, sec] = time.split("-").map(Number);
        sec++;
        if(sec === 60){ min++; sec = 0; }
        time = `${String(min).padStart(2,'0')}-${String(sec).padStart(2,'0')}`;
        timeElement.innerText = time;
    }, 1000);
}



document.addEventListener("keydown", (event) => {
    if(event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if(event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if(event.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if(event.key === "ArrowRight" && direction !== "left") direction = "right";
});
