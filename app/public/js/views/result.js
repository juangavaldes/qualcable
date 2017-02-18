
$(document).ready(function(){
	
	var rv = new ResultValidator();
	var rc = new ResultController();
	
	$('#result-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return rv.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){
				rc.onUpdateSuccess();
				window.location.href = '/result';
			}
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    rv.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    rv.showInvalidUserName();
			}
		}
	});
	$('#zip-tf').focus();
	
// customize the account signup form //
	
	$('#result-form h2').text('Result');
	$('#result-form #add1-tf').text('Address Line 1 information');
	$('#result-form #add2-tf').text('Address Line 2 information');
	$('#result-form #zip-tf').text('Enter ZIP Code');
	$('#result-form-btn1').html('Cancel');
	$('#result-form-btn2').html('Submit');
	$('#result-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Display Results!');
	$('.modal-alert .modal-body p').html('Your results has been performed.</br>Click OK to continue.');

});