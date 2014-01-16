/**
 * Represents any layer on the map.
 *
 * 
 */
SimpleHyperCities.Map.Layer = Backbone.Model.extend({
	defaults: function() {
		this.opacity = 1.0;
		this.layerObject = null;
		this.type = undefined;
		this.active = true;
	},
	layerTypes: {
		ArcGIS: "ArcGIS",
		WMS: "WMS",
		GoogleMaps: "GoogleMaps",
		KML: "KML",
		GeoJSON: "GeoJSON"
	},

	/**
	 * The constructor can take several kinds of arguments:	 
	 * 
	 * A string, representing the layer's URL: this tries to guess the layer 
	 * type from the URL. This is expected to come from the layer list, after 
	 * a user has copy-pasted the URL into the box.
	 * 
	 * An OpenLayers.Layer subclass object: this derives relevant information 
	 * from the OpenLayers object.
	 * 
	 * A hash: when the data comes from the server, as part of a Scene's information.
	 */
	initialize: function($data) {
		if ($data instanceof OpenLayers.Layer) {
			// derive important information
			this.name = $data.name;
			this.type = $data.type;
			this.layerObject = $data;
            this.olLayer = $data;
            $data.hcModel = this;
		} else if ($data.tileType) {
			this.buildFromLayerType($data);
		} else if ($data.url && typeof $data.title === "undefined") {
			this.name = $data.url;
			this.detectType($data.url);
        } else if ($data instanceof SimpleHyperCities.Views.Scene) {
			// We are building a model of a scene's base layer--from a model
			this.buildFromScene($data);
		} else { 
            // What could this be?
            console.log("Unrecognized map type found.");
		}

	},

	setOpacity: function ($opacity) {
		if (!isNaN($opacity)) this.olLayer.setOpacity($opacity);
	},

    remove: function () {
        this.layerObject.map.removeLayer(this.layerObject);
        // set status to inactive, so it won't be saved if we are editing an 
        // object
        this.active = false;
    },

	buildFromScene: function ($map) {
		var kml = new OpenLayers.Format.KML({
			internalProjection: $map.projection,
			externalProjection: new OpenLayers.Projection("EPSG:4326")
		});
		layer = new OpenLayers.Layer.Vector($map.attributes.objects[i].name);
		layer.addFeatures(kml.read($map.attributes.objects[i].mapping.kml));
		layer.features[0].attributes.description = $map.attributes.objects[i].description;
        this.name = $map.name;
        this.olLayer = layer;
        this.olLayer.hcModel = this;
		return layer;
	},

	buildFromLayerType: function ($map) {
		var layer;
		switch ($map.tileType) {
			case "ArcGIS":
				// TODO: check before adding /MapServer/export to URL
				layer = new OpenLayers.Layer.ArcGIS93Rest(
					$map.tileUrl,
					$map.tileUrl + "/MapServer/export",
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
				layer = new OpenLayers.Layer.WMS($map.tileUrl, $map.tileUrl);
				break;
				
			default:
				layer = new OpenLayers.Layer.TMS(
					$map.title,
					$map.tileUrl, {
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
					maxExtent: new OpenLayers.Bounds(-20037508.3427892, 
						-20037508.3427892, 
						20037508.3427892, 
						20037508.3427892
					),
					numZoomLevels: 21,
					maxResolution: 156543.0339,
					units: 'm',
					projection: "EPSG:4326",
					displayProjection: new OpenLayers.Projection("EPSG:4326")
				}
			);
            // TODO: add map thumbnail and description to another list?
            layer.setOpacity($map.opacity);
		}
        layer.hcModel = this;
        this.olLayer = layer;
        this.name = this.title;
		return layer;
	},

	/**
	 * Detect the layer's type from the URL	
	 */
	detectType: function($url) {
		if ($url.search(/arcgis/i) != -1) {
			this.layer = new OpenLayers.Layer.ArcGIS93Rest(
					this.name,
					$url + "/MapServer/export",
					{
						layers: "show:0",
						transparent: true,
						maxExtent: new OpenLayers.Bounds(
								-20037508.3427892, -20037508.3427892,
								20037508.3427892, 20037508.3427892
								)
					}, {
				isBaseLayer: false,
				projection: "EPSG:102113"
			}
			);
		} else if ($url.search(/wms/i) != -1) {
			this.layer = new OpenLayers.Layer.WMS();
		} else if ($url.search(/kml/i) != -1) {
			this.layer = new OpenLayers.Layer.Vector();
		} else {
			// Default is Google Maps
			this.layer = new OpenLayers.Layer.TMS(this.name,
					$url, {
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
				maxExtent: new OpenLayers.Bounds(-20037508.3427892, 
                        -20037508.3427892, 20037508.3427892, 20037508.3427892
                    ),
				numZoomLevels: 21,
				maxResolution: 156543.0339,
				units: 'm',
				projection: "EPSG:4326",
				displayProjection: new OpenLayers.Projection("EPSG:4326")
			});
		}
        this.olLayer = this.layer;
        layer.hcModel = this;
        this.name = this.attribtues.title;
		return this.layer;
	}
});