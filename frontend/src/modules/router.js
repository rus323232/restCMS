var router = {
    queryParams: [],
    init: function () {
    },
    firstLoad: function () {
        var query = {
                    "method": "GET",
                    "values": {
                        "type"  : "page",
                        "name"  : "home"
                     }
        };
        this.queryParams.push(query);
    },
    buildQuery: function (data) {
        var that = this, query = {};
        if ((data.script === "index.html") || (data.script === "")) {
            query = {
                "method": "GET",
                "values": {
                    "type"  : "page",
                    "name"  : "home"
                }
            } 
            that.queryParams.push(query);
        }
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('URLChange', function (data) {

        });
         eventsEmitter.on('firstLoad', function (data) {
             that.firstLoad();
             eventsEmitter.trigger('sendRequest', that.queryParams[0]);
        });
    }
} 

router.eventsInit();

module.exports = router;