const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("Canvas context not available");

// Variables for drawing and dragging
let isDrawing = false;
let isDragging = false;

let startX = 0;
let startY = 0;
let width = 0;
let height = 0;

let borderRadius = 0;
let maxBorderRadius = 0;

// Cardinal and corner points
const greenPoints = [
    { x: 0, y: 0, isDragging: false }, // Top-left
    { x: 0, y: 0, isDragging: false }, // Top-right
    { x: 0, y: 0, isDragging: false }, // Bottom-left
    { x: 0, y: 0, isDragging: false }, // Bottom-right
];

const redPoints = [
    { x: 0, y: 0 }, // Top-left corner
    { x: 0, y: 0 }, // Top-right corner
    { x: 0, y: 0 }, // Bottom-left corner
    { x: 0, y: 0 }, // Bottom-right corner
];

// Drawing starts
canvas.addEventListener("mousedown", (e) => {
    const { offsetX, offsetY } = e;

    // Reset border radius to 0 when starting a new drawing
    borderRadius = 0;

    // Check if dragging green points
    for (let i = 0; i < greenPoints.length; i++) {
        const dx = offsetX - greenPoints[i].x;
        const dy = offsetY - greenPoints[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 10) {
            greenPoints[i].isDragging = true;
            isDragging = true;
            return;
        }
    }

    // Start drawing
    startX = offsetX;
    startY = offsetY;
    isDrawing = true;
});

// Drawing or dragging in progress
canvas.addEventListener("mousemove", (e) => {
    const { offsetX, offsetY } = e;

    if (isDrawing) {
        width = offsetX - startX;
        height = offsetY - startY;

        updatePoints();
        drawCanvas();
    } else if (isDragging) {
        // Adjust border radius based on dragging
        for (let i = 0; i < greenPoints.length; i++) {
            if (greenPoints[i].isDragging) {
                const dx = Math.abs(offsetX - redPoints[i].x);
                const dy = Math.abs(offsetY - redPoints[i].y);
                borderRadius = Math.min(maxBorderRadius, Math.sqrt(dx * dx + dy * dy));
                updatePoints();
                drawCanvas();
                break;
            }
        }
    }
});

// Stop drawing or dragging
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    isDragging = false;
    greenPoints.forEach((point) => (point.isDragging = false));
});

// Update cardinal and corner points
function updatePoints() {
    maxBorderRadius = Math.min(Math.abs(width), Math.abs(height)) / 2;

    // Red points (corners)
    redPoints[0] = { x: startX, y: startY };
    redPoints[1] = { x: startX + width, y: startY };
    redPoints[2] = { x: startX, y: startY + height };
    redPoints[3] = { x: startX + width, y: startY + height };

    // Green points (inner cardinals)
    greenPoints[0].x = startX + borderRadius;
    greenPoints[0].y = startY + borderRadius;

    greenPoints[1].x = startX + width - borderRadius;
    greenPoints[1].y = startY + borderRadius;

    greenPoints[2].x = startX + borderRadius;
    greenPoints[2].y = startY + height - borderRadius;

    greenPoints[3].x = startX + width - borderRadius;
    greenPoints[3].y = startY + height - borderRadius;
}

// Draw canvas content
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the external rectangle (default rectangle)
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1; // Lighter stroke width for the external rectangle
    ctx.stroke();

    // Draw the rounded rectangle with gray fill
    ctx.beginPath();
    ctx.moveTo(startX + borderRadius, startY);
    ctx.arcTo(startX + width, startY, startX + width, startY + height, borderRadius);
    ctx.arcTo(startX + width, startY + height, startX, startY + height, borderRadius);
    ctx.arcTo(startX, startY + height, startX, startY, borderRadius);
    ctx.arcTo(startX, startY, startX + width, startY, borderRadius);
    ctx.closePath();
    ctx.fillStyle = "gray"; // Set fill color to gray
    ctx.fill(); // Fill the rounded rectangle
    ctx.strokeStyle = "blue"; // Blue border for the rounded rectangle
    ctx.lineWidth = 2; // Thicker stroke for the rounded rectangle
    ctx.stroke();

    // Draw red corner points
    ctx.fillStyle = "red";
    redPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw green cardinal points
    ctx.fillStyle = "yellow";
    greenPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

     // Calculate the radius in degrees based on 360 degrees
     const radiusInDegrees = (borderRadius / maxBorderRadius) * 316;

    // Display dimensions and border radius
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Width: ${Math.abs(width)}px`, startX, startY - 20);
    ctx.fillText(`Height: ${Math.abs(height)}px`, startX, startY - 40);
    ctx.fillText(`Radius: ${Math.round(radiusInDegrees)}`, startX, startY - 60);
}
