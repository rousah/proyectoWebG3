const express = require('express');
const sqlite3 = require('sqlite3');
const port = 3000;
const servidor = express();

servidor.get('/login', procesar_login);

function procesar_login(req, res) {

    db.get('SELECT * FROM usuarios WHERE email == \'' + req.query.email + '\'',
        (err, row) => {
            console.log(req.query.email);
            if (err != null || row == undefined) {
                return res.status(401).send({ success: false, message: 'authentication failed' });
            } else {
                console.log(row);
                if (req.query.password === row.password) {
                    res.status(200).send(row);
                } else {
                    res.status(401).send({ success: false, message: 'authentication failed' });
                }
            }
        }
    );



}

db = new sqlite3.Database('cultisense.db',
    (err) => {
        if (err != null) {
            console.log('Error opening DB' + err);
        }
    }
);

servidor.listen(port, () => {
    console.log('Running on ' + port)
})