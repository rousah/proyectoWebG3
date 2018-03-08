const express = require('express');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const moment = require('moment');
const Sequelize = require('sequelize');
var bodyParser = require('body-parser')

var bcrypt = require('bcrypt');
const sequelize = new Sequelize('sqlite:cultisense.db');
const User = sequelize.import('models/user.js');
const Token = sequelize.import('models/token.js');
const saltRounds = 10;
const port = 3000;
const app = express();


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

function setup() {

    Token.belongsTo(User);
    sequelize.sync().then(console.log('models synced.'));
    bcrypt.hash('123456', saltRounds).then(function (hash) {
        // Store hash in your password DB.
        User.findOrCreate({
                where: {
                    email: 'perez@clts.es'
                },
                defaults: {
                    lastname: 'Pérez',
                    firstname: 'Ramón',
                    password: hash,
                    sex: 'Hombre',
                    country: 'España',
                    city: 'Málaga',
                    zip: '29780',
                    street: 'C/ Condal 45',
                    telephone: '+34 665454432',
                }
            })
            .spread((user, created) => {
                console.log(user.get({
                    plain: true
                }));
                console.log(created);
            });
    });
};
setup();

app.use(express.static('public'));

app.use('/user', function (req, res, next) {
    console.log('Auth middleware');
    Token.findOne({
        where: {
            token: req.headers.token
        }
    }).then(token => {
        if (token !== null) {
            //TODO Check validity
            next();
        } else {
            return res.status(403).send({
                message: 'Invalid Token'
            });
        }
    })
});

app.post('/login', procesar_login);
app.get('/user', procesar_user);

function procesar_login(req, res) {
    console.log(req);
    let email = req.body.email;
    let password = req.body.password;
    if (email === null || password === null) {
        return res.status(401).send({
            message: 'Empty data'
        });
    }
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user === null) {
            return res.status(401).send({
                message: 'User not found'
            });
        } else {
            bcrypt.compare(password, user.password).then(comp_res => {
                if (comp_res) {
                    crypto.randomBytes(64, (err, buf) => {
                        if (err) {
                            throw err;
                        } else {
                            const token = Token.build({
                                token: buf.toString('base64'),
                                valid: moment().add(30, 'days'),
                                userId: user.id
                            });
                            token.save().then(() => {
                                return res.send({
                                    token: token.token
                                });
                            });

                        }
                    });

                } else {
                    return res.status(401).send({
                        message: 'Incorrect password'
                    });
                }
            });
        }
    });
};

function procesar_user(req, res) {
    console.log('Get user');
    Token.findOne({
        where: {
            token: req.headers.token
        },
        include: [{
            model: User
        }]
    }).then(token => {
        if (token !== null) {
            //TODO Check validity
            let user = token.user;
            delete user.password;
            return res.send({
                user: user
            })
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
};

app.listen(port, () => {
    console.log('Running on ' + port)
})
