describe("Layer", function () {
    var options = {
        title: "A tample test",
        url: "http://example.com/ArcGIS/rest/services/Service1/1"
    };

    beforeEach(function () {
        this.layer = new SimpleHyperCities.Map.Layer(options);
    });

	it("should correctly construct a layer model from an OpenLayers object.", function () {
		// Use a real map service so that OpenLayers does not throw an error,
		// which it might do, theoretically.
		var inputLayer = new OpenLayers.Layer.WMS(
			"Sample test layer", 
			"http://wms.jpl.nasa.gov/wms.cgi",
		    {layers: "modis,global_mosaic"}
	    );
		var layerModel = new SimpleHyperCities.Map.Layer(inputLayer);
		expect(olClassOf(layerModel)).toEqual(olClassOf(inputLayer));
	});
    
    it("should detect the constructor parameters correctly.", function () {
        expect(this.layer.get("title")).toEqual(options.title);
        expect(this.layer.get("url")).toEqual(options.url);
    });
    
    var olClassOf = function ($object) {
        return $object.id.split("_")[0];
    };
    
    var arcURL = "http://example.com/ArcGIS/rest/services/MyService/MySampleLayer/0";
    it("should detect an ArcGIS layer when the URL contains 'arcgis', case insensitive.", function () {
        expect(olClassOf(this.layer.detectType(arcURL)))
                .toEqual(olClassOf(new OpenLayers.Layer.ArcGIS93Rest()));
    });
    
    it("should detect a WMS layer when the URL contains 'wms', case insensitive.", function () {
        expect(olClassOf(this.layer.detectType("http://example.com/geoserver/wms?layers=layer1;layer2")))
            .toEqual(olClassOf(new OpenLayers.Layer.WMS()));
    });
    
    // Google Maps/TMS
    it("should detect a Google Maps/TMS Layer when the URL pattern is /z/y/x", function () {
        expect(olClassOf(this.layer.detectType("http://example.com/123/456/789")))
                .toEqual(olClassOf(new OpenLayers.Layer.TMS()));
    });
    
    // Vector layers
    var kmlURL = "http://example.com/myFiles/somefile.kml";
    it("should detect a KML layer when the filename ends in '.kml'.", function () {
        expect(olClassOf(this.layer.detectType(kmlURL)))
                .toEqual(olClassOf(new OpenLayers.Layer.Vector()));
        // TODO: make sure the layer actually detects the KML reader correctly
    });
    
    var failURL = "http://example.com/someLayer.abcdef";
    it("should fail when there is no clearly identifying information", function () {
        expect(olClassOf(this.layer.detectType(failURL)))
                .toEqual(olClassOf(new OpenLayers.Layer.TMS()));
    });
    
})