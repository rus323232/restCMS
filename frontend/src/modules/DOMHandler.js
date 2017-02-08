//use jQuery for temporary DOM handle

var DOMHandler = {
    _viewer: {},
    init: function () {
        core.loadModule('viewer');
        this._viewer = core.modules.viewer;
    },
    parseObjects: function () {
        var cpStore = [],
            cpSelector = $('.sc-object'),
            answer = [];
    
        for (let i = 0, max = cpSelector.length; i < max; i++) {
            if (cpSelector.eq(i).attr('parsed') === "false") {
                cpStore[i] = [];
                var currentObjectId = cpSelector.eq(i).attr('data-object-id');
                cpStore[i] = {
                    id: currentObjectId
                }
                cpStore[i].method = "GET";
                eventsEmitter.trigger('sendRequest', cpStore[i]);
                cpSelector.eq(i).attr('parsed','true');
            }
        }
    },
    renderObject: function (data) {
       var i, max = data.length, object;
       if(data.length !== undefined) {
       for (i = 0; i < max; i++) {
           object = data[i];
           this._viewer[data[i].values.type](data[i]);
       }
       } else {
           //if request is simple object, not Array
           this._viewer[data.values.type](data);
       }
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('DOMHandlerLoaded', function () {
            that.init();
        })
        eventsEmitter.on('dataLoaded', function (d) {
            that.renderObject(d);
        });
        eventsEmitter.on('pageReady', function () {
            that.parseObjects();
        });
    }
}

DOMHandler.eventsInit();

module.exports = DOMHandler;