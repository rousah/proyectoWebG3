const baseURI = 'http://localhost:3000/'; // local develop
var tempHeatMapData = [];
var listaSensores = [];

var humHeatMapData = [];
var humHeatMap;

var sensorTemplate = `<button class="btn btn-secondary" style="margin: 5px" onclick="focusSensor({id})"><i class="fa fa-map-pin"></i> Sonda {id}</button>`;
var sensorTemplate2 = `<button class="btn btn-secondary" style="margin: 5px" onclick="showSensorHumData({id})"><i class="fa fa-map-pin"></i> Sonda {id}</button>`;
var sensorTemplate3 = `<p style="margin: 5px; background-color: white; color:black;"><i class="fa fa-map-pin"></i> Sonda {id}</p>`;

var currentInfoWindow;
var bounds = new google.maps.LatLngBounds();


//const baseURI = 'http://luglo1.upv.edu.es/'; //LIVE

function loadSensores(sensores) {

    var newSensores = sensores;
    newSensores.forEach(function (item) {
        var icon = {
            url: "../images/pin_mapa.svg", // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng({
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lng)
            }),
            map: mapa,
            //label: String(item.id),
            animation: google.maps.Animation.DROP,
            visible: false,
            icon: new google.maps.MarkerImage('../images/marcador_azul.png',
                null, null, null, new google.maps.Size(35, 35)),
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<p class="text-center font-weight-bold" style="margin-bottom:0;">Última lectura<br><a href="javascript:showSensorHumData(' +
                item.id + ')"><button class="btn" style="margin:0.25rem 0.5rem; background-color:#4098bc;"><i class="fas fa-chart-area"></button></a></i><i class="fas fa-tint"></i>' + parseFloat(item.data[0].humedad) +
                '%<br><a href="javascript:showSensorTempData(' + item.id +
                ')"><button class="btn" style="margin:0.25rem 0.5rem; background-color:#cb5050;"><i class="fas fa-chart-area"></i></button></a></i><i class="fas fa-thermometer-three-quarters"></i> ' + parseFloat(item.data[0].temperatura) + 'º </p>'
        });
        infowindow.addListener('closeclick', function () {
            currentInfoWindow = null;
            chart.data.datasets = [];
            chart.update();
        });
        item.info = infowindow;
        marker.addListener('click', function () {
            if (currentInfoWindow != null) currentInfoWindow.close();
            infowindow.open(mapa, marker);
            currentInfoWindow = infowindow;
            chart.data.datasets = [];
            chart.update();
        });
        item.marker = marker;

        bounds.extend(marker.position);

        tempHeatMapData.push({
            location: marker.position,
            weight: item.data[0].temperatura
        });

        humHeatMapData.push({
            location: marker.position,
            weight: item.data[0].humedad
        });

        var str = sensorTemplate.replace('{lat}', item.lat);
        str = str.replace('{lng}', item.lng);
        str = str.replace(/{id}/g, item.id);

        $('#sensores-list').append(str);

        var str2 = sensorTemplate2.replace('{lat}', item.lat);
        str2 = str2.replace('{lng}', item.lng);
        str2 = str2.replace(/{id}/g, item.id);

        $('#sensores').append(str2);
        listaSensores.push(item);
    });

    $("#mask").addClass("d-none");

    mapa.fitBounds(bounds);

    tempHeatMap = new google.maps.visualization.HeatmapLayer({
        data:         tempHeatMapData,
        radius:       50,
        maxIntensity: 45,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgb(245, 255, 0)',
            'rgb(255, 245, 0)',
            'rgb(255, 235, 0)',
            'rgb(255, 206, 0)',
            'rgb(255, 167, 0)',
            'rgb(223, 154, 0)',
            'rgb(255, 98, 0)',
            'rgb(248, 96, 0)',
            'rgb(255, 78, 0)',
            'rgb(255, 78, 0)',
            'rgb(255, 1, 1)',
            'rgb(183, 0, 0)',
            'rgb(255, 0, 0)'
            
        ],
    });

    humHeatMap = new google.maps.visualization.HeatmapLayer({
        data:         humHeatMapData,
        radius:       50,
        maxIntensity: 100,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgb(0, 0, 98)',
            'rgb(0, 0, 69)',
            'rgb(0, 0, 46)',
            'rgb(0, 0, 15)'
            
        ],
    });

    $('#campoSelect').modal('show');
}

function focusSensor(id) {
    listaSensores.forEach(function (item) {
        if (item.id == id) {
            infowindow = item.info;
            mapa.panTo(item.marker.position);
            if (currentInfoWindow != null) currentInfoWindow.close();
            infowindow.open(mapa, item.marker);
            currentInfoWindow = infowindow;
            chart.data.datasets = [];
            chart.update();

            var str3 = sensorTemplate3.replace(/{id}/g, item.id);
            $('#sensorSelect').empty();
            $('#sensorSelect').append(str3);
            
        }
        
    });
}

