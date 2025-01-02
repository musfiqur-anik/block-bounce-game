const overlay = document.querySelector(".overlay");
console.log(overlay);

class Item {
    bounce = new Audio("./media/sounds/bounce.mp3");
    success = new Audio("./media/sounds/success.mp3");
    break = new Audio("./media/sounds/death.mp3");
    score = 0;
    row = 0;
    col = 0;
    direction = 0;
    start = (row, col) => {
      overlay.style.display = "block";
      this.row = row;
      this.col = col;
     movementInterval=  setInterval(() => {
        const [row, col] = this.getNextPosition();
        if(row === -1 ){
          overlay.style.display = "none";
          if(isObjectiveBlock(this.row, this.col)) {
             this.success.play();
            this.score++;
            increaseScore(this.score);
            clearObjectiveBlock(this.row, this.col);
            return;
          }
          this.break.play();
          clearBlock(this.row,this.col);
           return;
          }
        this.move(row, col);
      }, speed);
    };
    getNextPosition = () => {
      let row = this.row;
      let col = this.col; 
      switch (this.direction) {
        case 0: // Down;
          row++;
          break;
        case 1: // Top Right
          col++;
          row--;
          break;
        case 2: // Top Left
          col--;
          row--;
          break;
        case 3: // Bottom Left
          col--;
          row++;
          break;
        case 4: // Bottom Right
          col++;
          row++;
          break;
        default:
          break;
      }
      if (!this.isValid(row, col)) {
        this.direction++;
        if (this.direction > 2) {
          this.direction =0;
          this.stop();
          return [-1,-1];
        }
        this.bounce.play()
        return this.getNextPosition();
      }
      return [row, col];
    };
    isValid = (row, col) => {
      return row >= 0 && row < gridsize && col >= 0 && col < gridsize;
    };
  
    move = (row, col) => {
          clearBlock(this.row, this.col);
      this.row = row;
      this.col = col;
          colorBlock(this.row, this.col);
    };
    stop = () => {
        clearInterval(movementInterval);
    };
  }
  
  const container = document.querySelector(".container");
  let gridsize = 0;
  let movementInterval;
  let speed = 200; //in milliseconds
  let item = new Item();
  
  function play() {
    container.innerHTML = "";
  
    gridsize = parseInt(prompt("set your grid size:"), 10);
    if (isNaN(gridsize) || gridsize < 5 || gridsize > 50) {
      alert("enter a valid number between 5-50");
      location.reload();
      
    }
    creategrid(gridsize);
  }
  
  function creategrid(gridsize) {
    for (i = 0; i < gridsize; i++) {
      for (j = 0; j < gridsize; j++) {
        let GridItem = document.createElement("div");
        if(i==0){
           GridItem.classList.add("objectiveBlock");
        }else{
          GridItem.addEventListener("click", (event) => {
            const [row, col] = getId(event.target);
            item.start(row, col);
          });
        }
        GridItem.classList.add("gridItem");
        GridItem.classList.add("gridItem-" + i + "-" + j);
        GridItem.dataset.row = i;
        GridItem.dataset.col = j;
        container.appendChild(GridItem);

      }
    }
    
    container.style.gridTemplateColumns = `repeat(${gridsize}, auto)`;
  }
  
  function getId(element) {
    return [parseInt(element.dataset.row), parseInt(element.dataset.col)];
  }
  
  function colorBlock(row , col) {
      let element = document.querySelector(`.gridItem-${row}-${col}`);
      element.classList.add("active");
  }
  function clearBlock(row , col) {
      let element = document.querySelector(`.gridItem-${row}-${col}`);
      element.classList.remove("active");
  }
  function clearObjectiveBlock(row , col) {
    let element = document.querySelector(`.gridItem-${row}-${col}`);
    element.classList.remove("active", "objectiveBlock");

}
  function isObjectiveBlock(row, col){
    let element = document.querySelector(`.gridItem-${row}-${col}`);
    if(element.classList.contains("objectiveBlock")){
      return true;
    }
    return false;
  }

function increaseScore(score){
  let element = document.querySelector(`h1`);
  element.innerHTML = "Score: " + score;
}
