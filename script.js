const canvas = document.getElementById('wallCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const undoButton = document.getElementById('undoButton');

let painting = false;
let paths = []; // Lista wszystkich rysunków
let currentPath = null; // Aktywnie rysowana linia

function drawHouseStructure() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ściana
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(150, 200, 500, 350);

  // Dach
  ctx.beginPath();
  ctx.moveTo(150, 200);
  ctx.lineTo(400, 80);
  ctx.lineTo(650, 200);
  ctx.closePath();
  ctx.fillStyle = "#b22222";
  ctx.fill();

  // Komin
  ctx.fillStyle = "#4b2e2e";
  ctx.fillRect(460, 110, 30, 60);
}

function redrawAll() {
  drawHouseStructure();

  for (let path of paths) {
    ctx.beginPath();
    ctx.lineWidth = path.size;
    ctx.strokeStyle = path.color;
    ctx.lineCap = "round";

    for (let i = 0; i < path.points.length; i++) {
      const p = path.points[i];
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }
}

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  currentPath = {
    color: colorPicker.value,
    size: parseInt(brushSize.value),
    points: [{ x, y }]
  };
});

canvas.addEventListener('mousemove', (e) => {
  if (!painting || !currentPath) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  currentPath.points.push({ x, y });
  redrawAll();

  // Rysuj tylko bieżącą ścieżkę
  ctx.beginPath();
  ctx.lineWidth = currentPath.size;
  ctx.strokeStyle = currentPath.color;
  ctx.lineCap = "round";
  const points = currentPath.points;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
  if (currentPath) {
    paths.push(currentPath);
    currentPath = null;
  }
  painting = false;
});

canvas.addEventListener('mouseleave', () => {
  painting = false;
  if (currentPath) {
    paths.push(currentPath);
    currentPath = null;
  }
});

undoButton.addEventListener('click', () => {
  if (paths.length > 0) {
    paths.pop();
    redrawAll();
  }
});

// Rysuj dom przy starcie
drawHouseStructure();