function refreshSensorList(zona_id) {
    $('#sensores-list').empty();
    $('#sensores').empty();

    listaSensores.forEach(function (sensor) {
        if (sensor.zonaId === zona_id) {
            sensor.marker.setVisible(true);
            var str = sensorTemplate.replace('{lat}', sensor.lat);
            str = str.replace('{lng}', sensor.lng);
            str = str.replace(/{id}/g, sensor.id);

            $('#sensores-list').append(str);

            var str2 = sensorTemplate2.replace('{lat}', sensor.lat);
            str2 = str2.replace('{lng}', sensor.lng);
            str2 = str2.replace(/{id}/g, sensor.id);
            $('#sensores').append(str2);
        }
    });
}

function showSensorTempData(id) {

    $('#graphModalLabel').text("Temperatura sonda " + id);
    $('#humedad').html('<a href="javascript:showSensorHumData(' + id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#4098bc"><i class="fas fa-tint"></i></a>');
    $('#temperatura').html('<a href="javascript:showSensorTempData(' + id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#cb5050"><i class="fas fa-thermometer-three-quarters"></i></a>');
    $('#graphModal').modal('show');
    chart.data.datasets = [];
    listaSensores.forEach(function (item) {
        if (item.id == id) {
            dataset = {
                label: "Temp. sen. " + id,
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255,99,132)'
            };

            item.data.forEach(function (d) {
                dataset.data.push({
                    t: d.tiempo,
                    y: d.temperatura
                })
            });

            chart.options.scales.yAxes[0].ticks.suggestedMax = 50;
            chart.options.scales.yAxes[0].ticks.suggestedMin = 0;

            chart.data.datasets.push(dataset);
        }
    });

    chart.update();
}

function showSensorHumData(id) {

    $('#graphModalLabel').text("Humedad sonda " + id);
    $('#humedad').html('<a href="javascript:showSensorHumData(' + id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#4098bc"><i class="fas fa-tint"></i></a>');
    $('#temperatura').html('<a href="javascript:showSensorTempData(' + id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#cb5050"><i class="fas fa-thermometer-three-quarters"></i></a>');
    /* $('#sensores').html(`<button class="btn btn-secondary" style="margin: 5px" onclick="focusSensor({id})"><i class="fa fa-map-pin"></i> Sonda {id}</button>`);*/
    $('#graphModal').modal('show');
    chart.data.datasets = [];

    listaSensores.forEach(function (item) {
        if (item.id == id) {
            //item.marker
            dataset = {
                label: "Hum. sen. " + id,
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)'
            };

            item.data.forEach(function (d) {
                dataset.data.push({
                    t: d.tiempo,
                    y: d.humedad
                })
            });

            chart.options.scales.yAxes[0].ticks.suggestedMax = 100;
            chart.options.scales.yAxes[0].ticks.suggestedMin = 0;

            chart.data.datasets.push(dataset);
        }
    });

    chart.update();
}

var tempHeatMap;

function showTemp(e) {
    if (e.classList.contains("active")) {
        // ocultar mapa de calor
        tempHeatMap.setMap(null);
        e.classList.replace("btn-light", "btn-secondary");
        $('#eye-temp').addClass('fa-eye-slash');
        $('#eye-temp').removeClass('fa-eye');
    }
    else {
        // mostrar mapa de calor
        tempHeatMap.setMap(mapa);
        e.classList.replace("btn-secondary", "btn-light");
        $('#eye-temp').removeClass('fa-eye-slash');
        $('#eye-temp').addClass('fa-eye');
    }
}

function showHum(e) {
    if (e.classList.contains("active")) {
        // ocultar mapa de calor
        humHeatMap.setMap(null);
        e.classList.replace("btn-light", "btn-secondary");
        $('#eye-hume').addClass('fa-eye-slash');
        $('#eye-hume').removeClass('fa-eye');
    }
    else {
        // mostrar mapa de calor
        humHeatMap.setMap(mapa);
        e.classList.replace("btn-secondary", "btn-light");
        $('#eye-hume').removeClass('fa-eye');
        $('#eye-hume').addClass('fa-eye-slash');
    }
}


var ctx = window.document.getElementById('grafica').getContext('2d');
var timeFormat = 'YYYY-MM-DD HH:mm:ss';
var chart = new Chart(ctx, {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    type: "time",
                    time: {
                        parser: timeFormat,
                        // round: 'day'
                        tooltipFormat: 'll HH:mm'
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            ]
        }
    }
});
