  define([
    "dojo/_base/declare",
    "app/esriService",
    "app/repository",
    "dojo/domReady!"
  ], function (declare, EsriService, Repository) {
    return declare(null, {
      constructor: function () {
        EsriService.createMap();
        EsriService.createMapView();
        let repository = new Repository();
        var layer = repository.getFeatureLayer()
        EsriService.addFeatureLayer(layer);
        EsriService.addLegend();
      }
    })
  });