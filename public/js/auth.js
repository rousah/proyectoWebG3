const baseURI = 'http://localhost:3000/'

$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: baseURI + 'login',
            data: $(this).serialize(),
            success: function (data) {
                console.log(data);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location = '/mis-datos.html';
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
