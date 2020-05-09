const express = require('express');

const app = express();

app.use(express.static('./dist/colas'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/colas/'}),
);

app.listen(process.env.PORT || 8080);