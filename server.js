// grab the packages we need
const binance = require('binance-api-node').default;
const express = require('express');
const fs = require('fs');
//const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT || 8080;

// routes will go here
app.get('/binance', function (req, res) {
  var key = req.param("key");
  // Authenticated client, can make signed calls
  const client = binance({
    apiKey: key,
    apiSecret: 'LhgQ04XDnSY3oU6M0H9RQMSrcDm0CoVP4gMcnpian1EzmVxKjKbfPlf4C0jBfoMU',
  })
  client.accountInfo().then(account => {
    res.send(JSON.stringify(account.balances))
  })
  console.log("API Key Requested")
});

app.get('/upload', function (req, res) {
  if (!req.param("coin"))
    return res.status(400).send('No coin data recieved');

  var coin = req.param("coin");

  fs.writeFile('coin.txt', coin, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    res.send("Coin " + coin + " was saved! Returning to Panel...")
    console.log('Coin saved!');
  });
  // res.writeHead(302, { 'Location': 'panel.cryptoquarry.net' });
  // res.end();
});

// app.post('/receive', function (request, respond) {
//   var body = '';
//   filePath = __dirname + 'data.txt';
//   request.on('data', function (data) {
//     body += data;
//   });

//   request.on('end', function () {
//     fs.appendFile(filePath, body, function () {
//       respond.end();
//     });
//   });
// });

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);