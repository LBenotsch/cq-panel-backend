// grab the packages we need
const binance = require('binance-api-node').default;
const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request');
const requestIp = require('request-ip');
const {
  BittrexClient
} = require('bittrex-node')
const Cryptopia = require('cryptopia-api')();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(requestIp.mw());

app.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send("You have reached the cq-panel-backend node server");
  console.log("/ GET - Homepage hit")
});

function PostGitlab() {
  request.post(
    'https://gitlab.com/api/v4/projects/5281857/trigger/pipeline', {
      json: {
        'token': 'ba1d7bf9cbccc3105ada5dd06df157',
        'ref': 'master',
        'variables[ANSIBLE_TASK]': '.gitlab-ci.yml'
      }
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("POST to gitlab success! whattomine-notifs job triggered.")
      }
    }
  );
}

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
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send(JSON.stringify(account.balances))
    })
    console.log("/binance GET - API requested")
  } else {
    console.log("/binance GET - Wrong public key provided")
  }
});

// returns bittrex account data, only if correct matching public key is provided
app.get('/bittrex', function (req, res) {
  var key = req.param("key");
  if (key == "078d1e09f5904381ac071a97a0685bda") {
    // Authenticated client, can make signed callss
    let client = new BittrexClient({
      apiKey: key,
      apiSecret: '05f6d559b7f8488983d4514bf3799411'
    })
    client.balance('BTC').then(account => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.send(JSON.stringify(account.Balance))
    })
    console.log("/bittrex GET - API requested")
  } else {
    console.log("/bittrex GET - Wrong public key provided")
  }
});

// returns cryptopia account data, only if correct matching public key is provided
app.get('/cryptopia', function (req, res) {
  var key = req.param("key");
  if (key == "dd0fa121eddc4ec18a9a52ddfdef411b") {
    // Authenticated client, can make signed callss
    const options = {
      API_KEY: key,
      API_SECRET: 'OTrmwgkEB3dA1U4SBU/3RHQcP/b056+bPPmx52cgk3E=',
      HOST_URL: 'https://www.cryptopia.co.nz/api'
    };
    Cryptopia.setOptions(options);

    (async function () {
      try {
        const balance = await Cryptopia.getBalance({
          Currency: 'BTC'
        });
        if (balance.Success == true) {
          var btcBalance = balance.Data[Object.keys(balance.Data)[0]].Total;
          console.log(btcBalance);
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          res.send(JSON.stringify(btcBalance))
        }
      } catch (err) {
        console.error(err);
      }
    })();

    console.log("/cryptopia GET - API requested")
  } else {
    console.log("/cryptopia GET - Wrong public key provided")
  }
});

app.post('/change_coin', function (req, res) {
  var coin = req.body.coin;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const ip = req.clientIp;
  res.end("done");
  fs.writeFile('last-ip.txt', ip, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    console.log('/change_coin POST - Saved to last-ip.txt file: ' + ip);
  });
  fs.writeFile('coin.txt', coin, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    console.log('/change_coin POST - Saved to coin.txt file: ' + coin);
  });
  PostGitlab();
});

app.get('/which_coin', function (req, res) {
  var filePath = path.join(__dirname, 'coin.txt');
  fs.readFile(filePath, {
    encoding: 'utf-8'
  }, function (err, data) {
    if (!err) {
      console.log('/which_coin GET - Coin requested from file: ' + data);
      res.setHeader("Content-Type", "text/html");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.write(data);
      res.end();

    } else {
      console.log(err);
    }
  });
});

app.get('/last_ip', function (req, res) {
  var filePath = path.join(__dirname, 'last-ip.txt');
  fs.readFile(filePath, {
    encoding: 'utf-8'
  }, function (err, data) {
    if (!err) {
      console.log('/last_ip GET - Last-ip requested from file: ' + data);
      res.setHeader("Content-Type", "text/html");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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