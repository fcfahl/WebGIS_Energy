function leaflet_Control (layers) {

    // zoom configuration
    var  southWest = L.latLng(31, -17.5),
        northEast = L.latLng(72, 45),
        centerView= L.latLng(56, 20),
        zoomLevel = 4;

    map = L.map('map').setView(centerView, zoomLevel);
    map.fitBounds([southWest, northEast]);

    // Leaflet.ZoomBox-master plugin
    var control = L.control.zoomBox({
        modal: false,
        // If false (default), it deactivates after each use.
        // If true, zoomBox control stays active until you click on the control to deactivate.
        // position: "topleft",
        // className: "customClass"  // Class to use to provide icon instead of Font Awesome
    }).addTo(map);

    // Leaflet.NavBar-master plugin
    L.control.navbar().addTo(map);

    //Leaflet-MiniMap-master Plugin
    var OSM2 = L.tileLayer.provider('OpenStreetMap.Mapnik', {
        minZoom: 0,
        maxZoom: 13});
    var miniMap = new L.Control.MiniMap(OSM2, {
        toggleDisplay: true,
        position: 'topright'
    }).addTo(map);

    //leaflet-graphicscale-master Plugin
    var graphicScale = L.control.graphicScale({
        doubleLine: false,
        fill: 'hollow',
        showSubunits: false,
        position: 'bottomright'
    }).addTo(map);

    // Leaflet-IconLayers-master Plugin
    var layers = [];
    for (var providerId in providers) {
        layers.push(providers[providerId]);
    }
    layers.push({
        layer: {
            onAdd: function() {},
            onRemove: function() {}
        },
        title: 'empty'
    });
    var ctrl = L.control.iconLayers(layers).addTo(map);

    // Leaflet.ZoomLabel-master plugin
    L.control.zoomLabel({
        position: 'bottomleft'
    }).addTo(map);

}

function map_Layers () {

    $(document).on('click', "input:checkbox:not(.wms_Ignore)", function(event) {

        var layerClicked = window[event.target.value];

        console.log('layerClicked: ' , layerClicked);
       //  console.log('this for adding: ' , this);

        if (map.hasLayer(layerClicked)) {
            map.removeLayer(layerClicked);
        } else {
            map.addLayer(layerClicked);
        }
    });
}

function WMS_Object (id, title, server, service, version, layer, bbox, width, height, CRS, format, transparent, tiled, style, zIndex){

    // create geoserver URL
    var get_Map = server + "?service=" + service + "&version=" + version + "&request=GetMap&layers=" + layer + "&bbox=" + bbox + "&width=" + width + "&height=" + height + "&srs=" +  CRS + "&format=" + format;

    // console.log(get_Map);

    // create leaflet object
    var arg = {
        layers: layer,
        format: format,
        transparent: transparent,
        version: version,
        tiled: tiled,
        styles: style,
        zIndex: zIndex,
        // crs: wmsLayer.CRS,
    };

    // create Leaflet object
    window[id] = L.tileLayer.wms(server, arg);
    console.log("arg: ", arg);
}

function WMS_Layers (DB_WMS, DB_Service, layers, styles, workspaces) {
    // there is a problem on geoserver to set up a custom style - it seems to shift the color classes for discrete colortables - for this reason it is been using only the defaul raster style


    // loop through Layers
    $.each(layers, function (index, obj) {

        var title = layers[index],
            id = title,
            service = DB_Service.Type,
            layer = workspaces[index] + ":" + title,
            style = styles[index],
            zIndex = 100 - index,
            server = DB_WMS.Server + workspaces[index] + "/wms";

        // Add parameters to object
        WMS_Object (id, title, server, service, DB_WMS.Version, layer, DB_WMS.Bbox, DB_WMS.Width, DB_WMS.Height, DB_WMS.CRS, DB_WMS.Format, DB_WMS.Transparent, DB_WMS.Tiled, style, zIndex);

        console.log("layer: ", layer);
        console.log("Workspace[index] : ", workspaces[index] );

    });
}
