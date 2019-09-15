define([
    "dojo/_base/declare",
    "esri/geometry/Point",
    "esri/layers/FeatureLayer",
    "dojox/uuid/generateRandomUuid",
    "dojo/request",
], function (declare, Point, FeatureLayer, Uuid, request) {
    return declare(null, {
        jsonFile: "https://azureguild.blob.core.windows.net/events/events.json",
        httpRequest: null,
        rng: null,

        constructor: function () {
            this.httpRequest = request;
            this.rng = Uuid;
        },

        getFeatureLayer: function () {
            return this.getData()
                .then(this.buildFeatureLayer.bind(this));
        },

        getData: function () {
            return this.httpRequest.get(this.jsonFile, {
                handleAs: "json"
            });
        },

        buildFeatureLayer: function (data) {
            var renderer = {
                type: "class-breaks",
                field: "series",
                classBreakInfos: [{
                        minValue: 1,
                        maxValue: 1,
                        label: "Standard Edition",
                        symbol: {
                            type: "simple-marker",
                            style: "diamond",
                            size: 20,
                            color: [0, 255, 40],
                            outline: {
                                width: 1,
                                color: "#FF0055",
                                style: "solid"
                            }
                        }
                    },
                    {
                        minValue: 2,
                        maxValue: 2,
                        label: "Junior Edition",
                        symbol: {
                            type: "simple-marker",
                            style: "diamond",
                            size: 20,
                            color: [255, 255, 40],
                            outline: {
                                width: 1,
                                color: "#FF0055",
                                style: "solid"
                            }
                        }
                    }
                ]
            };

            let graphics = this.buildGraphic(data)
            return new FeatureLayer({
                title: "Parkruns",
                source: graphics,
                fields: [{
                        name: "id",
                        alias: "id",
                        type: "oid"
                    }, {
                        name: "name",
                        alias: "Name",
                        type: "string"
                    }, {
                        name: "longname",
                        alias: "Longname",
                        type: "string"
                    }, {
                        name: "series",
                        alias: "Series",
                        type: "integer"
                    },
                    {
                        name: "location",
                        alias: "Location",
                        type: "string"
                    }
                ],
                objectIdField: "id",
                renderer: renderer,
                spatialReference: {
                    wkid: 4326
                },
                geometryType: "point",
                popupTemplate: {
                    title: "{Longname}",
                    content: "<p>Located at {Location}</p>"
                },
                visible: true
            });
        },

        buildGraphic: function (data) {
            return data.map(function (feature) {
                return {
                    geometry: new Point({
                        x: feature.geometry.coordinates[0],
                        y: feature.geometry.coordinates[1]
                    }),

                    attributes: {
                        id: this.rng(),
                        name: feature.properties.eventname,
                        longname: feature.properties.EventLongName,
                        series: feature.properties.seriesid,
                        location: feature.properties.EventLocation
                    }
                }
            }.bind(this));
        },
    });
});
