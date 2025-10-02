
const grid = document.getElementById("contributionGrid");
const weeks = 15; 
const days = 7;   


const colors = [
  "#e0e7ff", 
  "#a5f3fc", 
  "#6ee7b7", 
  "#34d399", 
  "#059669"  
];

for (let w = 0; w < weeks * days; w++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");


  const level = Math.floor(Math.random() * colors.length);
  cell.style.backgroundColor = colors[level];


  cell.setAttribute("data-tooltip", `${Math.floor(Math.random() * 10)} contributions`);

  grid.appendChild(cell);
}

