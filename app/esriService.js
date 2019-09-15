define([
    "dojo/_base/declare",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Legend"
], function (declare, Map, MapView, Legend) {
    var EsriService = declare(null, {

        map: null,
        view: null,
        draw: null,
        legend: null,
        properties: null,
        featureLayers: [],
        basemapGallery: null,

        createMap: function (options = {
            basemap: "gray-vector"
        }) {
            if (this.map == null)
                this.map = new Map(options);

            return this.map;
        },

        createMapView: function (options = {
            container: "viewDiv",
            center: [-3.10, 51.019987],
            zoom: 8
        }) {
            options.map = this.map;

            if (this.view == null)
                this.view = new MapView(options);

            return this.view;
        },

        addFeatureLayer: function (layer) {
            this.map.add(layer);
            this.addLegend();
        },

        addLegend: function (location = "bottom-right") {
            if (this.legend != null)
                this.view.ui.remove(this.legend, location);

            layerInfo = [];
            this.map.allLayers.forEach(function (item) {
                layerInfo.push({

                    layer: item,
                    title: item.title
                })
            })

            this.legend = new Legend({
                view: this.view,
                layerInfos: layerInfo
            });

            this.view.ui.add(this.legend, location);
        }
    });

    var myService = new EsriService()
    return myService;
});