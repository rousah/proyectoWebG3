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
//const Campos = require('./public/Campos.js')  I was trying to export sensores, zonas and vertices because there are so long

const sensores = [
    //ZONA 1
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.17816305161',
        lat: '38.99522308750',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '57:8F:AD:34:F6:50:00',
        lng: '-0.17717599869',
        lat: '38.99352202642',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.170030',
        lat: '38.994605',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.177079',
        lat: '38.995249',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.177057',
        lat: '38.994307',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.176185',
        lat: '38.993803',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.176218',
        lat: '38.994485',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.176153',
        lat: '38.995218',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.175291',
        lat: '38.995186',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac:    '58:8F:AD:34:F6:50:00',
        lng:    '-0.175258',
        lat:    '38.994365',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac:    '58:8F:AD:34:F6:50:00',
        lng:    '-0.175136',
        lat:    '38.993506',
        userId: 1,
        zonaId: 1,
        temp_min: 25,
        hume_min: 75,
    },

    //ZONA 2
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '57:8F:AD:34:F6:50:00',
        lng: '-0.232539',
        lat: '39.029972',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '58:8F:AD:34:F6:50:00',
        lng: '-0.234289',
        lat: '39.030359',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 2,
        temp_min: 25,
        hume_min: 75,
    },
    //ZONA 3
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 3,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-1.834473',
        lat: '37.512706',
        userId: 1,
        zonaId: 3,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-1.833793',
        lat: '37.513370',
        userId: 1,
        zonaId: 3,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-1.835351',
        lat: '37.514366',
        userId: 1,
        zonaId: 3,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-1.836005',
        lat: '37.513676',
        userId: 1,
        zonaId: 3,
        temp_min: 25,
        hume_min: 75,
    },
    
    //ZONA 4
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 4,
        temp_min: 25,
        hume_min: 75,
    },
    //ZONA 5
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 5,
        temp_min: 25,
        hume_min: 75,
    },
    //ZONA 6
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 6,
        temp_min: 25,
        hume_min: 75,
    },
    //ZONA 7
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 7,
        temp_min: 25,
        hume_min: 75,
    },
    //ZONA 8
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    {
        mac: '56:8F:AD:34:F6:50:00',
        lng: '-0.235153',
        lat: '39.030528',
        userId: 1,
        zonaId: 8,
        temp_min: 25,
        hume_min: 75,
    },
    
    
];

const zonas = [
    {
        "name": "Campo 1",
        "color": "#8336c9",
        "userId": 1,
    },
    {
        "name": "Campo 2",
        "color": "#ff8000",
        "userId": 1,
    },
    {
        "name": "Campo 3",
        "color": "#00ceff",
        "userId": 1,
    },
    {
        "name": "Campo 4",
        "color": "#ff00e2",
        "userId": 1,
    },
    {
        "name": "Campo 5",
        "color": "#00ff14",
        "userId": 1,
    },
    {
        "name": "Campo 6",
        "color": "#fff500",
        "userId": 1,
    },
    {
        "name": "Campo 7",
        "color": "#ff0000",
        "userId": 1,
    },
    {
        "name": "Campo 8",
        "color": "#0031ff",
        "userId": 1,
    },
];

