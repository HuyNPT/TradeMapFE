var sgLocation = [10.772461, 106.698055]; //HCM location
var current_position, current_accuracy;
var map = L.map("map", {
    center: sgLocation,
    zoom: 13,
});
var layerPostal;
var layerGroup;
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [15, 15]
    },
});
var gpsLocation = new LeafIcon({
    iconUrl: "/default/assets/images/gps-icon.png",
});
var onclickLocation_icon = new LeafIcon({
    iconUrl: "/default/assets/images/onClickPoint.png",
});
var btnShowLocation = document.getElementById("btnShowLocation");

var searchControl = L.esri.Geocoding.geosearch().addTo(map);

var geocodeService = L.esri.Geocoding.geocodeService();

var results = new L.layerGroup().addTo(map);

var onclickLocation = [];

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
async function checkLayer() {
    if (onclickLocation != []) map.removeLayer(onclickLocation);
    layerGroup.clearLayers();
    if (map.hasLayer(layerGroup)) {
        await map.removeLayer(layerGroup);
        layerGroup = await new L.LayerGroup();
    }
}

searchControl.on("results", function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng).bindPopup(data.results[i].text).openPopup());
    }
});

map.on("moveend", async function () {
    checkLayer();
    let bot = map.getBounds()._southWest.lat;
    let left = map.getBounds()._southWest.lng;
    let top = map.getBounds()._northEast.lat;
    let right = map.getBounds()._northEast.lng;
    let coor = `${right} ${top}, ${left} ${top}, ${left} ${bot}, ${right} ${bot}, ${right} ${top}`;

    if (map.getZoom() >= 15) {
        $.ajax({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            type: "POST",
            url: "http://tradezonemap.azurewebsites.net/api/ver-1/Postgis",
            data: JSON.stringify({ coordinateString: coor }),
            dataType: "json",
            async: true,
        }).done(function (response) {
            layerPostal = L.geoJson(response, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.f2);
                },
            });
            layerGroup.addTo(map);
            layerGroup.addLayer(layerPostal);
        });
    }
});

map.on("move", function () {
    checkLayer();
});

function onLocationFound(e) {
    // if position defined, then remove the existing position marker and accuracy circle from the map
    if (current_position) {
        map.removeLayer(current_position);
        map.removeLayer(current_accuracy);
    }

    let radius = e.accuracy / 2;

    current_position = L.marker(e.latlng, {
        icon: gpsLocation,
    })
        .addTo(map)
        .bindPopup("You are within " + radius + " meters from this point")
        .openPopup();

    current_accuracy = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}
// wrap map.locate in a function
function locate() {
    if (map.hasLayer(layerGroup)) map.removeLayer(layerGroup);
    map.locate({ setView: true, maxZoom: 16 });
}

btnShowLocation.onclick = function () {
    if (map.hasLayer(layerGroup)) map.removeLayer(layerGroup);

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    locate();
};

map.on("click", function (e) {
    if (onclickLocation != []) map.removeLayer(onclickLocation);
    geocodeService
        .reverse()
        .latlng(e.latlng)
        .run(function (error, result) {
            if (error) {
                return;
            }
            onclickLocation = L.marker(result.latlng, {
                icon: onclickLocation_icon,
            })
                .addTo(map)
                .bindPopup(result.address.Match_addr)
                .openPopup();
        });
});