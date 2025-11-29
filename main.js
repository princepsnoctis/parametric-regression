// Generate data points
const data_parameters = {
    beta3: random(-1, 1),
    beta2: random(-1, 1),
    beta1: random(-1, 1),
    beta0: random(-1, 1),
}

function data(x) {
    return (
        // data_parameters.beta3 * x ** 3 +
        // data_parameters.beta2 * x ** 2 +
        // data_parameters.beta1 * x ** 1 +
        // data_parameters.beta0
        Math.sqrt(64 - x**2)
    )
}

const points = [];

const points_offset = {
    x: random(-10, 10),
    y: random(-10, 10),
}

for (let x = -20; x < 20; x += 0.2) {
    if (random_normal(0, 20) < Math.abs(x)) continue;

    const y = data(x + points_offset.x) + points_offset.y;

    if (isNaN(y)) continue;

    const ex = (random_normal(0, 0));
    const ey = (random_normal(0, 0));

    points.push({ x: x + ex, y: y + ey });
}

// Setup model
const parameters = {
    beta3: random(-1, 1),
    beta2: random(-1, 1),
    beta1: random(-1, 1),
    beta0: random(-1, 1),
}

function model(x, parameters) {
    return (
        parameters.beta3 * x ** 3 +
        parameters.beta2 * x ** 2 +
        parameters.beta1 * x ** 1 +
        parameters.beta0
    )
}

const EPOCHS = 100000;
const BATCH_SIZE = 512;
const LEARNING_RATE = 0.000000001

let epoch = 0;

async function train(points, epochs, learning_rate) {
    for (; epoch < epochs; epoch++) {
        for (let batch = 0; batch < BATCH_SIZE; batch++) {
            for (const p of points) {
                function error(x, parameters) {
                    return (model(p.x, parameters) - p.y) ** 2;
                }

                parameters.beta0 -= learning_rate * 1000 * partial_derivative(error, p.x, parameters, "beta0");
                parameters.beta1 -= learning_rate * 100 * partial_derivative(error, p.x, parameters, "beta1");
                parameters.beta2 -= learning_rate * 10 * partial_derivative(error, p.x, parameters, "beta2");
                parameters.beta3 -= learning_rate * partial_derivative(error, p.x, parameters, "beta3");
            }
        }

        await sleep(10);
    }
}

train(points, EPOCHS, LEARNING_RATE);

// Initial render
const c1 = Object.keys(colors).random();
const c2 = Object.keys(colors).random()

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // axes();
    grid(1);
    grid(10);

    for (const p of points) {
        point(p.x, p.y, "pink");
    }

    plot(model, parameters, "cyan");
    // plot(data, parameters, "cyan");

    label(10, 10, [
        `Epoch: ${epoch}/${EPOCHS}`,
        `LR: ${LEARNING_RATE}`,
        `beta0: ${parameters.beta0}`,
        `beta1: ${parameters.beta1}`,
        `beta2: ${parameters.beta2}`,
        `beta3: ${parameters.beta3}`,
    ]);
}

setInterval(render, 1000 / 60);