const vertices = [
    //ZONA 1
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
    //ZONA 2
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
    },
    //ZONA 3
    {
        "lat": "37.512706",
        "lng": "-1.834473",
        "zonaId": 3
    },
    {
        "lat": "37.513370",
        "lng": "-1.833793",
        "zonaId": 3
    },
    {
        "lat": "37.514366",
        "lng": "-1.835351",
        "zonaId": 3
    },
    {
        "lat": "37.513676",
        "lng": "-1.836005",
        "zonaId": 3
    },
    
    //ZONA 4
    {
        "lat": "36.736548",
        "lng": "-3.573855",
        "zonaId": 4
    },
    {
        "lat": "36.736884",
        "lng": "-3.573703",
        "zonaId": 4
    },
    {
        "lat": "36.736944",
        "lng": "-3.573715",
        "zonaId": 4
    },
    {
        "lat": "36.737056",
        "lng": "-3.573038",
        "zonaId": 4
    },
    {
        "lat": "36.737056",
        "lng": "-3.573038",
        "zonaId": 4
    },
    {
        "lat": "36.736698",
        "lng": "-3.572996",
        "zonaId": 4
    },
    {
        "lat": "36.736558",
        "lng": "-3.573022",
        "zonaId": 4
    },
    //ZONA 5
    {
        "lat": "36.944100",
        "lng": "-3.955655",
        "zonaId": 5
    },
    {
        "lat": "36.943971",
        "lng": "-3.954525",
        "zonaId": 5
    },
    {
        "lat": "36.943692",
        "lng": "-3.954405",
        "zonaId": 5
    },
    {
        "lat": "36.943849",
        "lng": "-3.955696",
        "zonaId": 5
    },
    
    //ZONA 6
    {
        "lat": "37.463833",
        "lng": "-6.033069",
        "zonaId": 6
    },
    {
        "lat": "37.463928",
        "lng": "-6.032502",
        "zonaId": 6
    },
    {
        "lat": "37.462230",
        "lng": "-6.031949",
        "zonaId": 6
    },
    {
        "lat": "37.462218",
        "lng": "-6.032527",
        "zonaId": 6
    },
    
    //ZONA 7
    {
        "lat": "41.894888",
        "lng": "-5.778184",
        "zonaId": 7
    },
    {
        "lat": "41.895256",
        "lng": "-5.777373",
        "zonaId": 7
    },
    {
        "lat": "41.893842",
        "lng": "-5.775793",
        "zonaId": 7
    },
    {
        "lat": "41.893729",
        "lng": "-5.776824",
        "zonaId": 7
    },
    
    //ZONA 8
    {
        "lat": "43.272600",
        "lng": "-8.397738",
        "zonaId": 8
    },
    {
        "lat": "43.272714",
        "lng": "-8.397869",
        "zonaId": 8
    },
    {
        "lat": "43.272782",
        "lng": "-8.397889",
        "zonaId": 8
    },
    {
        "lat": "43.272850",
        "lng": "-8.397525",
        "zonaId": 8
    },
    {
        "lat": "43.272891",
        "lng": "-8.397537",
        "zonaId": 8
    },
    {
        "lat": "43.272903",
        "lng": "-8.397445",
        "zonaId": 8
    },
    {
        "lat": "43.272974",
        "lng": "-8.397462",
        "zonaId": 8
    },
    {
        "lat": "43.273219",
        "lng": "-8.396448",
        "zonaId": 8
    },
    {
        "lat": "43.273061",
        "lng": "-8.396403",
        "zonaId": 8
    },
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
                        force_password_change: true,
                        alerts: false,
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

                            for (i = 1; i < 15; i++) {
                                date = new Moment();
                                for (j = 1; j < 20; j++) {
                                    Dato.create({
                                        temperatura: Math.floor(Math.random() * (
                                            40 - 10 + 1
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
app.post('/user/soporte_mail', procesar_soporte_mail);
app.get('/user', procesar_user);
app.post('/user/change_password', procesar_password);
app.post('/user', procesar_user_post);
app.post('/user/sensor', procesar_sensor_post);
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
                                    token: token.token,
                                    user: user
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
                                as: 'data'
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

            let user = token.user;
            if(!user.alerts) {
                return res.send([]);
            }

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
                            /*if (data.temperatura > zona.temp_max) {
                                console.log("too high");
                                alerts.push({
                                    zona: zona,
                                    sensor: sensor,
                                    alert: 'temperatura_maxima'
                                })
                            }*/
                            if (data.temperatura < sensor.temp_min) {
                                console.log("too low");
                                alerts.push({
                                    zona: zona,
                                    sensor: sensor,
                                    alert: 'temperatura_minima'
                                })
                            }
                            if (data.humedad < sensor.hume_min) {
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
                            user.force_password_change = false;
                            user.save();
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

function procesar_soporte_mail(req, res) {
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
            let subject  = req.body.subject;
            let text = req.body.text;
            email.sendSopporte(user, subject, text);
            res.send();
        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_user_post(req, res) {
    console.log('Post change user');
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
            let updated_user = JSON.parse(req.body.user);
            console.log(user.alerts);
            console.log(req.body.user.alerts);
            console.log(req.body.user);
            console.log(updated_user.alerts);

            user.alerts = updated_user.alerts;
            user.save();
            return res.send({
                success: 'User changed'
                            });

        }
        else {
            return res.status(404).send({
                message: 'User not found'
            });
        }
    })
}

function procesar_sensor_post(req, res) {
    console.log('Post change sensor');
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

            let user         = token.user;
            let updated_sensor = JSON.parse(req.body.sensor);

            Sensor.findOne({
                where:   {
                    id: updated_sensor.id
                }
            }).then(sensor => {
                if(sensor.userId !== user.id) {
                    return res.status(400).send({
                        message: 'Not owner of sensor'
                    });
                }
                sensor.temp_min = updated_sensor.temp_min;
                sensor.hume_min = updated_sensor.hume_min;
                sensor.save();
                return res.send({
                    success: 'Sensor changed'
                });
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
