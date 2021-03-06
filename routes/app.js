var express = require('express');
var router = express.Router();
var url = require("url");

var db_components = require(__dirname + '/mongo_components.js').components_model;
var db_pages = require(__dirname + '/mongo_pages.js').pages_model;

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
            if (idx >= arr.length - 1){
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
      //console.time('appLifeTime');    
      if ( !req.body.group || !req.body.id ) {
        res.json({error: true, msg: 'no group or id was provided'});
        return ;
      }
      //console.log( req.body );
      db_components.find({ group: req.body.group }).then(function(doc){

        for ( var index = 0 ; index < doc.length ; index++ ) {
          var component = doc[index];
          for ( var idx = 0 ; idx < component.body.length ; idx++ ){
            var field = component.body[idx];
            /*
            console.log( index , doc.length-1 , ' \ ' , 
              idx , component.body.length-1 , ' \ ' 
            );
            console.log( ' -------------- ');
            */
            if ( field._id === req.body.id ) {
                 component.body.splice(idx, 1);
                 component.save(function (err) {  
                     if(err) console.error('ERROR!');
                     console.log( ' saved  ', index , doc.length-1 );
                     if( index >= doc.length-1 ) {
                        //console.log( ' last iteration ' );
                        var data = db_components.find();
                        data.then(function(doc){  
                          res.json({
                            error : false,
                            components : doc
                          });
                        }); 
                     }
                 }); 
            }
          } // for doc[index].body
        } // for doc
        //console.log( ' END ' ); 
      });
});

router.get('/api/pages', function(req, res, next){
    var data = db_pages.find();
    data.then(function(doc){   
      console.log( ' find pages ' );
      res.json({error: false, pages: doc});
    });
});


router.post('/api/pages', function(req, res, next){
      if ( !req.body.name || !req.body.group || !req.body.body) {
        res.json({error: true, msg: 'no name or group or body was provided'});
        return ;
      }
      var post = new db_pages({
        name : req.body.name,
        group : req.body.group,
        body : req.body.body
      });
      post.save(function (err, result) {
        if( err ) {
          res.json({error: true, msg: 'save was not work'});
          return ;
        }
        var data = db_pages.find();
        data.then(function(doc){  
          res.json({
            error : false,
            pages : doc
          }); 
        });
      });
});

router.get('*', function(req, res, next) {
    console.log( 'go - 1');
    res.render('index');
});


module.exports = router;
