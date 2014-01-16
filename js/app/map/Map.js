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
SimpleHyperCities.Map.Map = Backbone.View.extend({
    
    instance : null,
    layerBank : null,

    objectLayers : {},
    mapLayers : {},
    
    // event handling
    selectControl: null,

	initialize: function () {
		this.initializeMap();
		this.layerBank = new SimpleHyperCities.Map.LayerBank([], {
			projection: this.instance.getProjectionObject()
		});
        this.layerSwitcher = new SimpleHyperCities.Map.LayerSwitcher({
            map: this.instance
        });
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
//            "div": OpenLayers.Util.getElement("layer-switcher")
        }));

        this.instance.addControl(new OpenLayers.Control.Attribution());
    },
    
    render: function($data) {
        if (!this.instance) {
            this.initializeMap();
        }
        this.layerSwitcher.clear();

		var model = this.layerBank.convert($data);
    
        var clickableLayers = model.attributes.layers.filter(function ($layer) {
			return $layer.olLayer instanceof OpenLayers.Layer.Vector;
		});
        var clickableLayers = clickableLayers.map(function ($m) {
            return $m.olLayer;
        })

        // set map position
        var viewKML = $($data.attributes.mapping.view),
            lon = parseFloat($("longitude", viewKML).text()),
            lat = parseFloat($("latitude", viewKML).text()),
            zoom = parseInt($data.attributes.mapping.zoom),
            center = new OpenLayers.LonLat(lon, lat).transform(new
                OpenLayers.Projection("EPSG:4326"),
                this.instance.getProjectionObject()
            )
        ;

        this.instance.setCenter(center, zoom);

        var self = this;
        // add layers
        model.attributes.layers.map(function ($map) {
           self.instance.addLayer($map.olLayer); 
        });
        
        this.selectControl = new OpenLayers.Control.SelectFeature(clickableLayers, {
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
});
});