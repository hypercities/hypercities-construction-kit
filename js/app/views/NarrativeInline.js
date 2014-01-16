
$(function () {
SimpleHyperCities.Views.NarrativeInline = Backbone.View.extend({
       
    tagName: "div",
    
    template: _.template($("#narrative-template").html()),
    
    events: {
        "click .enter-collection" : "loadCollection",
        "click .previous-control-button" : "previous",
        "click .next-control-button" : "next",        
        "click" : "activate"
    },
    
    initialize: function ($options) {
        //this.constructor.__super__.initialize.apply(this, [$options])
        this.previousView = $options.previousView;
        
        this.map = $options.map;
        this.enterCollection = this.$(".enter-collection");
    },
    
    render: function () {
        var dateString = this.model.attributes.mapping.dateFrom.date;
        if (this.model.attributes.mapping.dateFrom != this.model.attributes.mapping.dateTo) {
            dateString += " to " + this.model.attributes.mapping.dateTo.date;
        }
        
        var childrenList = $("<ol/>"),
            message = $("<p/>", {
                "class": "collection-object-count"
            });
        if (this.model.attributes.children && this.model.attributes.children.length > 0) {
            for (var i = 0; i < 5 && i < this.model.attributes.children.length; i++) {
                var item = $("<li/>", {
                    text: this.model.attributes.children[i].attributes.name
                });
                childrenList.append(item);
            }
            message.text(this.model.attributes.children.length + " items total ...");
        }
        
        this.$el.html(this.template({
            title: this.model.attributes.name,
            date: dateString,
            description: this.model.attributes.description + childrenList.html() + message.html()
        }));
        
        this.enterCollection = this.$(".enter-collection");
        this.prevControl = this.$(".previous-control-button");
        this.nextControl = this.$(".next-control-button");
        return this;
    },
            
    loadCollection : function () {
        app.load(this.model);
    },
            
    activate: function () {
        this.$el.addClass("scene-active");
        if (typeof this.previousView != "undefined") {
            this.prevControl.show();
        }
        if (typeof this.nextView != "undefined") {
            this.nextControl.show();
        }
        this.map.render(this.model);
    },
            
    deactivate: function () {
        this.$el.removeClass("scene-active");
        this.prevControl.hide();
        this.nextControl.hide();
    },
    
    previous: function () {
        if (typeof this.previousView != "undefined") {
            this.deactivate();
            this.previousView.activate();
        } else {
            alert("Already at first item.");
        }
    },
    
    next: function () {
        if (typeof this.nextView != "undefined") {
            this.deactivate();
            this.nextView.activate();
        } else {
            alert("Already at last item.");
        }
    }

})
});