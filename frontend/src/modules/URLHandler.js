var URLHandler = {
    _URL: '',
    detailURL: {},
    init: function () { 
        var that = this;
        if (document.referrer === '') {
            that._URL = window.location.href;
        }
        else {
            that._URL = document.referrer;
        }
        that.detailURL = that.parseUrl(that._URL);
    },
    parseUrl: function (url) {
        var parts = url.split("#"),
            out = {};
            out.url = url;
            out.hash = (parts.length > 1 ? ((url = parts.shift()) || 1) && parts.join("#") : "");
            url = (parts = url.split("?")).shift();
            out.search = parts.join("?");
            out.scheme = (parts = url.split("://")) && parts.length > 1 ? parts.shift() : "";
            out.host = ((parts = parts.join("://").split("/")) && parts.length > 1 &&
            parts[0].indexOf(".") > 0 || out.scheme ) && parts.shift() || "";
            out.script = parts.pop();
            out.path = (parts.length > 0 ? "/" : "") + parts.join("/");
        return out;
    },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('URLHandlerLoaded', function () {
            that.init();
        });
        window.addEventListener('hashchange', function () {
            that.init();
            eventsEmitter.trigger('URLChange', that.detailURL);
        }, false);
        document.addEventListener('onload', function () {
            that.init();
            eventsEmitter.trigger('URLChange', that.detailURL);
        }, false);
    }
} 

URLHandler.eventsInit();

module.exports = URLHandler;