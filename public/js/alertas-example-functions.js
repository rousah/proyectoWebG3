//const baseURI = 'http://localhost:3000/'; // local develop
//const baseURI = 'http://luglo1.upv.edu.es/'; //LIVE

let user = {};

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
            user = data.user;
            if (data) {
                $('#alerts-box').prop('checked', user.alerts);
                $('#alerts-status').text(user.alerts);
                if (user.alerts) {
                    $('#sensor-alerts').show();
                } else {
                    $('#sensor-alerts').hide();
                }
            } else {
                console.log('No data recieved');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    $.ajax({
        url: baseURI + 'user/zonas',
        dataType: "json",
        headers: {
            'token': localStorage.getItem('token'),
        },
        success: function (data) {
            console.log(data);
            zonas = data;
            if (data) {
                zonas.forEach(function (zone) {
                    $('#sensor-alerts').append('<div id="accordionSensor' + zone.id + '"><div id="headingSensor' + zone.id + '"><h6>' + zone.name + '<button data-toggle="collapse" data-target="#collapseSensor' + zone.id + '" aria-expanded="true" aria-controls="collapseSensor' + zone.id + '" style="background: none; border: 0"><i class="fas fa-angle-down ml-1 btn btn-primary p-0 m-0" style="font-size: 1.5rem;"></i></button></h6></div><div id="collapseSensor' + zone.id + '" class="collapse hide" aria-labelledby="headingSensor' + zone.id + '" data-parent="#accordionSensor' + zone.id + '"><div id="zone-' + zone.id + '"></div></div></div>');
                    zone.sensors.forEach(function (sensor) {
                        $('#zone-' + zone.id)
                            .append('<div> <span> Sensor ' + sensor.id + '<br> temp_min: </span> <input id="temp-range-' + sensor.id + '" type="range" min="0" max="50" step="10"><input id="temp-number-' + sensor.id + '"type="number" style="border:none; width: 3rem; margin-left: 1rem;" disabled> <br>' +  '<span>' + ' hume_min: </span> <input id="hume-range-' + sensor.id + '" type="range" min="0" max="100" step="10"><input id="hume-number-' + sensor.id + '"type="number" style=" border:none; width: 3rem; margin-left: 1rem;" disabled>' + '<button style="margin-left:1rem;" class="btn btn-outline-primary col-2 pl-2" onclick="save_sensor(' + sensor.id + ')">' + 'Save</button>' + '</div>');
                        console.log($('#temp-range-' + sensor.id));
                        $('#temp-range-' + sensor.id).val(sensor.temp_min);
                        $('#temp-number-' + sensor.id).val(sensor.temp_min);
                        $('#hume-range-' + sensor.id).val(sensor.hume_min);
                        $('#hume-number-' + sensor.id).val(sensor.hume_min);
                        $('#temp-range-' + sensor.id).change(function (e) {
                            $('#temp-number-' + sensor.id).val($(this).val());
                        });
                        $('#hume-range-' + sensor.id).change(function (e) {
                            $('#hume-number-' + sensor.id).val($(this).val());
                        });
                    })
                })
            } else {
                console.log('No data recieved');
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

$('#campana-true').append('<i class="far fa-bell"></i>');
$('#campana-false').append('<i class="far fa-bell-slash"></i>');
$('#campana-false').hide();
$('#campana-true').hide();

$('#alerts-box').click(function () {  
    $('#alert-status').hide();
    $('#alerts-status').is(":checked");            
    if ($(this).is(":checked")) {        
        $('#campana-false').hide();        
        $('#sensor-alerts').show();        
        $('#campana-true').show();    
    }    
    else {        
        $('#campana-true').hide();        
        $('#sensor-alerts').hide();        
        $('#campana-false').show();    
    }
});

function save_user() {
    console.log('hi');
    user.alerts = $('#alerts-box').is(":checked");
    $.ajax({
        type: "POST",
        url: baseURI + 'user',
        headers: {
            'token': localStorage.getItem('token'),
        },
        data: {
            'user': JSON.stringify(user)
        }, //$(this).serialize(),
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

function save_sensor(id) {
    let sensor = {
        id: id
    };
    sensor.temp_min = $('#temp-range-' + id).val();
    sensor.hume_min = $('#hume-range-' + id).val();
    console.log(sensor);

    $.ajax({
        type: "POST",
        url: baseURI + 'user/sensor',
        headers: {
            'token': localStorage.getItem('token'),
        },
        data: {
            'sensor': JSON.stringify(sensor)
        }, //$(this).serialize(),
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
