var handlebars = require('handlebars');
var dateFormat =require('dateformat');

handlebars.registerHelper("formatDate", function (date) {
    return dateFormat(date, "dd-mm-yyyy");
});

handlebars.registerHelper("formatTitle", function (title) {
    return title.toUpperCase();
});

handlebars.registerHelper('isSelected', function(par1, par2) {
    if(par1 === par2) {
        return true;
    }
});