var tempHeatMapData = [];

var humHeatMapData = [];
var humHeatMap;

var sensorTemplate = `<button class="btn btn-secondary" style="margin-bottom: 5px; margin-right: 5px" onclick="focusSensor({id})"><i class="fa fa-map-pin"></i> Sensor {id}</button>`;

var currentInfoWindow;
const baseURI = 'http://localhost:3000/';

function loadSensores() {
    $.ajax({
        url: baseURI + 'user/sensores',
        dataType: "json",
        headers: {
            'token': localStorage.getItem('token'),
        },
    }).done(function (r) {

        var bounds = new google.maps.LatLngBounds();

        listaSensores = r;
        listaSensores.forEach(function (item) {
            var marker     = new google.maps.Marker({
                position: new google.maps.LatLng({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng)
                }),
                map:      mapa,
                label:    item.id
            });
            var infowindow = new google.maps.InfoWindow({
                content: 'Última lectura<br><i class="fa fa-tint"></i> <a href="javascript:showSensorHumData(' +
                         item.id + ')">Humedad</a>: ' + parseFloat(item.data[0].humedad) +
                         '%<br><i class="fa fa-thermometer"></i> <a href="javascript:showSensorTempData(' + item.id +
                         ')">Temperatura</a>: ' + parseFloat(item.data[0].temperatura) + 'º'
            });
            infowindow.addListener('closeclick', function () {
                currentInfoWindow     = null;
                chart.data.datasets = [];
                chart.update();
            });
            item.info = infowindow;
            marker.addListener('click', function () {
                if (currentInfoWindow != null) currentInfoWindow.close();
                infowindow.open(mapa, marker);
                currentInfoWindow     = infowindow;
                chart.data.datasets = [];
                chart.update();
            });
            item.marker = marker;

            bounds.extend(marker.position);

            tempHeatMapData.push({
                location: marker.position,
                weight:   item.data[0].temperatura
            });

            humHeatMapData.push({
                location: marker.position,
                weight:   item.data[0].humedad
            });

            var str = sensorTemplate.replace('{lat}', item.lat);
            str     = str.replace('{lng}', item.lng);
            str     = str.replace(/{id}/g, item.id);

            $('#sensores-list').append(str);

        });

        $("#mask").addClass("d-none");
        mapa.fitBounds(bounds);

        tempHeatMap = new google.maps.visualization.HeatmapLayer({
            data:         tempHeatMapData,
            radius:       40,
            maxIntensity: 50
        });

        humHeatMap = new google.maps.visualization.HeatmapLayer({
            data:         humHeatMapData,
            radius:       40,
            maxIntensity: 100,
            gradient:     [
                'rgba(0,255,255,0)',
                'rgba(0,255,255,1)',
                'rgba(0,0,255,1)'
            ]
        });
    });
}

function focusSensor(id) {
    listaSensores.forEach(function (item) {
        if (item.id == id) {
            mapa.panTo(item.marker.position);
        }
    });
}

function showSensorTempData(id) {

    chart.data.datasets = [];

    listaSensores.forEach(function (item) {
        if (item.id == id) {
            dataset = {
                label:           "Temp. sen. " + id, data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor:     'rgb(255,99,132)'
            }

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

    chart.data.datasets = [];

    listaSensores.forEach(function (item) {
        if (item.id == id) {
            //item.marker
            dataset = {
                label:           "Hum. sen. " + id, data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor:     'rgb(54, 162, 235)'
            }

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
    type:    'line',
    options: {
        responsive:          true,
        maintainAspectRatio: false,
        scales:              {
            xAxes: [
                {
                    type: "time",
                    time: {
                        parser:        timeFormat,
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


loadSensores();