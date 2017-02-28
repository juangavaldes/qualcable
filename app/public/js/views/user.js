
$(document).ready(function(){
	
	var av = new UserValidator();
	var sc = new UserController();
	
	$('#user-form').ajaxForm({
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
	
	$('#user-form h2').text('Administrator View');
	$('#user-opt-btn1').text('View Orders');
	$('#user-opt-btn2').text('Manage Users');
	$('#user-opt-btn3').text('Delete Orders');
	$('#user-opt-btn4').text('TBD');
	$('#user-form-form-btn1').html('Cancel');
	$('#user-form-btn2').html('Submit');
	$('#user-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Control Panel!');
	$('.modal-alert .modal-body p').html('Your administration has been performed.</br>Click OK to continue.');

});