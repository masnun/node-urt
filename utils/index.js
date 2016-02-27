const dgram = require('dgram');

function getServerResponse(host, port) {

    return new Promise(function (resolve, reject) {

        const client = dgram.createSocket('udp4');
        const data = new Buffer("\377\377\377\377getstatus", 'binary');

        // Send the request
        client.send(data, 0, data.length, port, host);

        // Handle message event and parse data
        client.on('message', (message) => {

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

            client.close();
            resolve(players);

        });

        // Handle error events
        client.on('error', (error) => {
            client.close();
            reject(error);
        })
    })

}

module.exports.getServerResponse = getServerResponse;