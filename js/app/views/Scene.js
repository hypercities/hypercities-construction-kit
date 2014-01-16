$(function () {
SimpleHyperCities.Views.Scene = Backbone.View.extend({
       
    tagName: "div",
    
    template: _.template($("#scene-template").html()),
    
    events: {
        "click .previous-control-button" : "previous",
        "click .next-control-button" : "next",        
        "click" : "activate"
    },
    
    initialize: function ($options) {   
        this.previousView = $options.previousView;
        this.layerSwitcher = $options.layerSwitcher;
        
        // view elements
        this.map = $options.map;
    },
    
    render: function () {
        var dateString = this.model.attributes.mapping.dateFrom.date;
        
        if (this.model.attributes.mapping.dateFrom != this.model.attributes.mapping.dateTo) {
            dateString += " to " + this.model.attributes.mapping.dateTo.date;
        }
        
        this.$el.html(this.template({
            title: this.model.attributes.name,
            date: dateString,
            description: this.model.attributes.description
        }));

        this.enterCollection = this.$(".enter-collection");
        this.prevControl = this.$(".previous-control-button");
        this.nextControl = this.$(".next-control-button");

        var displayText = this.model.attributes.name;
        if (displayText.length > 50) {
            displayText = displayText.substring(0, 
                displayText.lastIndexOf(" ", 50)
            ) + "...";
        }
        
        $("#narrative-collapse-control").text(displayText);
    
        return this;
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
//        this.layerSwitcher.renderScene(this.model);
    },
            
    deactivate: function () {
        this.prevControl.hide();
        this.nextControl.hide();
        this.$el.removeClass("scene-active");
    },
    
    previous: function ($e) {
        if (typeof this.previousView !== "undefined") {
            this.previousView.activate();
            this.deactivate();
        } else {
            alert("Already at first item.");
        }
        $e.stopPropagation();
    },
    
    next: function ($e) {
        if (typeof this.nextView !== "undefined") {
            this.nextView.activate();
            this.deactivate();
        } else {
            alert("Already at last item.");
        }
        $e.stopPropagation();
    }

})
});