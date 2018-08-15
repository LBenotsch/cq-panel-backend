// grab the packages we need
const binance = require('binance-api-node').default;
const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// returns binance account data, only if correct matching public key is provided
app.get('/binance', function (req, res) {
  var key = req.param("key");
  if (key == "hnFOruusrwhV5HJRDM2dQGZ1B5Oxv2gow4Eigjgdgs7JukbCG9ln4QLktOLUwB1N") {
    // Authenticated client, can make signed calls
    const client = binance({
      apiKey: key,
      apiSecret: 'LhgQ04XDnSY3oU6M0H9RQMSrcDm0CoVP4gMcnpian1EzmVxKjKbfPlf4C0jBfoMU',
    })
    client.accountInfo().then(account => {
      res.send(JSON.stringify(account.balances))
    })
    console.log("/binance GET - API requested")
  } else {
    console.log("/binance GET - Wrong public key provided")
  }
});

app.post('/change_coin', function (req, res) {
  var coin = req.body.coin;
  res.end("done");
  fs.writeFile('coin.txt', coin, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    console.log('/change_coin POST - Saved to file: ' + coin);
  });
});

app.get('/which_coin', function (req, res) {
  var filePath = path.join(__dirname, 'coin.txt');
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (!err) {
      console.log('/which_coin GET - Coin requested from file: ' + data);
      res.write(data);
      res.end();
    } else {
      console.log(err);
    }
  });
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);