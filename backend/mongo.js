var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/restCMS');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var Object  = {
    values:{},
    modified: { type: Date, default: Date.now }
};
// create model if not exists.
module.exports = mongoose.model('Object',Object);