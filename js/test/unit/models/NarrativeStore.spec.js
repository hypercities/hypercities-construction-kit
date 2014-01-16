describe("Narrative Store", function () {
    it("should return the correct class from parsed JSON based on the objectType.", function () {
        var store = new SimpleHyperCities.Models.NarrativeStore(),
            sampleScene = {
                id : 1,
                title: "Sample Scene"
            }
        ;
        expect(store.buildModels(sampleScene) instanceof SimpleHyperCities.Models.Scene)
            .toBeTruthy();
    });
    
    it("should return a collection object when objectType is 2", function () {
        var store = new SimpleHyperCities.Models.NarrativeStore(),
            sampleCollection = {
                id: 2,
                title: "Sample Collection",
                objectType: 2
            }
        ;
        expect(store.buildModels(sampleCollection) instanceof SimpleHyperCities.Models.Narrative)
            .toBeTruthy();
    });
    
    it("should nest objects correctly from the JSON.", function () {
        var store = new SimpleHyperCities.Models.NarrativeStore(),
        model = store.buildModels(sampleData);
        expect(model.id).toEqual(40380);
        // TODO: correct the following two numbers
        expect(model.get("children").length).toEqual(3);
        expect(model.get("children")[0].id).toEqual(41900);
    });
});
