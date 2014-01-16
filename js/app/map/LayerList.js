/**
 * Should be initialized after the map is created. 
 * 
 * @type @exp;Backbone@pro;Views@call;extend
 */
$(function () {
SimpleHyperCities.Map.LayerList = Backbone.View.extend({

	el: $("#layer-switcher-layer-list"),

    layers: [],

    initialize: function ($options) {
        this.map = $options.map;
        this.map.events.register("addlayer", this, this.addLayer);
//        this.map.events.register("changelayer", this, this.changeLayer);
//        this.map.events.register("removelayer", this, this.removeLayer);
    },

    render: function () {
        // TODO: render basic components here
    },

    renderLayers: function ($layers) {
        // TODO: render scene here
        for (var i in $layers) {
            var layerModel = $layers[i];
            var layerView = new SimpleHyperCities.Views.Layer({
                model: layerModel
            });
            this.$el.append(layerView.render().el);
        }
    },

    addLayer: function ($event) {
		var layerModel = $event.layer.hcModel;
        if (!layerModel) return;
		// TODO: Add guard -- "addlayer" is called when a layer is added, so
		// if the layer is added by, say, the search box and not a new narrative
		// scene, then don't add it to the map
		// TODO: figure out parameters
		var layerView = new SimpleHyperCities.Views.Layer({
			model: layerModel
		});
        this.layers.push(layerView);
		this.$el.append(layerView.render().el);
    },

    clear: function () {
        for (var i in this.layers) {
            var layer = this.layers[i];
            layer.model.olLayer.map.removeLayer(layer.model.olLayer);
            layer.model.olLayer.destroy();
            layer.remove();
        }
        this.layers = [];
    }
});
});