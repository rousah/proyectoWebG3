const baseURI = 'http://localhost:3000/'

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: baseURI + 'user',
    headers: {
      'token': localStorage.getItem('token'),
    },
    success: function(data) {
      console.log(data);
      if (data) {
        $('#placeholder-username').html(data.username);
      } else {
        console.log('No data recieved');
      }
    },
    error: function(error) {
      console.log(error);
      window.location.assign('/index.html')
    }
  });
});