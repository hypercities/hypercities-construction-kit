SimpleHyperCities.Views.Narrative = Backbone.View.extend({
    el: "body",
    
    events: {
        "click #leave-collection" : "closeCollection"
    },
    
    initialize: function ($options) {
        this.bindInitialEvents();
        this.map =$options.map;
    },
    
    bindInitialEvents: function () {
        this.narrative = $("#narrative");
    },
    
    render : function () {
        // set title
        this.narrative.empty();
        this.title = new SimpleHyperCities.Views.Title({
            el: $("#title"),
            model: this.model
        });
        this.title.render();
        
        var lastView;

        if (this.model.attributes.children.length == 0) {
            alert("Something's wrong: we found a collection without children.\n"
                + "Use the controls above to go back up a level."
            );
        }
        
        for (var i in this.model.attributes.children) {
            var item = this.model.attributes.children[i];
            var options = {
                model: item,
                map: this.map,
                previousView: lastView,
                layerSwitcher: this.layerSwitcher
            };
            if (item instanceof SimpleHyperCities.Models.Scene) {
                var view = new SimpleHyperCities.Views.Scene(options);
            } else {
                var view = new SimpleHyperCities.Views.NarrativeInline(options);
            }
            this.narrative.append(view.render().el);
            
            if (typeof lastView !== "undefined") {
                lastView.nextView = view;
            }
            
            lastView = view;
        }
        
        var firstView = lastView;
        
        while (true) {
            firstView = firstView.previousView;
            if (typeof firstView.previousView === "undefined") {
                break;
            }
        }
        
        firstView.activate();
        
        return this;
    },
    
    getItem: function ($index) {
        return this.model.attributes.children[$index];
    },

    closeCollection: function () {
        // unbind controls
        // transfer control to parent
        this.parent.rerender();
    },
    
    loadCollection: function () {
        this.undelegateEvents();
        // load new collection, using this.model as parents
        app.load(
                this.model.attributes.children[this.model.currentObject].id,
                this.model
        );
    }
    
    
});