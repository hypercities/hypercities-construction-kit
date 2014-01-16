// Prevent OpenLayers from rendering tiles it can't find in map services
// as pink tiles.
OpenLayers.Util.onImageLoadErrorColor = "transparent";

/**
 *  The view for the map. 
 *  
 *  This is a singleton so as to prevent creating multiple maps.
 * @type @exp;Backbone@call;Viewextend@call;
 */
$(function () {
SimpleHyperCities.Views.Map = new (Backbone.View.extend({
    
    instance : null,
    objectLayers : {},
    mapLayers : {},
    
    // event handling
    selectControl: null,

	on: function ($event, $context, $function) {
		this.instance.events.register($event, $context, $function);
	},
    
    
    onFeatureSelect: function () {
        var self = this;
        return function ($event) {
            var feature = $event.feature,
                map = $event.feature.layer.map;

            var popup = new OpenLayers.Popup.FramedCloud("chicken",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100, 100),
                feature.attributes.description,
                null, 
                true, 
                function ($event) {
                    self.selectControl.unselectAll();
                }
            );
            
            feature.popup = popup;
            map.addPopup(popup);
        };
    },
    
    onFeatureUnselect: function ($event) {
        var feature = $event.feature,
            map = $event.feature.layer.map;
        if (feature.popup) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            delete feature.popup;
        }
    },
    
    initializeMap : function() {
        var gphy = new OpenLayers.Layer.Google("Google Physical", {
            type: google.maps.MapTypeId.TERRAIN
        });

        var gsat = new OpenLayers.Layer.Google("Google Satellite", {
            type: google.maps.MapTypeId.SATELLITE
        });

        this.instance = new OpenLayers.Map("map", {
            layers: [gphy, gsat]
        });

        this.instance.addControl(new OpenLayers.Control.LayerSwitcher({
            //"div": OpenLayers.Util.getElement("layer-switcher")
        }));

		this.layerControl = new SimpleHyperCities.Views.LayerSwitcher({
			el: $("#layer-switcher-layer-list")
		})
        this.instance.addControl(new OpenLayers.Control.Attribution());
    },
    
    render: function($data) {
        if (!this.instance) {
            this.initializeMap();
        }
        /*
        for (var i in this.objectLayers) {
            this.instance.removeLayer(this.objectLayers[i]);
            this.objectLayers[i].destroy();
        }
        for (var i in this.mapLayers) {
            this.instance.removeLayer(this.mapLayers[i]);
            this.mapLayers[i].destroy();
        }

        this.objectLayers = {};
        this.mapLayers = {};

        var counter = 0;
        for (var i in $data.attributes.maps) {
            counter++;
            if (counter > 1)
                break;
            var map = $data.attributes.maps[i];
            switch (map.tileType) {
                case "ArcGIS":
                    // TODO: check before adding /MapServer/export to URL
                    var layer = new OpenLayers.Layer.ArcGIS93Rest(
                        map.tileUrl,
                        map.tileUrl + "/MapServer/export",
                        {
                            layers: "show:0",
                            transparent: true,
                            maxExtent: new OpenLayers.Bounds(
                                    -20037508.3427892,-20037508.3427892, 
                                    20037508.3427892, 20037508.3427892
                                )
                        }, {
                            isBaseLayer: false,
                            projection: "EPSG:102113"
                        }
                    );
                    break;
                case "WMS":
                    // TODO: this has not been tested
                    var layer = new OpenLayers.Layer.WMS(map.tileUrl, map.tileUrl);
                    break;
                default:
                    var layer = new OpenLayers.Layer.TMS(
                        $data.attributes.maps[i].title,
                        $data.attributes.maps[i].tileUrl, {
                        isBaseLayer: false,
                        type: "png",
                        getURL: function($bounds) {
                            var res = this.map.getResolution(),
                                x = Math.round(($bounds.left - this.maxExtent.left) /
                                (res * this.tileSize.w)),
                                y = Math.round((this.maxExtent.top - $bounds.top) /
                                (res * this.tileSize.h)),
                                z = this.map.getZoom(),
                                path = z + "/" + x + "/" + y + ".png",
                                url = this.url
                                ;

                            if (url instanceof Array) {
                                url = this.selectUrl(path, url);
                            }

                            return url + path;
                        },
                        maxExtent: new OpenLayers.Bounds(-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892),
                        numZoomLevels: 21,
                        maxResolution: 156543.0339,
                        units: 'm',
                        projection: "EPSG:4326",
                        displayProjection: new OpenLayers.Projection("EPSG:4326")
                    }
                );
            }
            // TODO: add map thumbnail and description to another list?
            layer.setOpacity(map.opacity);
            this.instance.addLayer(layer);
            this.mapLayers[$data.attributes.maps[i].id] = layer;
        }
    
        var clickableLayers = [];
        if ($data.attributes.mapping.markerType != 5 && $data.attributes.objectType && $data.attributes.objectType != 2) {
            var kml = new OpenLayers.Format.KML({
                internalProjection: this.instance.getProjectionObject(),
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                extractStyles: true,
                extractAttributes: true
            });
            var layer = new OpenLayers.Layer.Vector($data.attributes.name);
            layer.addFeatures(kml.read($data.attributes.mapping.kml));
            layer.features[0].attributes.description = $data.attributes.description;
            this.instance.addLayer(layer);
            this.objectLayers[$data.attributes.id] = layer;
            clickableLayers.push(layer);
        }
        */

        // set map position
        var viewKML = $($data.attributes.mapping.view),
            lon = parseFloat($("longitude", viewKML).text()),
            lat = parseFloat($("latitude", viewKML).text()),
            zoom = parseInt($data.attributes.mapping.zoom),
            center = new OpenLayers.LonLat(lon, lat).transform(new
            OpenLayers.Projection("EPSG:4326"),
            this.instance.getProjectionObject())
            ;
        this.instance.setCenter(center, zoom);

        // add layers

        // draw points
        
        var self = this;
        for (var i in $data.attributes.objects) {
            var kml = new OpenLayers.Format.KML({
                internalProjection: this.instance.getProjectionObject(),
                externalProjection: new OpenLayers.Projection("EPSG:4326")
            });
            var layer = new OpenLayers.Layer.Vector($data.attributes.objects[i].name);
            layer.addFeatures(kml.read($data.attributes.objects[i].mapping.kml));
            layer.features[0].attributes.description = $data.attributes.objects[i].description;
            clickableLayers.push(layer);
            
            this.instance.addLayer(layer);
            this.objectLayers[$data.attributes.objects[i].id] = layer;

        }
        this.selectControl = new OpenLayers.Control.SelectFeature(clickableLayers, {
            //featureselected: this.onFeatureSelect,
            //featureunselected: this.onFeatureUnselect,
            clickout: true,
                toggle: false,
                multiple: false,
                hover: false,
                toggleKey: "ctrlKey"
        });
        this.instance.addControl(this.selectControl);
        this.selectControl.activate();
        for (var i in clickableLayers) {
            clickableLayers[i].events.on({
                "featureselected": self.onFeatureSelect(), // onFeatureSelect actually returns the event handler function
                "featureunselected": self.onFeatureUnselect
            });
        }
        
    }
}))({el: $("#map")});
SimpleHyperCities.Views.Map.initializeMap();
});