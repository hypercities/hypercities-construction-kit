/**
 * Simple Layer view.
 * @type @exp;Backbone@pro;View@call;extend
 */
$(function () {
SimpleHyperCities.Views.Layer = Backbone.View.extend({

	template:  _.template($("#layer-template").html()),

    events: {
        "click .icon-remove-sign": "clear"
    },

	render: function () {
        var attributes = {};
        // OL adds a new layer for the Select Control
        if (!this.model) return;
        if (this.model.attributes.title) {
            attributes.title = this.model.attributes.title;
        } else {
            attributes.title = this.model.attributes.name;
        }
		this.$el.html(this.template(attributes));
		this.$el.find(".slider")
			.slider()
			.on('slideStop', this, function ($e) {
				var model = $e.data.model,
					value = parseFloat($e.value) / 100;
				model.setOpacity(value);
			})
			;
		return this;
	},

    /**
     * Remove layer from list. 
     * @param {type} $e
     * @returns {undefined}
     */
    clear: function ($e) {
        this.model.remove();
        this.remove();
        $e.stopPropagation();
    }
});
});