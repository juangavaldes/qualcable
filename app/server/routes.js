
var CT = require('./modules/country-list');
var ST = require('./modules/state-list');
var CS = require('./modules/city-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var search;

module.exports = function(app) {

// main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
				    if(req.session.user.admin == true){
						res.redirect('/admin');
					}	else{
						res.redirect('/search');
					}
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});
	// logged-in user searchpage //
	
	app.get('/search', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
			res.render('search', {
				title : 'Search Service',
				states : ST,
				cities : CS,
				udata : req.session.user
			});
		}
	});
	
	app.post('/search', function(req, res){
		search =req.body;
		if (req.session.user == null){
			res.redirect('/');
		}	else{		
			AM.getServicesByZip(parseInt(req.body['zip'], 10), function(e, o){
				if (e){
					res.status(400).send('zip-code-returne-no-results');
				}	else{					
					sdata = o;							
					res.status(200).send('ok');					
				}
			});
		}
	});

	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});

	app.get('/result', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('result', {
				title : 'Search Results',
				sdata : sdata
			});
		}
	});
	
	app.post('/result', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{	
			AM.addNewOrder(req.body, search, req.session.user, function(e, o){
				if (e){
					res.status(400).send('order was not added');
				}	else{											
					res.status(200).send('ok');					
				}
			});
			/*EM.dispatchResetPasswordLink(o, function(e, m){
			// this callback takes a moment to return //
			// TODO add an ajax loader to give user feedback //
				if (!e){
					res.status(200).send('ok');
				}	else{
					for (k in e) console.log('ERROR : ', k, e[k]);
					res.status(400).send('unable to dispatch password reset');
				}
			});*/
		}
	});

	app.post('/refreshTable', function(req, res){
		AM.getPricesByProviderZone(req.body['message'], req.body['title'], function(e, o){
			if (e){
				res.status(400).send('provider-returned-no-results');
			}	else{					
				res.status(200).send(o);
			}
		});
		
	});

	// admin homepage //
	
	app.get('/admin', function(req, res) {
		if (req.session.user == null){
			console.log(req.session);
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			if(req.session.user.admin == undefined){
				res.redirect('/search');
			}	else{	
				res.render('admin', {
					title : 'Administrator View',
					udata : req.session.user
				});
			}
		}
	});

	// admin homepage //
	
	app.get('/orders', function(req, res) {
		var ostat= ["new","in-progress","completed","cancelled"];
		var odata;
		if (req.session.user == null){
			console.log(req.session);
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			if(req.session.user.admin== undefined){
				AM.getOrdersByUserId(req.session.user._id, function(e, o){
					if (e){
						res.status(400).send('orders-returne-no-results');
					}	else{					
						odata = o;	
						res.render('orders', {
							title : 'View Orders',
							odata : odata,
							ostat : ostat,
							udata : req.session.user
						});							
					}
				});
			}
			else{
				AM.getAllOrders(function(e, o){
					if (e){
						res.status(400).send('orders-returne-no-results');
					}	else{					
						odata = o;	
						res.render('orders', {
							title : 'View Orders',
							odata : odata,
							ostat : ostat,
							udata : req.session.user
						});							
					}
				});
			}
		}		
	});

	app.post('/orders', function(req, res){
		if (req.session.user == null || req.session.user.admin== undefined){
			res.redirect('/');
		}	else{
			for(i = 0; i < req.body['_ids'].length; i++){	
				var ids = req.body['_ids'];
				var status = req.body['status'];
				AM.updateOrders(ids[i], status[i]);
			}
			res.status(200).send('ok');
		}
	});

	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	app.get('/users', function(req, res) {
		var mangus;
		if (req.session.user == null || req.session.user.admin== undefined){
			console.log(req.session);
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			AM.getAllRecords( function(e, u){
				if (e){
					res.status(400).send('users-returned-no-results');
				}
				mangus = u;
				res.render('manage-users', {
					title : 'Manage Users',
					mangus : mangus,
					udata : req.session.user					 
				});
			})
		}
	});

	app.put('/users', function(req, res) {
		if (req.session.user == null || req.session.user.admin== undefined){
			res.redirect('/');
		}	else{
			for(i = 0; i < req.body['_ids'].length; i++){	
				var ids = req.body['_ids'];
				var status = req.body['status'];
				AM.updateUsersState(ids[i], status[i]);
			}
			res.status(200).send('ok');
		}
	});

	app.post('/refreshOrderTable', function(req, res){
		AM.getOrdersByOrderID(req.body['_id'], function(e, o){
			if (e){
				res.status(400).send('provider-returned-no-results');
			}	else{					
				res.status(200).send(o);
			}
		});
		
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
};