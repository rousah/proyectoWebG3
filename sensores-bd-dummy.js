//———————————————————— FIRST PART——————————————————



const express = require('express');

const sqlite3 = require('sqlite3');

const crypto = require('crypto');

const moment = require('moment');

const Sequelize = require('sequelize');

var bodyParser = require('body-parser')



var bcrypt = require('bcrypt');

const sequelize = new Sequelize('sqlite:cultisense.db');

const User = sequelize.import('models/user.js');

const Token = sequelize.import('models/token.js’);

const sensores = sequelize.import('models/sensores.js’);

const saltRounds = 10;

const port = 3000;

const app = express();





//————————————————————SECOND PART—————————————————





Token.belongsTo(sensores);

  sequelize.sync().then(console.log('models synced.'));

 

    sensores.findOrCreate({

        where: {

          MAC: ’56:8F:AD:34:F6:50:00'

        },

        defaults: {

          lng: '-0.4323981045',

	      lat: '32.89894354', 

        }

      })

      .spread((sensores, created) => {

        console.log(sensores.get({

          plain: true

        }));

        console.log(created);

      });

  });

};

setup();