//use jQuery for temporary DOM handle

var DOMHandler = {
    _viewer: {},
    init: function () {
        core.loadModule('viewer');
        this._viewer = core.modules.viewer;
    },
    parseObjects: function () {
        var that = this;
        cpSelector = $('.sc-object[parsed="false"]');
        if(cpSelector.length === 0) {
            return false;
        }
        for (var i = 0, max = cpSelector.length; i < max; i++) {
                if (cpSelector.eq(i).attr('parsed') === "false") {
                    switch ((cpSelector.eq(i).attr('collection') !== undefined)&&(cpSelector.eq(i).attr('collection') !== false)) {
                        case true:
                            that._parseByName(cpSelector.eq(i));
                            break;
                        case false:
                            that._parseByID(cpSelector.eq(i))
                    }
                }
            }
        eventsEmitter.trigger('pageReady');
    },
    _parseByID: function (o) {
        var cpStore;
        var currentObjectId = o.attr('data-object-id');
        cpStore = {
            id: currentObjectId
        }
        cpStore.method = "GET";
        eventsEmitter.trigger('sendRequest', cpStore);
        o.attr('parsed','true');
    },
    _parseByName: function (o) {
        var cpStore;
        var currentObjectName = o.attr('data-object-name');
        var currentObjectType = o.attr('data-object-type');
        cpStore= {
            values: {
                name: currentObjectName,
                type: currentObjectType
            }
        }
        cpStore.method = "GET";
      
        eventsEmitter.trigger('sendRequest', cpStore);
        o.attr('parsed','true');
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