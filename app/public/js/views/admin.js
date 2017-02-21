
$(document).ready(function(){
	
	var av = new AdminValidator();
	var sc = new AdminController();
	
	$('#admin-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){
				sc.onUpdateSuccess();
				window.location.href = '/result';
			}
		},
		error : function(e){			
		}
	});
	$('#zip-tf').focus();
	
// customize the account signup form //
	
	$('#admin-form h2').text('Admin Panel');
	$('#admin-form #add1-tf').text('Address Line 1 information');
	$('#admin-form #add2-tf').text('Address Line 2 information');
	$('#admin-form #city-tf').text('Enter City');
	$('#admin-form #zip-tf').text('Enter ZIP Code');
	$('#admin-form-form-btn1').html('Cancel');
	$('#admin-form-btn2').html('Submit');
	$('#admin-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Control Panel!');
	$('.modal-alert .modal-body p').html('Your administration has been performed.</br>Click OK to continue.');

});