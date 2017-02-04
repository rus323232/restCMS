var router = {
    queryParams: [],
    init: function (url) {
        if (typeof(url) != 'object' || url.length < 1) {
            throw 'router.js | incoming arg must be object |';
        }
        this.buildQuery(url);
    },
    buildQuery: function (data) {
        var that = this, query = {};
        if ((data.script === "index.html") || (data.script === "")) {
            query = {
                'method': 'GET',
                'params': {
                    'type'  : 'page',
                    'name'  : 'home'
                }
            } 
            that.queryParams.push(query);
        }
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('URLChange', function (data) {
             that.init(data);
            /* eventsEmitter.trigger('sendRequest', that.queryParams);*/
        });
    }
} 

router.eventsInit();

module.exports = router;