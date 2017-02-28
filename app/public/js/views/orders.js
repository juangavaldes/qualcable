
$(document).ready(function(){
	
	var ov = new OrdersValidator();
	var oc = new OrdersController();
	
	$('#orders-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return rv.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success'){
				oc.onUpdateSuccess();
				window.location.href = '/search';
			}
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    ov.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    ov.showInvalidUserName();
			}
		}
	});	
	
// customize the account signup form //
	
	$('#orders-form h2').text('View Orders');
	$('#orders-form-btn1').html('Submit');
	$('#orders-form-btn2').html('Submit');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Display Orders!');
	$('.modal-alert .modal-body p').html('Click OK to continue.');


	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h4').text('Submit Order');
	$('.modal-confirm .modal-body p').html('Are you sure you want to update this order?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Send');
	$('.modal-confirm .submit').addClass('btn-primary');
});