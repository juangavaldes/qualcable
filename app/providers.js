var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for providers
//this will be accessible from http://127.0.0.1:3000/providers if the default route for / is left unchanged
router.route('/')
    //GET all providers
    .get(function(req, res, next) {
        //retrieve all providers from Monogo
        mongoose.model('Provider').find({}, function (err, providers) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/providers folder. We are also setting "users" to be an accessible variable in our jade view
                    html: function(){
                        res.render('pages/provider', {
                              title: 'All my Providers',
                              "providers" : providers
                          });
                    },
                    //JSON response will show all providers in JSON format
                    json: function(){
                        res.json(providers);
                    }
                });
              }     
        });
    })
    //POST a new provider
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var zip_code = req.body.zip_code;
        //call the create function for our database
        mongoose.model('Provider').create({
            name : name,
            zip_code: zip_code,
        }, function (err, provider) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //Provider has been created
                  console.log('POST creating new provider: ' + provider);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("provider");
                        // And forward to success page
                        res.redirect("/provider");
                    },
                    //JSON response will show the newly created provider
                    json: function(){
                        res.json(provider);
                    }
                });
              }
        })
    });

/* GET New Provider page. */
router.get('/newProvider', function(req, res) {
    res.render('pages/provider', { title: 'Add New Provider' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Provider').findById(id, function (err, provider) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(provider);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Provider').findById(req.id, function (err, provider) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + provider._id);
        var userdob = provider.dob.toISOString();
        userdob = userdob.substring(0, userdob.indexOf('T'))
        res.format({
          html: function(){
              res.render('users/show', {
                "userdob" : userdob,
                "provider" : provider
              });
          },
          json: function(){
              res.json(provider);
          }
        });
      }
    });
  });

router.route('/:id/edit')
  //GET the individual provider by Mongo ID
  .get(function(req, res) {
      //search for the provider within Mongo
      mongoose.model('Provider').findById(req.id, function (err, provider) {
          if (err) {
              console.log('GET Error: There was a problem retrieving: ' + err);
          } else {
              //Return the provider
              console.log('GET Retrieving ID: ' + provider._id);
              var providerdob = provider.dob.toISOString();
              providerdob = providerdob.substring(0, providerdob.indexOf('T'))
              res.format({
                  //HTML response will render the 'edit.jade' template
                  html: function(){
                         res.render('provider/edit', {
                            title: 'Provider' + provider._id,
                            "providerdob" : providerdob,
                            "provider" : provider
                        });
                   },
                   //JSON response will return the JSON output
                  json: function(){
                         res.json(provider);
                   }
              });
          }
      });
  })
  //PUT to update a provider by ID
  .put(function(req, res) {
      // Get our REST or form values. These rely on the "name" attributes
      var name = req.body.name;
      var badge = req.body.badge;
      var dob = req.body.dob;
      var company = req.body.company;
      var isloved = req.body.isloved;

      //find the document by ID
      mongoose.model('Provider').findById(req.id, function (err, provider) {
          //update it
          provider.update({
              name : name,
              badge : badge,
              dob : dob,
              isloved : isloved
          }, function (err, userID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            } 
            else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.format({
                        html: function(){
                             res.redirect("/provider/" + provider._id);
                       },
                       //JSON responds showing the updated values
                      json: function(){
                             res.json(provider);
                       }
                    });
             }
          })
      });
  })
  //DELETE a Provider by ID
  .delete(function (req, res){
      //find provider by ID
      mongoose.model('Provider').findById(req.id, function (err, provider) {
          if (err) {
              return console.error(err);
          } else {
              //remove it from Mongo
              provider.remove(function (err, provider) {
                  if (err) {
                      return console.error(err);
                  } else {
                      //Returning success messages saying it was deleted
                      console.log('DELETE removing ID: ' + provider._id);
                      res.format({
                          //HTML returns us back to the main page, or you can create a success page
                            html: function(){
                                 res.redirect("/provider");
                           },
                           //JSON returns the item with the message that is has been deleted
                          json: function(){
                                 res.json({message : 'deleted',
                                     item : provider
                                 });
                           }
                        });
                  }
              });
          }
      });
  });

module.exports = router;