const baseURI = 'http://localhost:3000/'; // local develop
//const baseURI = 'http://luglo1.upv.edu.es/'; //LIVE

$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: baseURI + 'login',
            data: $(this).serialize(),
            success: function (data) {
                console.log(data.user.force_password_change);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    if(data.user.force_password_change) {
                        window.location = '/mis-datos.html';
                    }
                    else {
                        window.location = '/listaSondas.html'
                    }

                } else {
                    console.log('No token recieved');
                }
            },
            error: function (error) {
                console.log(error);
                $('#fallo-aut').show(200);
            }
        });
    });
});
