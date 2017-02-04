var serverRequest = {
    API: {},
    init: function () {
        this.API.adress = core.config.API.adress;
        this.API.port   = core.config.API.port;
        this.API.scheme = core.config.API.scheme;
    },
    send: function (requestData) {
        var method = requestData.method,
            query  = requestData.params,
            adress = this.API.adress,
            port   = this.API.port,
            scheme = this.API.scheme,
            req    = new XMLHttpRequest,
            url,
            that = this;
        url = scheme + '://'+adress+':'+port;
        console.dir(requestData);

        try  {
            req.open(method, url, false);
            req.send(query);

            if (req.status === 200) {
                var answer = req.responseText,
                    data = JSON.parse(answer);
                console.dir(data);
                return data;
            }
        }
        catch (e) {
            console.log('Error with server request | => '+e);
        }
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('serverRequestLoaded', function () {
            that.init();
        });
        eventsEmitter.on('sendRequest', function (a) {
            that.send(a);
        });
    },
    facade: {}
}

serverRequest.eventsInit();

module.exports = serverRequest;