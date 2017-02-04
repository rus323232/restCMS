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
            eventsEmitter.trigger(name.substring(0, name.length - 3)+'Loaded', false);
            return require.cache[name];
        }
        try {
            var xmlRequest = new XMLHttpRequest();
            xmlRequest.open('GET', (modulesPath + name), false);
            xmlRequest.send(null);

            if (xmlRequest.status === 200) {
                code =  new Function("exports, module", xmlRequest.responseText);
                exports = {};
                module = { exports: exports };
                code(exports, module);
                require.cache[name] = module.exports;
                eventsEmitter.trigger(name.substring(0, name.length - 3)+'Loaded', true);
                return module.exports;
            }
        }
        catch (e) {
            console.log('Requires object does not exist | require func| => '+ e);
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


var eventsEmitter = publisher;

//core initialization 
var core = {
    config: {},
    modules: {},
    libraries: {},
    init: function (configPath) {
        var req = new XMLHttpRequest, that = this;

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
            console.log('Error with parse config file | => '+e);
        }

        that.eventsInit();

        eventsEmitter.trigger('loadDefaultModules', that.config.defaultModules);
        //eventsEmitter.trigger('loadDefaultLibraries', that.config.defaultLibraries); not completed
        },
    eventsInit: function () {
        var that = this;
        eventsEmitter.on('loadDefaultModules', function (modulesList) {
                if (typeof(modulesList)!= 'object') {
                    modulesList = {};
                    console.log('Modules list is not array');
                }
                var dir = that.config.modulesDir, i, max = modulesList.length;
                for (i = 0; i<max; i++) {
                    that.modules[modulesList[i]] = require(modulesList[i], dir);
                    console.log(modulesList[i]+' was loaded');
                }
            });
            //
            eventsEmitter.on('loadDefaultLibraries', function (librariesList) {
                if (typeof(librariesList)!= 'object') {
                    librariesList = {};
                    console.log('libraries list is not array');
                }
                var dir = that.librariesDir, i, max = librariesList.length;
                for (i = 0; i<max; i++) {
                require (librariesList[i], dir);
                
                console.log(librariesList[i]+' was loaded');
                }
            });

            eventsEmitter.on('loadModule', function (name) {
                var dir = that.config.modulesDir;
                that.modules[name] = require(name, dir);
                console.log('Module '+name+' was loaded');
            });
            eventsEmitter.on('loadLibrary', function (name) {
                var dir = that.config.librariesDir;
                require (name, dir);
                console.log('Library '+name+' was loaded');
            });
    },
    loadModule: function (name) {
        eventsEmitter.trigger('loadModule', name);
    },
    loadLibrary: function (name) {
        eventsEmitter.trigger('loadLibrary', name);
    }
}
//first load core init
core.init('src/configurations/core.json');
