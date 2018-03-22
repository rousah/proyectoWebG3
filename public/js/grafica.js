const baseURI = 'http://localhost:3000/';
var opciones = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Horas'
            }
                        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'ºC'
            },
            ticks: {
                min: 0,
                max: 30,
                stepSize: 2
            }
                        }]
    }
};


var datos = {
    labels: ['00: 00', '01: 00', '02:00', '03:00', '04:00', '05: 00', '06: 00', '07:00', '08:00', '09:00', '10: 00', '11: 00', '12:00', '13:00', '14:00', '15: 00', '16: 00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],
    datasets: []
};

var avanceReal = {
    label: 'Temp sonda 1',
    backgroundColor: 'rgb(0, 20, 255)',
    borderColor: 'rgb(0, 20, 255)',
    fill: false,
    lineTension: 0,
    hidden: true,
    data: [11, 10, 10, 10, 10, 10, 11, 11, 11, 12, 13, 14, 15, 16, 16, 16, 16, 15, 14, 13, 13, 13, 13, 13, 13]
};

var avanceReal2 = {
    label: 'Temp sonda 2',
    backgroundColor: 'rgb(255, 11, 255)',
    borderColor: 'rgb(255, 11, 255)',
    fill: false,
    lineTension: 0,
    hidden: true,
    data: [12, 12, 12, 13, 13, 13, 14, 14, 18, 18, 18, 19, 18, 18, 17, 16, 16, 15, 13, 12, 12, 11, 10, 10, 9]
};

var avanceReal3 = {
    label: 'Temp sonda 3',
    backgroundColor: 'rgb(3, 136, 39)',
    borderColor: 'rgb(4, 136, 39)',
    fill: false,
    lineTension: 0,
    hidden: true,
    data: [22, 23, 23, 23, 23, 24, 25, 25, 21, 22, 23, 24, 25, 26, 26, 26, 26, 25, 24, 23, 23, 23, 23, 23, 23]
};

datos.datasets = [avanceReal];
datos.datasets.push(avanceReal2);
datos.datasets.push(avanceReal3);



window.onload = function () {
    var ctx = window.document.getElementById('grafica').getContext('2d');

    var chart = new Chart(ctx, {
        type: 'line',
        data: datos,
        options: opciones
    });

    $(document).on('change', '.custom-control-input', function (event) {
        console.log('Change from: ');
        console.log(event.target.checked);
        console.log(event.target.id);
        if (event.target.checked) {
            if (event.target.id === 'customCheck1') {
                datos.datasets[0].hidden = false;
            }
            if (event.target.id === 'customCheck2') {
                datos.datasets[1].hidden = false;
            }
            if (event.target.id === 'customCheck3') {
                datos.datasets[2].hidden = false;
            }
        } else {
            if (event.target.id === 'customCheck1') {
                datos.datasets[0].hidden = true;
            }
            if (event.target.id === 'customCheck2') {
                datos.datasets[1].hidden = true;
            }
            if (event.target.id === 'customCheck3') {
                datos.datasets[2].hidden = true;
            }
        }
        chart.update();
    });

    $.ajax({
        type: "GET",
        url: baseURI + 'user/sensores',
        headers: {
            'token': localStorage.getItem('token'),
        },
        success: function (data) {
            console.log(data);
            if (data) {
                let counter = 1;
                data.forEach(function (sensor) {
                    $(`<p>Sonda ${counter} MAC: ${sensor.mac}</p>`).insertBefore("#boton-siguiente");
                    counter++;
                })
            } else {
                console.log('No data recieved');
            }
        },
        error: function (error) {
            console.log(error);
            window.location.assign('/index.html')
        }
    });
}
