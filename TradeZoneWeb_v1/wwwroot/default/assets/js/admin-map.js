var sgLocation = [10.772461, 106.698055]; //HCM location
var current_position, current_accuracy;
var map = L.map("map").on('load', loadMap).setView(sgLocation, 13);
//Layer for ward
var layerWardPostal;
var layerWardGroup = new L.LayerGroup();
//layer for building
var layerBuildingPostal;
var layerBuildingGroup = new L.LayerGroup();
//Layer for Campus
var layerCampusPostal;
var layerCampusGroup = new L.LayerGroup();
//Layer for store
var layerStorePostal;
var layerStoreGroup = new L.LayerGroup();
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [15, 15],
    },
});
var gpsLocation = new LeafIcon({
    iconUrl: "assets/images/gps-icon.png",
});
var onclickLocation_icon = new LeafIcon({
    iconUrl: "assets/images/onClickPoint.png",
});
var btnShowLocation = document.getElementById("btnShowLocation");

var searchControl = L.esri.Geocoding.geosearch().addTo(map);

var geocodeService = L.esri.Geocoding.geocodeService();

var results = new L.layerGroup().addTo(map);

var onclickLocation = [];

var cancelCreateNewButton = document.getElementById("cancelCreateNewButton");

var closeCreateNewButton = document.getElementById("closeCreateNewButton");

var createNewButton = document.getElementById("createNewButton");

var geoJsonCreate;

var nameCreateNew = document.getElementById("nameCreateNew");

var typeCreateNew = document.getElementById("typeCreateNew");

var wardName = document.getElementById("wardName");

var districtName = document.getElementById("districtName");

var wardId = document.getElementById("wardId");
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
async function checkLayer() {
    if (onclickLocation != []) map.removeLayer(onclickLocation);
    layerStoreGroup.clearLayers();
    if (map.hasLayer(layerStoreGroup)) {
        await map.removeLayer(layerStoreGroup);
        layerStoreGroup = await new L.LayerGroup();
    }
}

async function loadMap() {
    //Load wards by getting API
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://tradezonemap.azurewebsites.net/api/ver-1/wards/map",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
            );
        },
        data: JSON.stringify({
            coordinateString:
                "107.2828212358498 11.0412508022305, 106.28581195850605 11.0412508022305, 106.28581195850605 10.529969933027024, 107.2828212358498 10.529969933027024, 107.2828212358498 11.0412508022305",
        }),
        dataType: "json",
        async: true,
    }).done(function (response) {
        layerWardPostal = L.geoJson(response, {
            onEachFeature: function (feature, layer) {
                layer.setStyle({
                    color: "red",
                    weight: 1
                }).bindPopup(feature.properties.f2).on("click", function () {
                    console.log(feature);
                });
            },
        });
        layerWardGroup.addLayer(layerWardPostal);
    });
    //Get building by getting api
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://tradezonemap.azurewebsites.net/api/ver-1/buildings/map",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
            );
        },
        data: JSON.stringify({
            coordinateString:
                "107.2828212358498 11.0412508022305, 106.28581195850605 11.0412508022305, 106.28581195850605 10.529969933027024, 107.2828212358498 10.529969933027024, 107.2828212358498 11.0412508022305",
        }),
        dataType: "json",
        async: true,
    }).done(function (response) {
        console.log(response);
        layerBuildingPostal = L.geoJson(response, {
            onEachFeature: function (feature, layer) {
                layer.setStyle({
                    color: "grey"
                }).bindPopup(feature.properties.f2).on("click", function () {
                    console.log(feature);
                });
            },
        });
        layerBuildingGroup.addLayer(layerBuildingPostal);
    });
    //Get Campus by getting api
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://tradezonemap.azurewebsites.net/api/ver-1/campus/map",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
            );
        },
        data: JSON.stringify({
            coordinateString:
                "107.2828212358498 11.0412508022305, 106.28581195850605 11.0412508022305, 106.28581195850605 10.529969933027024, 107.2828212358498 10.529969933027024, 107.2828212358498 11.0412508022305",
        }),
        dataType: "json",
        async: true,
    }).done(function (response) {
        layerCampusPostal = L.geoJson(response, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.f2).on("click", function () {
                    console.log(feature);
                });
            },
        });
        layerCampusGroup.addLayer(layerCampusPostal);
    });
    //Get store by getting api
    // $.ajax({
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   type: "POST",
    //   url: "http://tradezonemap.azurewebsites.net/api/ver-1/stores/map",
    //   beforeSend: function (xhr) {
    //     xhr.setRequestHeader(
    //       "Authorization",
    //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
    //     );
    //   },
    //   data: JSON.stringify({
    //     coordinateString:
    //       "107.2828212358498 11.0412508022305, 106.28581195850605 11.0412508022305, 106.28581195850605 10.529969933027024, 107.2828212358498 10.529969933027024, 107.2828212358498 11.0412508022305",
    //   }),
    //   dataType: "json",
    //   async: true,
    // }).done(function (response) {
    //   console.log(response);
    //   layerStorePostal = L.geoJson(response, {
    //     onEachFeature: function (feature, layer) {
    //       layer.bindPopup(feature.properties.f2).on("click", function () {
    //         console.log(feature);
    //       });
    //     },
    //   });
    //   layerStoreGroup.addLayer(layerStorePostal);
    // });
};

