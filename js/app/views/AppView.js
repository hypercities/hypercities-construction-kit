SimpleHyperCities.Views.AppView = Backbone.View.extend({
    el: "body",
    
    /**
     * Create the new collection.
     */
    initialize: function () {
        // initialize Breadcrumbs
        this.breadcrumbs = this.$("breadcrumbs");
        this.store = new SimpleHyperCities.Models.NarrativeStore();
//        this.layerList = new SimpleHyperCities.Views.LayerList();
        // initialize Narrative Collection
        this.narrativeHistory = new SimpleHyperCities.Models.NarrativeList();
        this.narratives = [];
        this.map = new SimpleHyperCities.Map.Map();
    },
        
    /**
     * Load a new collection through AJAX; callback is this.rerender
     * 
     * Once finished, render the new collection. 
     * 
     * This can be called either from the Breadcrumb view, or by the EnterCollection 
     * control.
     */
    load: function ($id) {
        this.store.load($id, this.render, this);
        return;
        
        var rerender = this.render,
            self = this;
        $.getJSON("http://linuxdev.ats.ucla.edu/~david/simple_hc/getCollection.php?"
            + "id=" + $id + "&callback=?",
            {}, function ($data) {
                //rerender($data);
                rerender.apply(self, [$data]);
            }, "json"
        );
    },
        
    render: function ($model) {
        // render breadcrumbs
        $("#breadcrumbs").empty();
        for (var i in this.narrativeHistory.models) {
            var prevCollection = this.narrativeHistory.models[i],
                breadcrumb = new SimpleHyperCities.Views.Breadcrumb({
                    model: prevCollection,
                    order: i
                });
                $("#breadcrumbs").append(breadcrumb.render().el);
        }
        // render Narrative
        var view = new SimpleHyperCities.Views.Narrative({
            model: $model,
            map: this.map
//            layerList: this.layerList
        });
        view.render();
        
        // Add this here so that it doesn't show in the breadcrumbs
        this.narrativeHistory.push($model);
    },
            
    upStackTo: function ($order) {
        var item;
        while ((item = this.narrativeHistory.pop()) != null) {
            if (this.narrativeHistory.length == $order) {
                break;
            }
        }
        this.render(item);
    }
});

