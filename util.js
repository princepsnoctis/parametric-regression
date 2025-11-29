function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min
}

function random_box_muller() {
    let u = 0, v = 0;

    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function random_normal(mu = 0, sigma = 1) {
    return random_box_muller() * sigma + mu;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function partial_derivative(f, x, parameters, parameter, dx = 1e-7) {
    const fxdx_parameters = { ...parameters }

    fxdx_parameters[parameter] += dx;

    const fx = f(x, parameters);
    const fxdx = f(x, fxdx_parameters);

    return (fxdx - fx) / dx;
}

Array.prototype.random = function () {
    const index = Math.floor(Math.random() * this.length);

    return this[index];
}