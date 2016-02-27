'use strict';

const co = require("co");
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const utils = require("./utils");

var host = 'pub.urtbd.com';
var port = 27960;

var screen, grid;
var duration = 1000;

function configure(configs) {

    // Do not initialize grid and screen if configure not called
    screen = blessed.screen();
    grid = new contrib.grid({rows: 1, cols: 1});

    // Set the host, port and update duration
    host = configs['host'] || host;
    port = configs['port'] || port;
    duration = configs['duration'] || duration;
}

function setupUI() {

    // Table UI
    var tableOptions =
    {
        keys: true,
        fg: 'green',
        columnSpacing: [40, 10, 10],
        xLabelPadding: 3,
        xPadding: 5,
        label: "Players List"

    };

    // Load the table in the grid, load the grid on screen
    grid.set(0, 0, 1, 1, contrib.table, tableOptions);
    grid.applyLayout(screen);

    // Load initial Table layout
    var table = grid.get(0, 0);
    table.setData({
        headers: ['Player', 'Ping', 'Score']
        , data: []
    });

    // Set quit options
    screen.key(['escape', 'q', 'C-c'], function (ch, key) {
        return process.exit(0);
    });

    // Start rendering
    screen.render();

}

function * updateUI() {

    try {
        const players = yield utils.getServerResponse(host, port);

        let table = grid.get(0, 0);
        table.setData({
            headers: ['Player', 'Ping', 'Score'],
            data: players
        });

        // Re-render the screen
        screen.render();

    } catch (e) {
        console.log("Error: " + e);
    }

}


function start() {

    // Load the UI
    setupUI();

    // Set periodic update
    setInterval(function () {
        co(updateUI());
    }, duration);


}


// Exports

module.exports.start = start;
module.exports.configure = configure;
