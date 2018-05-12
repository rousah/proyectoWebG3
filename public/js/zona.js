// https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/template_strings

var botonZonaTemplate = `<div class="btn-group btn-group-sm" role="group" style="margin: 5px;">
            <button class="btn btn-light" style="{bgcolor}" onclick="focusZona({id})">{Nombre de la zona}</button>
            <button class="btn btn-secondary" style="width:40px" onclick="cargarZona({id})">
                <i class="fa fa-eye-slash" aria-hidden="true"></i>
            </button>
        </div>`;

var listaZonas = [];

// Cargar el listado de zonas
function loadAlerts() {
    $.ajax({
        url: baseURI + 'user/alertas',
        dataType: "json",
        headers: {
            'token': localStorage.getItem('token'),
        },
    }).done(function (data) {
        console.log(data);
        alert ("¡¡¡¡¡¡¡¡¡¡AVISO!!!!!!!!!!!")
    });

}

function loadZonas() {

    $.ajax({
        url: baseURI + 'user/zonas',
        dataType: "json",
        headers: {
            'token': localStorage.getItem('token'),
        },
    }).done(function (r) {
        listaZonas = r;
        listaZonas.forEach(function (item) {
            item.vertices.forEach(function (vert) {
                vert.lat = parseFloat(vert.lat);
                vert.lng = parseFloat(vert.lng);
            });
            var zona = new google.maps.Polygon({
                paths: item.vertices,
                strokeColor: item.color,
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: item.color,
                fillOpacity: 0.35,
                editable: false,
                visible: false
            });
            zona.setMap(mapa);
            item.zona = zona;

            var str = botonZonaTemplate.replace('{Nombre de la zona}', item.name);
            str = str.replace(/{id}/g, item.id);

            var c = "background-color: rgba(" + parseInt(item.color.substr(1, 2), 16) + "," +
                parseInt(item.color.substr(3, 2), 16) + "," + parseInt(item.color.substr(5, 2), 16) + ",0.35)";
            str = str.replace('{bgcolor}', c);

            item.control = $.parseHTML(str)[0];

            $('#zonas-list').append(item.control);

        });
        
        //TODO CHANGE THIS TO LOAD ONLY SENSORES FROM CURRENT ZONE
        r.forEach(function (zona) {
            console.log(zona);
            //if (listaSensores.length == 0) {
                loadSensores(zona.sensors);
            //} else {
                $("#mask").addClass("d-none");
            //}
        });
        loadAlerts();
    });
}

function focusZona(id) {
    listaZonas.forEach(function (item) {
        if (item.id == id) {
            var bounds = new google.maps.LatLngBounds();
            item.zona.getPath().getArray().forEach(function (v) {
                bounds.extend(v);
            });
            mapa.fitBounds(bounds);
        }
    });
}

function cargarZona(id) {
    listaZonas.forEach(function (item) {
        var c = item.control.querySelector("i");
        var b = item.control.querySelector("button:nth-child(2)");
        if (item.id == id) {
            item.zona.setVisible(!item.zona.visible);
            if (item.zona.visible) {
                c.classList.replace("fa-eye-slash", "fa-eye");
                b.classList.replace("btn-secondary", "btn-light");
            } else {
                c.classList.replace("fa-eye", "fa-eye-slash");
                b.classList.replace("btn-light", "btn-secondary");
            }
        }
    });
}

loadZonas();


var zonaTemp;
