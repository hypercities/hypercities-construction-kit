$(function () {
SimpleHyperCities.Models.NarrativeStore = Backbone.Collection.extend({
    items: {},
    
//    layerBank: new SimpleHyperCities.Map.LayerBank(),
    
    buildModels: function ($data) {
        var model;
        if (!this.get($data.id)) {
            if ($data.objectType == 2) {
                model = new SimpleHyperCities.Models.Narrative($data);
                //this.items[model.id] = model;
                
                model.attributes.children = [];
                for (var i in $data.children) {
                    model.attributes.children.push(this.buildModels($data.children[i]));
    //                var childData = $data.children[i],
    //                    child = this.buildModels(childData);
    //                // this.items[child.id] = child;
    //                model.attributes.children.push(child);
                }
            } else {
                model = new SimpleHyperCities.Models.Scene($data);
//                model = this.layerBank.convert(model);
                // pass scene to LayerStore.assignLayersToScene, which will set
                // the layers appropriately
                // for (var i in model.get("objects"))
            }
            this.add(model);
        } else {
            model = this.get($data.id);
        }
        return model;
    },
    
    load: function ($data, $callback, $context) {
        var model = null,
            self = this;
        
        if (typeof $data === "number" || typeof $data === "string") {
            model = this.get($data);
            if (!model) {
                $.getJSON("http://linuxdev.ats.ucla.edu/~david/simple_hc/getCollection.php?"
                    + "id=" + $data + "&callback=?",
                    {}, function ($data) {
                            var model = self.buildModels($data);
                            $callback.apply($context, [model]);
                    }, "json"
                );
                return true;
            }
        }
    
        model = this.get($data.id);
        if (!model) {
            if ($data.objectType == 2) {
                model = new SimpleHyperCities.Models.Narrative($data);
            } else {
                model = new SimpleHyperCities.Models.Scene($data);
            }
        }
    
        $callback.apply($context, [model]);
    }

});
});