SimpleHyperCities.Views.Title = Backbone.View.extend({
    //el: $("#title"),
    render: function () {
        this.$el.text(this.model.attributes.name);
    }
});
