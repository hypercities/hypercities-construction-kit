SimpleHyperCities.Models.Narrative = Backbone.Model.extend({
    initialize: function ($data) {
        this.data = $data;
        this.currentObject = 0;
    }
});

/*
SimpleHyperCities.Models.Narrative = Backbone.Collection.extend({
    model: SimpleHyperCities.Models.Scene,
    initialize: function ($data) {
        this.data = $data;
        for (var i in $data.objects) {
            //this.add(new SimpleHyperCities.Models.Scene($data.objects[i]));
        }
    }
});

*/