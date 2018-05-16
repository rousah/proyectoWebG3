const express = require('express');
const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const moment = require('moment');
const Sequelize = require('sequelize');
const Moment = require('moment');
var bodyParser = require('body-parser');

var email = require('./helper/mail');

var bcrypt = require('bcrypt');
const sequelize = new Sequelize('sqlite:cultisense.db');
const User = sequelize.import('./models/user.js');
const Token = sequelize.import('./models/token.js');
const Sensor = sequelize.import('./models/sensor.js');
const Dato = sequelize.import('./models/dato.js');
const Zona = sequelize.import('./models/zona.js');
const Vertice = sequelize.import('./models/vertice.js');
const saltRounds = 10;
const port = 3000;
const app = express();

const sensores = [
    //ZONA 1
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.17816305161',
        lat: '38.99522308750',
        userId: 1,
        zonaId: 1,
    },
    {
        mac: '57:8F:AD:34:F6:50:00',
        lng: '-0.17717599869',
        lat: '38.99352202642',
        userId: 1,
        zonaId: 1,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.17204761505',
        lat: '38.90405569704',
        userId: 1,
        zonaId: 1,
    },
    //ZONA 2
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 2,
    },
    {
        mac: '57:8F:AD:34:F6:50:00',
        lng: '-0.232539',
        lat: '39.029972',
        userId: 1,
        zonaId: 2,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.234289',
        lat: '39.030359',
        userId: 1,
        zonaId: 2,
    }
];

const zonas = [
    {
        "name": "Campo de alcachofas",
        "color": "#8336c9",
        "userId": 1,
        "temp_max": 30,
        "temp_min": 20,
        "hume_min": 50,
    },
    {
        "name": "Campo de trigo",
        "color": "#ff8000",
        "userId": 1,
        "temp_max": 25,
        "temp_min": 20,
        "hume_min": 75,
    }
];

const vertices = [
    {
        "lat": "38.99574370819",
        "lng": "-0.17884278223",
        "zonaId": 1
    },
    {
        "lat": "38.99557694053",
        "lng": "-0.16709113046",
        "zonaId": 1
    },
    {
        "lat": "38.99357013889",
        "lng": "-0.16756319925",
        "zonaId": 1
    },
    {
        "lat": "38.99314486752",
        "lng": "-0.17780208513",
        "zonaId": 1
    },
    {
        "lat": "38.99352010710",
        "lng": "-0.17782711908",
        "zonaId": 1
    },
    {
        "lat": "39.03081634558",
        "lng": "-0.23717880249",
        "zonaId": 2
    },
    {
        "lat": "39.03073717026",
        "lng": "-0.23545324802",
        "zonaId": 2
    },
    {
        "lat": "39.03161434444",
        "lng": "-0.23424714804",
        "zonaId": 2
    },
    {
        "lat": "39.03160809384",
        "lng": "-0.23295521737",
        "zonaId": 2
    },
    {
        "lat": "39.03236649702",
        "lng": "-0.23117780685",
        "zonaId": 2
    },
    {
        "lat": "39.03050519998",
        "lng": "-0.23063063621",
        "zonaId": 2
    },
    {
        "lat": "39.02909669337",
        "lng": "-0.23297309875",
        "zonaId": 2
    },
    {
        "lat": "39.02913836556",
        "lng": "-0.23335218429",
        "zonaId": 2
    },
    {
        "lat": "39.02845493844",
        "lng": "-0.23529767990",
        "zonaId": 2
    },
    {
        "lat": "39.02848827650",
        "lng": "-0.23595571518",
        "zonaId": 2
    }
];

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

function setup() {

    User.hasOne(Token);
    Token.belongsTo(User);
    User.hasMany(Sensor);
    Sensor.belongsTo(User);
    Zona.hasMany(Vertice);
    Sensor.belongsTo(Zona);
    Sensor.hasMany(Dato, {
        as: 'data'
    });
    Dato.belongsTo(Sensor);
    User.hasMany(Zona);
    Zona.belongsTo(User);
    Zona.hasMany(Sensor);
    Vertice.belongsTo(Zona);

    sequelize.sync().then(() => {
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
                        /*rol: 'admin',
                        activo: 'true',*/
                    }
                })
                .spread((user, created) => {
                    console.log("user: " + user + " created: " + created);
                    if (created) {
                        console.log("creating data");
                        let promises = [];

                        zonas.forEach((zona) => {
                            promises.push(Zona.create(zona));
                        });

                        sensores.forEach((sensor) => {
                            promises.push(Sensor.create(sensor));
                        });

                        Sequelize.Promise.all(promises).then(() => {

                            for (i = 1; i < 7; i++) {
                                date = new Moment();
                                for (j = 1; j < 20; j++) {
                                    Dato.create({
                                        temperatura: Math.floor(Math.random() * (
                                            30 - 10 + 1
                                        ) + 10),
                                        humedad: Math.floor(Math.random() * (
                                            95 - 60 + 1
                                        ) + 60),
                                        tiempo: date.add(1, 'hours').toDate(),
                                        sensorId: i
                                    });
                                }
                            }
                        });


                        Sequelize.Promise.all(promises).then(() => {
                            vertices.forEach((vertice) => {
                                Vertice.create(vertice);
                            })
                        });

                    }
                })
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
        } else {
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
app.get('/user/alertas', procesar_alertas);
app.get('/user/zonas', procesar_zonas);
app.get('/user/temperatura', procesar_temperatura);
app.get('/pw_reset', procesar_pw_reset);

function procesar_pw_reset(req, res) {
    email.send();
}

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
}

