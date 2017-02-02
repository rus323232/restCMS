//require func for async modules load
function require(name, modulesPath) {
    var code,
        module,
        exports,
        pattern = /(?:\.([^.]+))?$/;

    if (pattern.exec(name)[1] !== 'js') {
        name = name + '.js';
    }

    if (name in require.cache) {
        return require.cache[name];
    }

    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', (modulesPath + name), false);
    xmlRequest.send(null);

    if (xmlRequest.status === 200) {
        code =  new Function("exports, module", xmlRequest.responseText);
        exports = {};
        module = { exports: exports };
        code(exports, module);
        require.cache[name] = module.exports;
        return module.exports;
    }
}

require.cache = Object.create(null);

//pub/sub pattern implement
var publisher = {
        subscribers : {
            'any': []
        },
        makePublisher: function (obj) {
            var i;
            for (i in this) {
                if (this.hasOwnProperty(i) && typeof this[i] === "function") {
                    obj[i] = this[i];
                }
            }
            obj.subscribers = {any: []};
        },
        on: function (type, callback) {
            type = type || 'any';
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(callback);
        },
        remove: function (type, callback) {
            this.visitSubscribers('remove',type, callback);
        },
        trigger: function (type, publication) {
            this.visitSubscribers('trigger', type, publication);
        },
        visitSubscribers: function (action, type, arg) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max;
            if (!this.subscribers[pubtype]) {
                console.log("Not subscribers on: ", pubtype);
                return;
            }
                max = subscribers.length;
            for (i = 0; i < max; i += 1) {
                if (action === 'trigger') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg ) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
}


var dataSet = publisher;

//core initialization 
var core = {
    config: {},
    init: function (configPath) {
        var req = new XMLHttpRequest;

        try  {
            req.open('GET', configPath, false);
            req.send(null);

            if (req.status === 200) {
                var answer = req.responseText,
                    config = JSON.parse(answer);
                this.config = config;
            }
        }
        catch (e) {
            console.log('Error with parse config file'+e);
        }
    }
    
}

window.onload = function () {
    //first load core init
    core.init('src/configurations/core.json');
    dataSet.on('loadDefaultModules', function (modulesList) {
        if (typeof(modulesList)!= 'object') {
            modulesList = {};
            console.log('Modules list is not array');
        }
        console.log(typeof(modulesList));
        var dir = core.config.modulesDir, i, max = modulesList.length;
        for (i = 0; i<max; i++) {
           require (modulesList[i], core.config.modulesDir);
        }
    });

    dataSet.trigger('loadDefaultModules', core.config.defaultModules);
}
