var tempHeatMapData = [];
var listaSensores = [];

var humHeatMapData = [];
var humHeatMap;

var sensorTemplate = `<button class="btn btn-secondary" style="margin: 5px" onclick="focusSensor({id})"><i class="fa fa-map-pin"></i> Sonda {id}</button>`;

var currentInfoWindow;
const baseURI = 'http://localhost:3000/'; // local develop
//const baseURI = 'http://luglo1.upv.edu.es/'; //LIVE

function loadSensores(sensores) {
    /*$.ajax({
        url: baseURI + 'user/sensores',
        dataType: "json",
        headers: {
            'token': localStorage.getItem('token'),
        },
    }).done(function (r) {*/

    var bounds = new google.maps.LatLngBounds();

    listaSensores = sensores;
    listaSensores.forEach(function (item) {
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
            label: item.id,
            icon: icon,
            icon: new google.maps.MarkerImage('../images/pin_mapa.png',
                null, null, null, new google.maps.Size(35, 35)),
        });

        var infowindow = new google.maps.InfoWindow({
            content: '<p class="text-center font-weight-bold" style="margin-bottom:0;">Última lectura<br><a href="javascript:showSensorHumData(' +
                item.id + ')"><button class="btn" style="margin:0.25rem 0.5rem;"><i class="fas fa-chart-area"></button></a></i><i class="fas fa-tint"></i>' + parseFloat(item.data[0].humedad) +
                '%<br><a href="javascript:showSensorTempData(' + item.id +
                ')"><button class="btn" style="margin:0.25rem 0.5rem;"><i class="fas fa-chart-area"></i></button></a></i><i class="fas fa-thermometer-three-quarters"></i> ' + parseFloat(item.data[0].temperatura) + 'º </p>'
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

    });

    $("#mask").addClass("d-none");
    mapa.fitBounds(39.002249, -0.225464);

    tempHeatMap = new google.maps.visualization.HeatmapLayer({
        data: tempHeatMapData,
        radius: 40,
        maxIntensity: 50
    });

    humHeatMap = new google.maps.visualization.HeatmapLayer({
        data: humHeatMapData,
        radius: 40,
        maxIntensity: 100,
        gradient: [
                'rgba(0,255,255,0)',
                'rgba(0,255,255,1)',
                'rgba(0,0,255,1)'
            ]
    });
    //});
}

function focusSensor(id) {
    listaSensores.forEach(function (item) {
        if (item.id == id) {
            mapa.panTo(item.marker.position);
        }
    });
}

function showSensorTempData(id) {

    $('#graphModalLabel').text("Temperatura sonda " + id);
    $('#humedad').html('<a href="javascript:showSensorHumData('+ id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#4098bc"><i class="fas fa-tint"></i></a>');
    $('#temperatura').html('<a href="javascript:showSensorTempData('+ id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#cb5050"><i class="fas fa-thermometer-three-quarters"></i></a>');
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
    $('#humedad').html('<a href="javascript:showSensorHumData('+ id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#4098bc"><i class="fas fa-tint"></i></a>');
    $('#temperatura').html('<a href="javascript:showSensorTempData('+ id + ')" class="badge badge-light" style="font-size: 1.5rem; color:#cb5050"><i class="fas fa-thermometer-three-quarters"></i></a>');
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
