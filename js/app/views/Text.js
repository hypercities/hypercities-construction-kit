SimpleHyperCities.Views.Text = Backbone.View.extend({
    template: _.template($("#scene-template").html()),
    
    initialize: function () {
        this.title = this.$(".object-title");
        this.date = this.$(".object-date");
        this.content = this.$(".content");
        this.enterCollection = this.$(".enter-collection");
    },
    
    render: function () {
        this.enterCollection.hide();
        this.title.html(this.model.name);
        var dateString = this.model.mapping.dateFrom.date;
        if (this.model.mapping.dateFrom != this.model.mapping.dateTo) {
            dateString += " to " + this.model.mapping.dateTo.date;
        }
        this.date.html(dateString);
        this.content.html(this.model.description);

        //if (this.model.objectType == 2 || typeof this.model.children != "undefined") {
        if (this.model.children && this.model.children.length > 0) {
            var childrenList = $("<ol/>");
            for (var i = 0; i < 5 && i < this.model.children.length; i++) {
                var item = $("<li/>", {
                    text: this.model.children[i].name
                });
                childrenList.append(item);
            }
            this.content.append(childrenList);
            this.content.append($("<p/>", {text: this.model.children.length + " items total ..."}))
            $("#enter-collection").show();
        }
    }
})