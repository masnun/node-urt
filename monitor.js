var dgram = require('dgram');
var blessed = require('blessed');
var contrib = require('blessed-contrib');


var client = dgram.createSocket('udp4');
var host = 'urtbd.com';
var port = 1111;

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
        keys: true
        , fg: 'green'
        , columnSpacing: [40, 10, 10]
        , xLabelPadding: 3
        , xPadding: 5
        , label: "Players List"

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


function start() {

    // Load the UI
    setupUI();

    // Query string for URT
    var data = new Buffer("\377\377\377\377getstatus", 'binary');

    // Set periodic update
    setInterval(function () {
        client.send(data, 0, data.length, port, host);
    }, duration);

    // Handle updates - read UDP message and parse the data
    // Then render the layout
    client.on('message', function (message) {

        // Parse the message, create data structure
        var response = message.toString();
        var lines = response.split("\n");
        var players = [];
        for (var i = 2; i < lines.length; i++) {
            var line = lines[i];
            if (line.trim().length > 0) {
                var playerData = line.split(" ");

                players.push([
                    playerData[2].replace('"', '').replace('"', ''),
                    playerData[1],
                    playerData[0]
                ])
            }

        }

        // Add the data to table
        var table = grid.get(0, 0);
        table.setData({
            headers: ['Player', 'Ping', 'Score']
            , data: players
        });

        // Re-render the screen
        screen.render();

    });

}


// Exports

module.exports.start = start;
module.exports.configure = configure;
