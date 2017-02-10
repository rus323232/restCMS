var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();
var mongoOp     =   require("./mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(express.static('../frontend'));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "send api/"});
});

router.route("/api/object")
    .get(function(req,res){
        var response = {},
            search    = {
                "values.name" : req.query.name,
                "values.type" : req.query.type
            }
         console.dir(search);
      
        mongoOp.find(search, function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(data);
        });
        
    })
    .post(function(req,res){
        var response = {};
        var entry = new mongoOp({
            values: req.body.values
        });
        entry.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });
    router.route("/api/object/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = data;
            }
            res.json(data);
        });
    })
    .put(function(req,res){
        var query = {'_id': req.params.id};
        
        mongoOp.findOneAndUpdate(query,  {$set:{'values.content.shortText':req.body.shortText}}, {new: true}, function(err, doc){
            if (err) return res.send(500, { error: err });
            return res.json("succesfully saved");
        });
    })
    .delete(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                // data exists, remove it.
                mongoOp.remove({_id : req.params.id},function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                    }
                    res.json(response);
                });
            }
        });
    })

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
