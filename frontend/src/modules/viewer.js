//use jquery for DOM manipulation dummy realization and Twig viewer

var viewer = {
    page: function (o) {
    /*    //реализовать независимую вставку
        var object = o,
            append = '',
            i = 0,
            css  = o.values.css,
            js   = o.values.js,
            title = $('title'),
            head = $('head'),
            body = $('body');
        //css build
        for (i = 0; i < css.length; i++) {
            append += '<link rel="stylesheet" type="text/css" href="temp'+css[i]+'">';
        }
        head.append(append);
        append = '';
        //title build
        title.html(o.values.title);
        //js build
        for (i = 0; i < js.length; i++) {
            append += '<script src="temp'+js[i]+'"></script>';
        }*/
        $('head').html(o.values.head);
        $('body').append(o.values.content);
        $(document).ready(function () {
             eventsEmitter.trigger('pageReady');
        });
    },
    blockSingle: function (o) {
        var objectId = o._id,
            position = $('.sc-object[data-object-id = "'+objectId+'"]'),
            template = twig({
                data: o.values.layout
            });
            position.append(template.render(o.values.content));
            //делать проверку на наличие css jss и загружать их в приоритете 
        
    },
    blockSet: function (o) {
            var objectId = o._id, blockSet = "",
            i, max =  o.values.content.items.length,
            items = o.values.content.items,
            position = $('.sc-object[data-object-id = "'+objectId+'"]');

            for (i = 0; i < max; i++) {
                template = twig({
                    data: items[i].layout
                });
                blockSet += template.render(items[i].data)
            }
             position.append(blockSet);
            //делать проверку на наличие css jss и загружать в конце 
    },
    block: function (o) {
        var objectId = o._id,
        position = $('.sc-object[data-object-id = "'+objectId+'"]');
        if (position.length === 0) {
            var container = '<div class="sc-object" data-object-id="'+objectId+'">',
                collection = $('.sc-object[data-object-name="'+o.values.name+'"]');
                collection.append(container);
                position = $('.sc-object[data-object-id = "'+objectId+'"]');
        }
        template = twig({
                data: o.values.template
            });
        position.append(template.render(o.values.content));
        
    },
    menu: function (o) {
        var objectId = o._id,
            position = $('.sc-object[data-object-id = "'+objectId+'"]'),
            items = o.values.content.items,
            template = '', i, j, max = items.length, menu = "", twigParams; 
           
        for (i = 0; i < max; i++){
            template = '<li><a class="{{class}}" href="{{href}}">{{title}}</a></li>';

            if ('subMenu' in items[i]) {
                var subMenu = "", subItems = items[i].subMenu.items, subTemplate;
                for(j = 0; j < subItems.length; j++) {
                    subTemplate = '<li><a class="{{class}}" href="{{href}}">{{title}}</a></li>';
                    twigParams = twig({
                        data: subTemplate
                    });
                    subMenu += twigParams.render(subItems[j]);
                }
                subTemplate = '<ul class={{class}}>'+ subMenu +'</ul>';
                twigParams = twig({
                        data: subTemplate
                    });
                subMenu = twigParams.render(items[i].subMenu);
                template = template.replace('</li>', subMenu + '</li>');
            }

            twigParams = twig({
                data: template
            });
            menu += twigParams.render(items[i]);
        }
        template = '<ul class={{class}}>'+ menu +'</ul>';
        twigParams = twig({
                data: template
            });
        menu = twigParams.render(o.values);
        position.append(menu);
      

    }
}

module.exports = viewer;