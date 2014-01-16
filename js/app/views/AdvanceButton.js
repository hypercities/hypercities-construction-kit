var AdvanceControl = function ($controller, $dom) {
    var _dom = $($dom),
        _controller = $controller,
        _id = null;
    
    _dom.click(function () {
        _controller.display(_id);
    });
    
    this.renderObject = function ($data, $index) {
        _id = $index;
        _dom.find(".advance-control-title").text($data.name.substring(0,20));
        _dom.show();
    }

    this.hide = function () {
        // hide the item
        _dom.find(".advance-control-title").text("");
        _dom.hide();
    }
};
