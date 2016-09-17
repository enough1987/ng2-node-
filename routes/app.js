var express = require('express');
var router = express.Router();
var url = require("url");

var db_components = require(__dirname + '/mongo.js').components_model;

// remove all
//db_components.find().remove().exec();

router.get('/api/components', function(req, res, next){
    var data = db_components.find();
    data.then(function(doc){   
      console.log( ' find components ' );
      res.json({error: false, components: doc});
    });
});

router.post('/api/components', function(req, res, next){
      if ( !req.body.name || !req.body.group || !req.body.body) {
        res.json({error: true, msg: 'no name or group or body was provided'});
        return ;
      }
      var post = new db_components({
        name : req.body.name,
        group : req.body.group,
        body : req.body.body
      });
      post.save(function (err, result) {
        if( err ) {
          res.json({error: true, msg: 'save was not work'});
          return ;
        }
        var data = db_components.find();
        data.then(function(doc){  
          res.json({
            error : false,
            components : doc
          }); 
        });
      });
});

router.put('/api/components', function(req, res, next){
      if ( !req.body.id || !req.body.name || !req.body.body) {
        res.json({error: true, msg: 'no name or body or id was provided'});
        return ;
      }
      db_components.findOneAndUpdate({_id:req.body.id}, {
        name : req.body.name,
        group :  req.body.group || 'mutable',
        mutability : req.body.mutability,
        body : req.body.body
      }, function (err, result) {
          if( err ) {
            res.json({error: true, msg: 'update was not successfull, there are some error'});
            return ;
          } else {
            var data = db_components.find();
            data.then(function(doc){  
              res.json({
                error : false,
                components : doc
              });
            });
          }
      });
});


router.delete('/api/components', function(req, res, next){
  var parts = url.parse(req.url, true);
  var id = parts.query.id;
  console.log( parts );
      if ( !id ) {
        res.json({error: true, msg: 'no id was provided'});
        return ;
      }
      db_components.findByIdAndRemove(id ,function(err, result){
          if( err ) {
            res.json({error: true, msg: 'delete was not successfull, there are some error'});
            return ;
          } else {
            var data = db_components.find();
            data.then(function(doc){  
              res.json({
                error : false,
                components : doc
              });
            });
          }
      });
});

router.put('/api/components/group/add', function(req, res, next){    
      if ( !req.body.group || !req.body.field ) {
        res.json({error: true, msg: 'no group or field was provided'});
        return ;
      }
      //console.log( req.body.group );
      //console.log( req.body.field );
      db_components.find({ group: req.body.group }).then(function(doc){
        //console.log( doc );
        doc.forEach(function(el, idx, arr){
          //console.log( 'el - ' , el );
          el.body.push( req.body.field );
          el.save(function (err) {
            if(err) console.error('ERROR!');
            if (idx === arr.length - 1){
              var data = db_components.find();
              data.then(function(doc){  
                  res.json({
                    error : false,
                    components : doc
                  });
              }); 
             }  // last iteration
           }); // save
        }); // forEach   
      });
});

router.put('/api/components/group/delete', function(req, res, next){    
      if ( !req.body.group || !req.body.id ) {
        res.json({error: true, msg: 'no group or id was provided'});
        return ;
      }
      console.log( req.body );
      db_components.find({ group: req.body.group }).then(function(doc){
        //console.log( doc );
        doc.forEach(function(el, idx, arr){
          console.log( 'el - ' ,  idx , arr.length , el.body.length );
          for (var i = 0, len = el.body.length; i < len; i++) {
            console.log( ' f - ', i , ' ' , el.body[i]._id , id );
            if( el.body[i]._id !== id ) return;
            console.log( f._id )
            el.body.splice(i,1);
            return ;
            el.body[i].save(function (err) {
                  if (err) console.error('ERROR!');
                  console.log(idx === arr.length - 1 , 
                      i === a.length - 1 );
                  if ( idx !== arr.length - 1 && 
                       i !== a.length - 1 ) return;
                  var data = db_components.find();
                  data.then(function(doc){  
                      res.json({
                        error : true,
                        components : doc
                      });
                  }); 
            }); // save        
          } // foreach
        }); // forEach   
      });
});

router.get('*', function(req, res, next) {
    console.log( 'go - 1');
    res.render('index');
});


module.exports = router;
