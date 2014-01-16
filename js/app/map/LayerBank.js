$(function () {
SimpleHyperCities.Map.LayerBank = Backbone.Collection.extend({
    model: SimpleHyperCities.Models.Layer,
    url: "/maps",

    initialize: function ($models, $options) {
		this.projection = $options.projection;
    },


    addWithoutDuplicates: function($model) {
        //
        var isDuplicate = this.any(function ($item) {
            return $item.get('id') === $model.get('id');
        });
        if (isDuplicate) {
            return $item.get($model.id);
        } else {
            var model = new SimpleHyperCities.Map.Layer($model);
            this.add(model);
            return model;
        }
    },

    convert: function ($model) {
        var collection = []; // new SimpleHyperCities.Map.LayerBank();
        var objects = [];
        for (var i in $model.attributes.objects) {
            var obj = $model.attributes.objects[i];
            var model;
            if (!this.get(obj.id)) {
                model = this.addWithoutDuplicates(obj);
            } else {
                model = this.get(obj.id);
            }
            objects.push(model);
//            collection.add(model);
            collection.push(model);
        }
        $model.attributes.objects = objects;
        var maps = [];
        for (var i in $model.attributes.maps) {
            var map = $model.attributes.maps[i];
            var model;
            if (!this.get(map.id)) {
                model = this.addWithoutDuplicates(map);
            } else {
                model = this.get(map.id);
            }
            maps.push(model);
//            collection.add(model);
            collection.push(model);
        }
		// handle scene's own object
        if ($model.attributes.mapping.markerType !== 5 
				&& $model.attributes.objectType 
					&& $model.attributes.objectType !== 2) {
            var kml = new OpenLayers.Format.KML({
                internalProjection: this.projection,
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                extractStyles: true,
                extractAttributes: true
            });
            var olLayer = new OpenLayers.Layer.Vector($model.attributes.name);
            olLayer.addFeatures(kml.read($model.attributes.mapping.kml));
            olLayer.features[0].attributes.description = $model.attributes.description;
			var layer = new SimpleHyperCities.Map.Layer(olLayer);
            layer.hcModel = $model;
			collection.push(layer);
        }

        $model.attributes.maps = maps;
        $model.attributes.layers = collection;
        return $model;
    }
    
});
});