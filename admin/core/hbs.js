var hbs = require('hbs');
var lodash = require('lodash');

hbs.registerHelper('increment', function(index){
    return parseInt(index) + 1;
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('renderStatus', function(status){
    
    var cssclass = '';
    if(status === 'Enabled')
        cssclass = 'label-info';
    else cssclass = 'label-danger';

    return new hbs.SafeString(`<span class="label ${cssclass}">${status}</span>`);
});

hbs.registerHelper('upperCaseFirst', function(text){
    return lodash.upperFirst(text);
});

hbs.registerHelper('showNotice', function(notification, type){

    if(!notification) return '';

    var msg = '';
    if(Array.isArray(notification)){
        
        lodash.uniqBy(notification, 'param')
        .forEach(function(element, index, array) {

            if(index < array.length - 1) msg += element.msg + '<br/>';
            else msg += element.msg;

        }, this);

    }else msg = notification;
    
    msg = '<div class="alert alert-' + (type == 'success' ? 'info' : 'danger') + '">' + msg + '</div>';
    return new hbs.SafeString(msg);
});

module.exports = hbs;