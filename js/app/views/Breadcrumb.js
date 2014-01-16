$(function () {
SimpleHyperCities.Views.Breadcrumb = Backbone.View.extend({
    //tagName: "li",
    
    template: _.template($("#breadcrumb-template").html()),
    
    initialize: function ($data) {
        this.order = $data.order;
    },
    
    events : {
        "click": "renderToMainView"
    },

    render: function () {
//        if (typeof this.model.parent !== "undefined") {
//            var parentView = new SimpleHyperCities.Views.Breadcrumb({
//                model: this.model.parent
//            });
//            parentView.render();
//        }
//        var dom = $("#breadcrumb-template").clone();
//        dom.attr("id", "");
//        dom.text(this.model.attributes.name + " > ");
        this.$el.html(this.template({
            name: this.model.attributes.name
        }));
        // this.$el.text(this.model.attributes.name);
        
        return this;
    },
        
    renderToMainView: function () {
        app.upStackTo(this.order);
    }
})
});