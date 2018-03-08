const baseURI = 'http://localhost:3000/'


$(document).ready(function() {
  //Call this when page loaded
  $.ajax({
    type: "GET",
    url: baseURI + 'user',
    headers: {
      'token': localStorage.getItem('token'),
    },
    success: function(data) {
      console.log(data);
      if (data) {
        $('#placeholder-username').html(data.user.firstname);

        $('#placeholder-email').html(data.user.email);

        $('#placeholder-lastname').html(data.user.lastname);

        $('#placeholder-sexo').html(data.user.sex);

        $('#placeholder-pais').html(data.user.country);

        $('#placeholder-ciudad').html(data.user.city);

        $('#placeholder-calle').html(data.user.street);

        $('#placeholder-telefono').html(data.user.telephone);

        $('#placeholder-cod-postal').html(data.user.zip);
      } else {
        console.log('No data recieved');
      }
    },
    error: function(error) {
      console.log(error);
      window.location.assign('/index.html')
    }
  });

  //Register submit callback for form
  $('#password-form').submit(function(event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: baseURI + 'user/change_password',
      headers: {
        'token': localStorage.getItem('token'),
      },
      data: $(this).serialize(),
      success: function(data) {
        console.log(data);
        // Do something here
      },
      error: function(error) {
        console.log(error);
        // Do something here
      }
    });
  });
});