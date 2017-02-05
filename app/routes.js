//require express
var express = require('express');
var path = require('path');

//create our router object
var router = express.Router();

//export our router
module.exports=router;

//route for our HomePage
router.get('/',function(req,res){
	res.render('pages/home');
});

//route for our about page
router.get('/about',function(req,res){
	res.render('pages/about');
});

//route for our contact page
router.get('/contact',function(req,res){
	res.render('pages/contact');
});
router.post('/contact',function(req,res){
	res.send('Thanks for contacting us, '+req.body.name+'| We will respond shortly');
});

//route for our LoginPage
router.get('/login',function(req,res){
	res.render('pages/login');
});
router.post('/login',function(req,res){
	res.send('Thanks for contacting us, '+req.body.name+'| We will respond shortly');
});

//route for our Address
router.get('/addLine',function(req,res){
	res.render('pages/addLine');
});
router.post('/addLine',function(req,res){
	res.send('Thanks for contacting us, '+req.body.name+'| We will respond shortly');
});