function procesar_user(req, res) {
    console.log('Get user');
    Token.findOne({
        where: {
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
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })

};

function procesar_sensores(req, res) {
    console.log('Get sensor');
    Token.findOne({
        where: {
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

            Sensor.findAll({
                where: {
                    userId: user.id
                },
                include: [
                    {
                        model: Dato,
                        as: 'data'
                    }
                ],
                order: [[{
                    model: Dato,
                    as: 'data'
                }, 'tiempo']]
            }).then(sensores => {
                return res.send(sensores);
            });
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_zonas(req, res) {
    Token.findOne({
        where: {
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
            console.log(Zona.associations);
            console.log(Sensor.associations);
            console.log(Vertice.associations);

            Zona.findAll({
                where: {
                    userId: user.id
                },
                include: [{
                    model: Vertice,
                    separate: true
        }, {
                    model: Sensor,
                    separate: true,
                    include: [
                        {
                            model: Dato,
                            as: 'data'
                    }
                ],
                    order: [
                        [
                            {
                                model: Dato,
                                as:    'data'
                            }, 'tiempo'
                        ]
                    ]
        }, ],
                //TODO Order this!
                //order: [Vertice, 'id'],
            }).then(zonas => {
                return res.send(zonas);
            });
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_alertas(req, res) {
    Token.findOne({
        where: {
            token: req.headers.token
        },
        include: [
            {
                model: User
            }
        ]
    }).then(token => {
        if (token !== null) {

            let user = token.user

            Zona.findAll({
                where: {
                    userId: user.id
                },
                include: [
                    {
                        model: Sensor,
                        include: [{
                            model: Dato,
                            as: 'data'
                        }]
                    }
                ],
                //order:   ['Zona.Sensor.data.tiempo']
                //TODO SORT BY DATE
                //order: [Zona.associations.sensor, Sensor.associations.data, 'tiempo'],
            }).then(zonas => {
                console.log(Zona.associations);
                console.log(Sensor.associations);
                console.log(zonas);
                alerts = [];
                zonas.forEach((zona) => {

                    zona.sensors.forEach(sensor => {
                        //console.log(sensor);

                        if (sensor.data.length !== 0) {
                            //console.log(sensor.data);
                            //console.log(sensor.data.length);
                            data = sensor.data[sensor.data.length - 1];
                            console.log(data.temperatura);
                            console.log(data.humedad);
                            console.log(zona.temp_max);
                            console.log(zona.temp_min);
                            console.log(zona.hume_min);
                            if (data.temperatura > zona.temp_max) {
                                console.log("too high");
                                alerts.push({
                                    zona: zona,
                                    sensor: sensor,
                                    alert: 'temperatura_maxima'
                                })
                            }
                            if (data.temperatura < zona.temp_min) {
                                console.log("too low");
                                alerts.push({
                                    zona: zona,
                                    sensor: sensor,
                                    alert: 'temperatura_minima'
                                })
                            }
                            if (data.humedad < zona.hume_min) {
                                console.log("hume");
                                alerts.push({
                                    zona: zona,
                                    sensor: sensor,
                                    alert: 'humedad_minima'
                                })
                            }
                        }

                    })

                    //data = sensor.data[sensor.data.length];
                    //TODO change this to user.temeperatura_warn 
                    //if(data.temperatura > 40) {
                    //    alerts.push({sensor: sensor, alert: 'temperature_maximo'})
                    //}
                });

                return res.send(alerts);
            });
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}


function procesar_temperatura(req, res) {
    console.log('Get temperatura');
    Token.findOne({
        where: {
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
            let mac = req.query.mac;

            console.log(mac);
            Sensor.find({
                where: {
                    mac: mac
                }
            }).then(sensor => {

                if (sensor !== null) {
                    Dato.findAll({
                        where: {
                            sensorId: sensor.id
                        }
                    }).then(datos => {
                        return res.send(datos);
                    })
                } else {
                    return res.status(404).send({
                        message: 'Sensor not found'
                    });
                }

            });
        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_password(req, res) {
    console.log('Post change password');
    Token.findOne({
        where: {
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
            let old_password = req.body.old_password;
            let new_password = req.body.new_password;
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
                    } else {
                        return res.status(400).send({
                            message: 'Passwords different'
                        });
                    }

                } else {
                    return res.status(401).send({
                        message: 'Incorrect password'
                    });
                }
            });

        } else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}


app.listen(port, (e) => {
    console.log(e);
});
