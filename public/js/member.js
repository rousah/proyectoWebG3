const baseURI = 'http://localhost:3000/';


$(document).ready(function () {
    //Call this when page loaded
    $.ajax({
        type: "GET",
        url: baseURI + 'user',
        headers: {
            'token': localStorage.getItem('token'),
        },
        success: function (data) {
            console.log(data);
            if (data) {
                $('#placeholder-firstname').val(data.user.firstname);

                $('#placeholder-email').val(data.user.email);

                $('#placeholder-lastname').val(data.user.lastname);

                $('#placeholder-sexo').val(data.user.sex);

                $('#placeholder-pais').val(data.user.country);

                $('#placeholder-ciudad').val(data.user.city);

                $('#placeholder-direccion').val(data.user.street);

                $('#placeholder-telefono').val(data.user.telephone);

                $('#placeholder-cod-postal').val(data.user.zip);
            } else {
                console.log('No data recieved');
            }
        },
        error: function (error) {
            console.log(error);
            window.location.assign('/index.html')
        }
    });

    //Register submit callback for form
    $('#password-form').submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: baseURI + 'user/change_password',
            headers: {
                'token': localStorage.getItem('token'),
            },
            data: $(this).serialize(),
            success: function (data) {
                console.log(data);
                $('#password-success-alert').show(200);
                $('#continuar').prop('disabled', false)
            },
            error: function (error) {
                console.log(error);
                $('#password-error-alert').show(200);
            }
        });
    });
});