var overlayMaps = {
    Wards: layerWardGroup,
    Buildings: layerBuildingGroup,
    Campus: layerCampusGroup,
};

var layerscontrol = L.control.layers(null, overlayMaps).addTo(map);

map.pm.addControls({
    position: "topleft",
    drawCircle: false,
    drawMarker: false,
    drawCircleMarker: false,
    dragMode: false,
    editControls: false,
});

map.on("pm:create", (e) => {
    console.log(e);
    let layergroup = map.pm.getGeomanDrawLayers(true);
    layergroup.eachLayer(function (layer) {
        geoJsonCreate = layer.toGeoJSON().geometry;
    });

    let coor = "";
    for (let index = 0; index < geoJsonCreate.coordinates[0].length; index++) {
        if (index == geoJsonCreate.coordinates[0].length - 1) {
            coor =
                coor +
                geoJsonCreate.coordinates[0][index][0] +
                " " +
                geoJsonCreate.coordinates[0][index][1];
        } else {
            coor =
                coor +
                geoJsonCreate.coordinates[0][index][0] +
                " " +
                geoJsonCreate.coordinates[0][index][1] +
                ",";
        }
    }
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://tradezonemap.azurewebsites.net/api/ver-1/wards/check",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
            );
        },
        // data: `${coor}`,
        data: JSON.stringify({ coordinateString: coor }),
        dataType: "json",
        async: true,
    }).done(function (response) {
        if (response != null) {
            districtName.value = response.districtName;
            wardName.value = response.name;
            wardId.value = response.id;
            document.getElementById("wkt").value = Terraformer.WKT.convert(geoJsonCreate);
            document.getElementById("newZone").click();
        } else {
            // let layergroup = map.pm.getGeomanDrawLayers(true);
            // layergroup.eachLayer(function(layer) { map.removeLayer(layer);});
            Swal.fire({
                icon: "error",
                title: "Invalid Zone",
                text: "The zone is located in more than one ward.",
            });
        }
    });
});

searchControl.on("results", function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(
            L.marker(data.results[i].latlng)
                .bindPopup(data.results[i].text)
                .openPopup()
        );
    }
});

// map.on("click", function (e) {
//   let coord = e.latlng;
//   let lat = coord.lat;
//   let lng = coord.lng;
// });

