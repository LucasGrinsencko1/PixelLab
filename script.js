
/* ===================================
   PixelLab — Pixel Art Editor
=================================== */

// Canvas configuration
const canvas = document.getElementById("pixel-canvas");

const gridSize = 16;
const totalPixels = gridSize * gridSize;

// Drawing configuration
let selectedColor = "#5865F2";
let selectedTool = "pencil";
let isDrawing = false;

// HTML elements
const colorButtons = document.querySelectorAll(".color");

const pencilButton = document.getElementById("pencil");
const eraserButton = document.getElementById("eraser");
const clearButton = document.getElementById("clear-btn");
const exportButton = document.getElementById("export-btn");


// ===================================
// Create pixel grid
// ===================================

function createGrid() {

    canvas.innerHTML = "";

    for (let i = 0; i < totalPixels; i++) {

        const pixel = document.createElement("div");

        pixel.classList.add("pixel");

        // Start drawing
        pixel.addEventListener("mousedown", (event) => {

            if (event.button !== 0) return;

            isDrawing = true;
            paintPixel(pixel);

        });

        // Continue drawing while dragging
        
        pixel.addEventListener("mouseenter", (event) => {

            // Check if the left mouse button is still pressed
            if (isDrawing && event.buttons === 1) {
                paintPixel(pixel);
            } else {
                isDrawing = false;
            }

        });

        canvas.appendChild(pixel);
    }
}

// ===================================
// Paint individual pixel
// ===================================

function paintPixel(pixel) {

    if (selectedTool === "pencil") {

        pixel.style.backgroundColor = selectedColor;

    } else if (selectedTool === "eraser") {

        pixel.style.backgroundColor = "#FFFFFF";

    }

}

// ===================================
// Tool selection
// ===================================

function selectTool(tool) {

    selectedTool = tool;

    // Remove active state from all tools
    document.querySelectorAll(".tool").forEach((button) => {
        button.classList.remove("active");
    });

    // Highlight selected tool
    document.getElementById(tool).classList.add("active");

}

// Pencil
pencilButton.addEventListener("click", () => {
    selectTool("pencil");
});

// Eraser
eraserButton.addEventListener("click", () => {
    selectTool("eraser");
});

// ===================================
// Color selection
// ===================================

colorButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Remove previous color selection
        colorButtons.forEach((color) => {
            color.classList.remove("selected");
        });

        // Highlight selected color
        button.classList.add("selected");

        // Store selected color
        selectedColor = button.style.backgroundColor;

        // Automatically activate pencil
        selectTool("pencil");

    });

});

// ===================================
// Clear canvas
// ===================================

function clearCanvas() {

    const pixels = document.querySelectorAll(".pixel");

    pixels.forEach((pixel) => {
        pixel.style.backgroundColor = "#FFFFFF";
    });

}

clearButton.addEventListener("click", clearCanvas);


/* ===================================
   Export artwork as PNG
=================================== */

function exportPNG() {

    // Create a temporary canvas
    const exportCanvas = document.createElement("canvas");

    // Get the drawing context
    const ctx = exportCanvas.getContext("2d");

    // Define image resolution
    const pixelSize = 20;

    exportCanvas.width = gridSize * pixelSize;
    exportCanvas.height = gridSize * pixelSize;

    // Get all pixels from our editor
    const pixels = document.querySelectorAll(".pixel");

    // Transfer pixel colors to the image
    pixels.forEach((pixel, index) => {

        // Calculate pixel position
        const x = (index % gridSize) * pixelSize;
        const y = Math.floor(index / gridSize) * pixelSize;

        // Get pixel color
        const color = window.getComputedStyle(pixel).backgroundColor;

        // Apply color
        ctx.fillStyle = color;

        // Draw pixel on temporary canvas
        ctx.fillRect(x, y, pixelSize, pixelSize);

    });

    // Create download link
    const link = document.createElement("a");

    link.download = "pixellab-artwork.png";
    link.href = exportCanvas.toDataURL("image/png");

    // Download image
    link.click();

}

// Connect function to Export PNG button
exportButton.addEventListener("click", exportPNG);


// ===================================
// Stop drawing
// ===================================

document.addEventListener("mouseup", () => {
    isDrawing = false;
});

// Prevent native dragging
canvas.addEventListener("dragstart", (event) => {
    event.preventDefault();
});

// ===================================
// Initialize application
// ===================================

createGrid();

console.log("PixelLab initialized successfully!");
