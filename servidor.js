const express   = require('express');
const sqlite3   = require('sqlite3');
const crypto    = require('crypto');
const moment    = require('moment');
const Sequelize = require('sequelize');
var bodyParser  = require('body-parser')

var email = require('./helper/mail');

var bcrypt       = require('bcrypt');
const sequelize  = new Sequelize('sqlite:cultisense.db');
const User       = sequelize.import('./models/user.js');
const Token      = sequelize.import('./models/token.js');
const Sensor     = sequelize.import('./models/sensor.js');
const Dato       = sequelize.import('./models/dato.js');
const saltRounds = 10;
const port       = 3000;
const app        = express();


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

function setup() {

    Token.belongsTo(User);
    Sensor.belongsTo(User);
    Dato.belongsTo(Sensor);
    sequelize.sync().then(() => {
        bcrypt.hash('123456', saltRounds).then(function (hash) {
            // Store hash in your password DB.
            User.findOrCreate({
                where:    {
                    email: 'perez@clts.es'
                },
                defaults: {
                    lastname:  'Pérez',
                    firstname: 'Ramón',
                    password:  hash,
                    sex:       'Hombre',
                    country:   'España',
                    city:      'Málaga',
                    zip:       '29780',
                    street:    'C/ Condal 45',
                    telephone: '+34 665454432',
                    /*rol: 'admin',
                    activo: 'true',*/
                }
            })
                .spread((user, created) => {
                    console.log(user.get({
                        plain: true
                    }));
                    console.log('created user ' + created);

                    Sensor.findOrCreate({
                        where:    {
                            mac: '56:8F:AD:34:F6:50:00'
                        },
                        defaults: {
                            lng:    '-0.4323981045',
                            lat:    '32.89894354',
                            userId: 1,
                        }
                    })
                          .spread((sensor, created) => {
                              console.log(created);
                              Sensor.findOrCreate({
                                  where:    {
                                      mac: '57:8F:AD:34:F6:50:00'
                                  },
                                  defaults: {
                                      lng:    '-0.5323981045',
                                      lat:    '32.99894354',
                                      userId: 1,
                                  }
                              })
                                    .spread((sensor, created) => {
                                        console.log(created);
                                        Sensor.findOrCreate({
                                            where:    {
                                                mac: '58:8F:AD:34:F6:50:00'
                                            },
                                            defaults: {
                                                lng:    '-0.6323981045',
                                                lat:    '32.79894354',
                                                userId: 1,
                                            }
                                        })
                                              .spread((sensor, created) => {
                                                  console.log(sensor.get({
                                                      plain: true
                                                  }));
                                                  console.log(created);
                                              });
                                    });

                          });
                });
            Dato.create({temperatura: 33, humedad: 89, tiempo: new Date(), sensorId: 1}).then(dato => {
                Dato.create({temperatura: 34, humedad: 79, tiempo: new Date(), sensorId: 1}).then(dato => {
                    Dato.create({temperatura: 35, humedad: 99, tiempo: new Date(), sensorId: 1}).then(dato => {
                        console.log('dato created');
                    });
                });
            });
        });
    });
}

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
        }
        else {
            return res.status(403).send({
                message: 'Invalid Token'
            });
        }
    })
});

app.post('/login', procesar_login);
app.get('/user', procesar_user);
app.post('/user/change_password', procesar_password);
app.get('/user/sensores', procesar_sensores);
app.get('/user/temperatura', procesar_temperatura);
app.get('/pw_reset', procesar_pw_reset);

function procesar_pw_reset(req, res) {
    email.send();
}

function procesar_login(req, res) {
    console.log(req);
    let email    = req.body.email;
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
        }
        else {
            bcrypt.compare(password, user.password).then(comp_res => {
                if (comp_res) {
                    crypto.randomBytes(64, (err, buf) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            const token = Token.build({
                                token:  buf.toString('base64'),
                                valid:  moment().add(30, 'days'),
                                userId: user.id
                            });
                            token.save().then(() => {
                                return res.send({
                                    token: token.token
                                });
                            });

                        }
                    });

                }
                else {
                    return res.status(401).send({
                        message: 'Incorrect password'
                    });
                }
            });
        }
    });
}

function procesar_user(req, res) {
    console.log('Get user');
    Token.findOne({
        where:   {
            token: req.headers.token
        },
        include: [
            {
                model: User
            }
        ]
    }).then(token => {
        if (token !== null) {

            let user = token.user;
            return res.send({
                user: user
            })
        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })

};

function procesar_sensores(req, res) {
    console.log('Get sensor');
    Token.findOne({
        where:   {
            token: req.headers.token
        },
        include: [
            {
                model: User
            }
        ]
    }).then(token => {
        if (token !== null) {

            let user = token.user;

            Sensor.findAll({where: {userId: user.id}}).then(sensores => {
                return res.send(sensores);
            });

        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_temperatura(req, res) {
    console.log('Get temperatura');
    Token.findOne({
        where:   {
            token: req.headers.token
        },
        include: [
            {
                model: User
            }
        ]
    }).then(token => {
        if (token !== null) {
            let user = token.user;
            let mac  = req.query.mac;

            console.log(mac);
            Sensor.find({where: {mac: mac}}).then(sensor => {

                if (sensor !== null) {
                    Dato.findAll({where: {sensorId: sensor.id}}).then(datos => {
                        return res.send(datos);
                    })
                }
                else {
                    return res.status(404).send({
                        message: 'Sensor not found'
                    });
                }

            });
        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_password(req, res) {
    console.log('Post change password');
    Token.findOne({
        where:   {
            token: req.headers.token
        },
        include: [
            {
                model: User
            }
        ]
    }).then(token => {
        if (token !== null) {

            let user            = token.user;
            let old_password    = req.body.old_password;
            let new_password    = req.body.new_password;
            let re_new_password = req.body.re_new_password;

            bcrypt.compare(old_password, user.password).then(comp_res => {
                if (comp_res) {
                    console.log(new_password + '  ' + re_new_password);
                    if (new_password === re_new_password) {
                        bcrypt.hash(new_password, saltRounds).then(function (hash) {
                            user.password = hash;
                            user.save()
                            return res.send({
                                success: 'Password changed'
                            });
                        });
                    }
                    else {
                        return res.status(400).send({
                            message: 'Passwords different'
                        });
                    }

                }
                else {
                    return res.status(401).send({
                        message: 'Incorrect password'
                    });
                }
            });

        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}


app.listen(port, (e) => {
    console.log(e);
});