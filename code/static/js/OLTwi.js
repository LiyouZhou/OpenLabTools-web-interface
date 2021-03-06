function plot_time_series(name, id, refresh_interval) {
    var options = {
        lines:  { show: true },
        points: { show: true },
        xaxis:  { mode: "time" },
        series: { shadowSize: 0 } // Drawing is faster without shadows
    };

    //  Initiate a recurring data update
    function start_updating() {
        var data = [];
        var plot = $.plot("#plot_window-" + id, data, options);
        var iteration = 0;
        function fetchData() {
            function onDataReceived(series) {
                data.push( [series.time*1000, series.data] );
                if (iteration > 20) { data.shift() };
                //console.log(data)
                plot.setData([data]);
                plot.setupGrid();
                plot.draw();
            }
            if ( $("#pauseIcon-"+id).attr("class").indexOf('pause') > -1 ) {
                ++iteration;
                $.ajax({
                    url: "/get_point",
                    type: "GET",
                    dataType: "json",
                    data: { id : id },
                    success: onDataReceived
                })
            }
            setTimeout(fetchData, refresh_interval*1000);
        }
        fetchData();
    }
    start_updating();
}

function button_ajax(id, status_indicator, extra_args) {
    var btn = $('#'+id);
    btn.button('loading');
    data = { id: id };
    if (extra_args != undefined) { data.extra_args = extra_args };
    $.getJSON( "../button_click", data )
    .done( function (json) {
        if (status_indicator) {
            $("#"+ id + "-Status").text("Status: " + json.state);
        }
    })
    .fail( function () {
        alert("Request failed!")
    })
    .always( function () {
        btn.button('reset');
    });
}

// return a formated string representation of a float with fiex digits of precision
function toFixed(value, precision) {
    var precision = precision || 0,
    neg = value < 0,
    power = Math.pow(10, precision),
    value = Math.round(value * power),
    integral = String((neg ? Math.ceil : Math.floor)(value / power)),
    fraction = String((neg ? -value : value) % power),
    padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}

// take a date object and return a string in the format DDMMYYhhmmss
function formatDate(d) {
    var DD = d.getDate()
    if ( DD < 10 ) DD = '0' + DD

    var MM = d.getMonth()+1
    if ( MM < 10 ) MM = '0' + MM

    var YY = d.getFullYear() % 100
    if ( YY < 10 ) YY = '0' + YY

    var hh = d.getHours() % 100
    if ( hh < 10 ) hh = '0' + hh

    var mm = d.getMinutes() % 100
    if ( mm < 10 ) mm = '0' + mm

    var ss = d.getSeconds() % 100
    if ( ss < 10 ) ss = '0' + ss

    return DD+MM+YY+hh+mm+ss
}
