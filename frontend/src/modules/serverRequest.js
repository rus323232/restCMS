//temporary use jquery for simple CRUR queries

var serverRequest = {
    API: {},
    init: function () {
        this.API.adress = core.config.API.adress;
    },
    send: function (requestData) {
        var method = requestData.method,
            query  = requestData.values,
            url    = 'id' in requestData ? this.API.adress + requestData.id : this.API.adress,
            req    = new XMLHttpRequest,
            url,
            that = this;

        $.ajax({
            url: url,
            type: method,
            dataType: "JSON",
            async: false,
            data: query,
            success: function (data) {
                console.dir(data);
                console.log(typeof (data))
                eventsEmitter.trigger('dataLoaded', data);
            }
        }).fail(function () {
            throw ('Error with getting JSON object');
        });
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('serverRequestLoaded', function () {
            that.init();
        });
        eventsEmitter.on('sendRequest', function (d) {
            that.send(d);
        });
    },
    facade: {
        request: this.API
    }
}

serverRequest.eventsInit();

module.exports = serverRequest.facade;