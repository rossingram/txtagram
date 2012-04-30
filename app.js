var express = require("express"),
    app = express.createServer(),
    couch = require("couch");

var c = couch(process.env.CLOUDANT_URL+"/txtagram");

app.use(express.bodyParser());

app.get('/', function(req, res){                
    res.send("txtagram homepage")
});


var postTxt = function(req, res){

    var doc = req.body;

    doc._id = generateID();
    doc = properGeoJSON(doc);

    c.post(doc, function(e, info){
        if(e) console.log("ERROR COUCHDB", e, info);
        doc.id = doc._id;
        delete doc._id;
        res.send(locationDict(doc));
    });
}

var properGeoJSON = function(doc){
    if(doc.location){
        doc.geometry = {type:"Point",coordinates:[doc.location.longitude, doc.location.latitude]};
        delete doc.location;
        return doc;
    }
}
var locationDict = function(doc){
    if(doc.geometry){
        doc.location= {latitude: doc.geometry.coordinates[1],
                       longitude: doc.geometry.coordinates[0]};
        delete doc.geometry;
        return doc;
    }
}


var generateID = function(){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var length = 6;    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

app.get('/api/txts/recent.json', function(req, res){
    c.design('txts').view('recent-items').query({}, function (e, results) {

        var rows = [];

        for(r in results.rows){
            row = results.rows[r];

            var val = row.value;
            val = locationDict(val);
            val.id = val._id
            delete val._id;
            delete val._rev;
            rows.push(val);
        }

        res.send({view:"recent", results:rows});
    })
});

app.put('/api/txt.json', postTxt);
app.post('/api/txt.json', postTxt);

app.get(/^\/(\w*)$/, function(req, res){
    if(req.params.length > 0){
        c.get(req.params[0], function (e, doc) {
            if (e) console.log("Error", e);
            if(doc)
                res.send(locationDict(doc))
            else
                res.send("not found",404);
        });
    }else{
        res.send("not found",404);
    }



})


app.use('/static', express.static(__dirname + '/static')); 
var port = process.env.PORT || 3000;
  console.log("starting on " + port);
app.listen(port, function() {
  console.log("Listening on " + port);
});



