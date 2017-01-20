// Imports
let WebSocket = require('ws');
let EventHubClient = require('azure-event-hubs').Client

// Subscribe to BTCUSD pair
let reqSubscribeTrades = {
    "event": "subscribe",
    "channel": "trades",
    "pair": "BTCUSD"
}

// Create Event Hub Client
let client = EventHubClient.fromConnectionString('Endpoint=sb://btc-trades.servicebus.windows.net/;SharedAccessKeyName=relayTrades;SharedAccessKey=zh6uE0WdbYVJD30mpVpV1y2gaCugvkYNflSF1VipsDM=', 'btc-usd')
senderPromise = client.open().then(() => client.createSender('1'))

// Interact with bitfinex API
let w = new WebSocket('wss://api.bitfinex.com/ws/')
w.onmessage = (msg) => {
    let wsMsg = JSON.parse(msg.data)

    let getTradeObject = function() {
        if (wsMsg[1] == 'tu') {
            return trade = {
                type: wsMsg[1],
                seq: wsMsg[2],
                tradeID: wsMsg[3],
                timestamp: new Date(wsMsg[4] * 1000).toISOString(),
                price: wsMsg[5],
                size: Math.abs(wsMsg[6]),
                direction: Math.sign(wsMsg[6])
            }
        } else if (wsMsg[1] == 'te') {
            return trade = {
                type: wsMsg[1],
                seq: wsMsg[2],
                timestamp: new Date(wsMsg[3] * 1000).toISOString(),
                price: wsMsg[4],
                size: Math.abs(wsMsg[5]),
                direction: Math.sign(wsMsg[5])
            }
        } else {
            return trade = { type: "hb" }
        }
    }
    if (wsMsg instanceof Array && !(wsMsg[1] instanceof Array)) {
        console.log(JSON.stringify(getTradeObject()))
    }



    // Send event


    /*senderPromise.then(function (tx) {
        tx.on('errorReceived', function (err) { console.log(err) })
        tx.send(tradeMsg)
    })*/

}

w.onopen = (event) => w.send(JSON.stringify(reqSubscribeTrades))