map.on("moveend", async function () {
    // console.log(map.getBounds());
    checkLayer();
    // map.hasLayer(layerGroup) ? console.log("Have Layer") : console.log("No Layer")
    let bot = map.getBounds()._southWest.lat;
    let left = map.getBounds()._southWest.lng;
    let top = map.getBounds()._northEast.lat;
    let right = map.getBounds()._northEast.lng;
    let coor = `${right} ${top}, ${left} ${top}, ${left} ${bot}, ${right} ${bot}, ${right} ${top}`;
    if (map.getZoom() >= 18) {
        $.ajax({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            type: "POST",
            url: "http://tradezonemap.azurewebsites.net/api/ver-1/stores/map",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c');
            },
            data: JSON.stringify({ coordinateString: coor }),
            dataType: "json",
            async: true,
        }).done(function (response) {
            layerStorePostal = L.geoJson(response, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.f2).on('click', function () { console.log(feature); });
                },
            });
            layerStoreGroup.addTo(map);
            layerStoreGroup.addLayer(layerStorePostal);
        });
        layerscontrol.remove();
        overlayMaps = {
            Wards: layerWardGroup,
            Buildings: layerBuildingGroup,
            Campus: layerCampusGroup
        };

        layerscontrol = L.control.layers(null, overlayMaps).addTo(map);
    }
});

// map.on("move", function () {
//   checkLayer();
// });

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
    if (map.hasLayer(layerWardGroup)) map.removeLayer(layerWardGroup);
    map.locate({ setView: true, maxZoom: 16 });
}

btnShowLocation.onclick = function () {
    if (map.hasLayer(layerWardGroup)) map.removeLayer(layerWardGroup);

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    locate();
};

// map.on("click", function (e) {
//   if (onclickLocation != []) map.removeLayer(onclickLocation);
//   geocodeService
//     .reverse()
//     .latlng(e.latlng)
//     .run(function (error, result) {
//       if (error) {
//         return;
//       }
//       onclickLocation = L.marker(result.latlng, {
//         icon: onclickLocation_icon,
//       })
//         .addTo(map)
//         .bindPopup(result.address.Match_addr)
//         .openPopup();
//     });
// });

cancelCreateNewButton.onclick = function () {
    let layergroup = map.pm.getGeomanDrawLayers(true);
    layergroup.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
};
closeCreateNewButton.onclick = function () {
    let layergroup = map.pm.getGeomanDrawLayers(true);
    layergroup.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
};
createNewButton.onclick = function () {
    let coor = "";
    for (let index = 0; index < geoJsonCreate.coordinates[0].length; index++) {
        if (index == geoJsonCreate.coordinates[0].length - 1) {
            coor =
                coor +
                geoJsonCreate.coordinates[0][index][0] +
                " " +
                geoJsonCreate.coordinates[0][index][1];
        } else {
            coor =
                coor +
                geoJsonCreate.coordinates[0][index][0] +
                " " +
                geoJsonCreate.coordinates[0][index][1] +
                ",";
        }
    }
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://tradezonemap.azurewebsites.net/api/ver-1/wards/check",
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjkyOWUwOWJmLThhMjMtNDU5Yi05NTA2LTc0ZjAwZGYyYjlmOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWFpIEhvbmcgUXVvYyBLaGFuaCAoSzEzX0hDTSkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJraGFuaG1ocXNlMTMwNjY1QGZwdC5lZHUudm4iLCJGY21Ub2tlbiI6InN0cmluZyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL21vYmlsZXBob25lIjoiIiwiQnJhbmRJZCI6IjEwIiwiQnJhbmROYW1lIjoiTWFpIEhvbmcgUUsiLCJBY3RpdmUiOiJUcnVlIiwiZXhwIjoxNjExNTMyODAwLCJpc3MiOiJUUkFERVpPTkVNQVAiLCJhdWQiOiJUUkFERVpPTkVNQVAifQ.fvhoTaKInGgBKyIxpUfydaAJl5gWqvZ4s1G5HXMlE5c"
            );
        },
        // data: `${coor}`,
        data: JSON.stringify({ coordinateString: coor }),
        dataType: "json",
        async: true,
    }).done(function (response) { });
};

function polystyle(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: "red", //Outline color
        fillOpacity: 0.7,
    };
}
