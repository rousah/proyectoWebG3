window.onload = function () {
    loadAlerts();
};

let alert_template = `<li>
                        <div class="notification-wrapper row" data-alert-index="{id}">
                            <div class="notification-text col-10">
                                <div class="notification-title">
                                                {Title}
                                            </div>
                                            <div class="notification-alert">
                                                {Alert}
                                            </div>
                                        </div>
                                        <div class="notification-action col-2">
                                            <i class="fas fa-trash" onclick="deleteAlert({id})"></i>
                                        </div>
                                    </div>
                                </li>`;

function loadAlerts() {
    $.ajax({
        url:      baseURI + 'user/alertas',
        dataType: "json",
        headers:  {
            'token': localStorage.getItem('token'),
        },
    }).done(function (data) {
        console.log(data);
        let alerts = JSON.parse(localStorage.getItem("alerts"));
        alerts ? null : alerts = [];
        data.forEach(function (item) {
                already_exists = false;
                alerts.forEach(function (alert) {
                    if (alert.zona.id === item.zona.id && alert.sensor.id === item.sensor.id &&
                        alert.alert === item.alert) {
                        already_exists = true;
                    }
                });
                if (!already_exists) {
                    ultimo = item.sensor.data.length - 1;
                    toastr.warning('Zona ' + item.zona.name + ' - Sensor ' + item.sensor.id, $.i18n(item.alert));
                    alerts.push(item);
                }
            }
        );
        localStorage.setItem('alerts', JSON.stringify(alerts));
        refreshAlerts();
    });

}

function deleteAlert(id) {
    let alerts = JSON.parse(localStorage.getItem("alerts"));
    alerts.splice(id,1);
    localStorage.setItem('alerts', JSON.stringify(alerts));
    refreshAlerts();
}

function refreshAlerts() {
    $('#alert-list').empty();
    let alerts = JSON.parse(localStorage.getItem("alerts"));
    alerts ? null : alerts = [];
    alerts.forEach((item) => {
        let str = alert_template.replace('{Title}', 'Zona ' + item.zona.name + ' - Sensor ' +
                                                    +item.sensor.id);
        str     = str.replace(/{id}/g, alerts.length - 1);
        str = str.replace(/{Alert}/g, $.i18n(item.alert));

        $('#alert-list').append(str);
    });
    $('#alerts-link').text($.i18n('alerts') + ' ' + alerts.length);


}