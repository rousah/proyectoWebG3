'use strict';
const nodemailer = require('nodemailer');

module.exports = {
    sendSopporte: function (user, subject, text) {


        let transporter = nodemailer.createTransport({

            service: 'gmail',
            auth:    {
                user: 'cultisense@gmail.com',
                pass: 'Grupo03uni'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from:    '"Cultisense soporte forma" <cultisense@gmail.com>', // sender address
            to:      'romansanzmarti@gmail.com', // list of receivers
            subject: '[' + user.firstname + ' ' + user.lastname + '] ' + subject, // Subject line
            text:    text, // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);

        });
    }
};