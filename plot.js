const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let zoom = 20; // Pixels per x unit

let offset = {
    x: 0,
    y: 0
}

let isDragging = false;
let x0 = 0, y0 = 0;

let last_offset = {
    x: 0,
    y: 0
}

// const colors = {
//     "red": "#C5433F",
//     "blue": "#2D6FB2",
//     "green": "#348543",
//     "orange": "#FA7E19",
//     "purple": "#6042A6",
// }

const colors = {
    "cyan": "#38BBBF",
    "orange": "#D28F4C",
    "pink": "#CB7ABC",
    "blue": "#0581E6",
    "green": "#9FBD59",
}

function transform() {
    // Translate to the origin
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Translate to the offset
    ctx.translate(offset.x, offset.y);

    // Flip y axis and zoom
    ctx.transform(1 * zoom, 0, 0, -1 * zoom, 0, 0);
}

function get_bounds() {
    return {
        l: (-canvas.width / 2 - offset.x) / zoom,
        r: (canvas.width / 2 - offset.x) / zoom,
        b: (-canvas.height / 2 + offset.y) / zoom,
        t: (canvas.height / 2 + offset.y) / zoom,
    }
}

function grid(size = 1, color = "white") {
    ctx.save();

    transform();

    ctx.lineWidth = 0.15 / zoom;

    ctx.strokeStyle = colors[color] || color;

    ctx.beginPath();

    const bounds = get_bounds();

    for (let x = 0; x > bounds.l; x -= size) {
        ctx.moveTo(x, bounds.b);
        ctx.lineTo(x, bounds.t);
    }

    for (let x = 0; x < bounds.r; x += size) {
        ctx.moveTo(x, bounds.b);
        ctx.lineTo(x, bounds.t);
    }

    for (let y = 0; y > bounds.b; y -= size) {
        ctx.moveTo(bounds.l, y);
        ctx.lineTo(bounds.r, y);
    }

    for (let y = 0; y < bounds.t; y += size) {
        ctx.moveTo(bounds.l, y);
        ctx.lineTo(bounds.r, y);
    }

    ctx.stroke();

    ctx.lineWidth = 0.5 / zoom;

    ctx.strokeStyle = "white"

    ctx.beginPath();

    ctx.moveTo(0, bounds.b);
    ctx.lineTo(0, bounds.t);
    ctx.moveTo(bounds.l, 0);
    ctx.lineTo(bounds.r, 0);

    ctx.stroke();

    ctx.restore();
}

function plot(f, parameters, color = Object.keys(colors)[0]) {
    ctx.save();

    transform();

    ctx.lineWidth = 4 / zoom;

    ctx.strokeStyle = colors[color] || color;

    ctx.beginPath();

    const bounds = get_bounds();

    for (let x = bounds.l; x < bounds.r; x += 1 / zoom) {
        const y = f(x, parameters);

        if (isNaN(y)) continue;

        ctx.lineTo(x, y);
    }

    ctx.stroke();

    ctx.restore();
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} color 
 */
function point(x, y, color = "red") {
    ctx.save();

    transform();

    ctx.fillStyle = colors[color] || color

    ctx.beginPath();

    ctx.fillStyle = colors[color] || color
    ctx.arc(x, y, 6 / zoom, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();
}

function label(x, y, lines) {
    ctx.save();

    ctx.font = "24px Segoe UI"
    ctx.fillStyle = "white"

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + 28 * (i + 1));
    }

    ctx.restore();
}

// Events
canvas.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }

    const zoomSpeed = 0.001;
    const delta = e.deltaY * zoomSpeed;

    if (e.deltaY < 0) {
        zoom /= (1 + delta);
    } else {
        zoom *= (1 - delta);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    render();
}, { passive: false });

canvas.addEventListener('mousedown', e => {
    x0 = e.clientX;
    y0 = e.clientY;

    isDragging = true;
});

canvas.addEventListener('mouseup', e => {
    isDragging = false;

    const dx = e.clientX - x0;
    const dy = e.clientY - y0;

    last_offset.x += dx;
    last_offset.y += dy;

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    render();
});

canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;

    const dx = e.clientX - x0;
    const dy = e.clientY - y0;

    offset.x = last_offset.x + dx;
    offset.y = last_offset.y + dy;

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    render()
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});
