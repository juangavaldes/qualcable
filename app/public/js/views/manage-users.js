
$(document).ready(function(){
	
	var av = new UserValidator();
	var sc = new UserController();
	
	$('#users-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){
				sc.onUpdateSuccess();
				window.location.href = '/users';
			}
		},
		error : function(e){			
		}
	});
	
// customize the account signup form //
	
	$('#users-form h2').text('Manage Users');
	$('#mngusers-form-btn1').html('Submit');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Updating!');
	$('.modal-alert .modal-body p').html('Your update has been performed.</br>Click OK to continue.');

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h4').text('Update Users');
	$('.modal-confirm .modal-body p').html('Are you sure you want to update the users?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Send');
	$('.modal-confirm .submit').addClass('btn-primary');
});