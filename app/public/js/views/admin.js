
$(document).ready(function(){
	var sc = new AdminController();
	
// customize the account signup form //
	
	$('#admin-form h2').text('Administrator View');
	$('#admin-opt-btn1').text('Manage Orders');
	$('#admin-opt-btn2').text('Manage Accounts');
	$('#admin-opt-btn3').text('Manage DB');
	$('#admin-opt-btn4').text('Submit Request');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Control Panel!');
	$('.modal-alert .modal-body p').html('Your administration has been performed.</br>Click OK to continue.');

});