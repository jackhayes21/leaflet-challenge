var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson')
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng){
                var depth = feature.geometry.coordinates[2];
                var magnitude = feature.properties.mag;
                var radius = Math.max(magnitude * 2, 5);
                var color;
                if (depth >= -10 && depth <= 10) {
                    color = 'green';
                } else if (depth > 10 && depth <= 30) {
                    color = 'lightgreen'
                } else if (depth > 30 && depth <= 50) {
                    color = 'yellow'
                } else if (depth > 50 && depth <= 70) {
                    color = 'orange'
                } else if (depth > 70 && depth <= 90) {
                    color = 'red'
                } else {
                    color = 'darkred';
                }
                
                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                    

                });
        
            },
            onEachFeature: function (feature, layer) {
                var popupConent =
                    "Magnitude" +
                    feature.properties.mag +
                    "<br>Location" +
                    feature.properties.place +
                    "<Depth: " +
                    feature.geometry.coordinates[2] +
                    " km"+
                    new Date(feature.properties.time).toLocaleString();
                layer.bindPopup(popupConent);
            },
        
        }).addTo(map);
    });



var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depthLabels = [
        '-10-10 km',
        '10-30 km',
        '30-50 km',
        '50-70 km',
        '70-90 km',
        '90+ km',
    ];
    var colors = [ 'green', 'lightgreen', 'yellow', 'orange', 'red','darkred'];

    var legendContent = '<strong>Depth Legend</strong><br>'; // You can add a title
    for (var i = 0; i < depthLabels.length; i++) {
        legendContent +=
            '<div class="legend-box" style="background:' + colors[i] + '"></div> ' + depthLabels[i] + '<br>';
    }
    //     legendContent +=
    //         '<i style="background:"' + colors[i] + '"></i> ' + depthLabels[i] + '<br>'; //<i style="background:
    // }

    div.innerHTML = legendContent; // Set the inner HTML of the div

    return div;
};

legend.addTo(map);


