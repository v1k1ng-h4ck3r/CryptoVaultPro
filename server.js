const express = require('express');
const bodyParser = require('body-parser');
const { Api, JsonRpc, JsSignatureProvider } = require('eosjs');
const fetch = require('node-fetch'); // node-fetch@2.x
const { TextEncoder, TextDecoder } = require('text-encoding'); // text-encoding

const app = express();
const port = 3000;

// Middleware to parse the body of the POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// EOS network configuration
const rpc = new JsonRpc('https://eos.greymass.com:443', { fetch }); // EOS mainnet

// POST endpoint to handle the transaction request
app.post('/transfer', async (req, res) => {
  const { from, to, amount, memo, privateKey } = req.body;
  const signatureProvider = new JsSignatureProvider([privateKey]); // Initialize signature provider with the private key

  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const result = await api.transact({
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          from: from,
          to: to,
          quantity: `${parseFloat(amount).toFixed(4)} EOS`, // Amount should have 4 decimal places
          memo: memo,
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });

    res.json({ message: 'Transaction successful', txid: result.transaction_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Transaction failed', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`CryptoVault Pro running at http://localhost:${port}/`);
});
