$(function () {
SimpleHyperCities.Map.LayerSwitcher = Backbone.View.extend({

    events: {
        // TODO: register selecting a layer from the dropdown
    },

    initialize: function ($options) {
        this.layerList = new SimpleHyperCities.Map.LayerList({
            map: $options.map
        });
		// TODO: add search box
    },

    clear: function () {
        this.layerList.clear();
    }

});
});