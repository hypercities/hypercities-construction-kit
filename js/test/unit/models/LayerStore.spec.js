describe("LayerStore", function () {
    it("should replace a scene's maps, objects, and its base KML with OL Layer types.", function () {
        var instance = new SimpleHyperCities.Models.NarrativeStore(),
            models = instance.buildModels(sampleData);
            
        expect(olClassOf(models.get("children")[0].maps[0]))
                .toEqual(olClassOf(new OpenLayers.Layer.TMS()));
    });
});