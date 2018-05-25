const baseURI = 'http://localhost:3000/'; // local develop
//const baseURI = 'http://luglo1.upv.edu.es/'; //LIVE

$(document).ready(function () {
    $('#soporte-form').submit(function (event) {
        event.preventDefault();
        $.ajax({
            type:    "POST",
            url:     baseURI + 'user/soporte_mail',
            data:    $(this).serialize(),
            headers: {
                'token': localStorage.getItem('token'),
            },
            success: function (data) {
                $('#success-alert').show(200);
            },
            error:   function (error) {
                console.log(error);
                $('#error-alert').show(200);
            }
        });
    });
});
