var registrator = {
    on: function () {
       for (var event in eventsEmitter.subscribers) {
           eventsEmitter.on(event, function () {
               console.log (event+ ' | TRIGERED IN | =>'+new Date().getHours()+'H : '+new Date().getMinutes()+'M : '+new Date().getSeconds()+'S : '+new Date().getMilliseconds()+'mS |');
           })
       }
    },
    refresh: function () {

    }
}

module.exports = registrator;