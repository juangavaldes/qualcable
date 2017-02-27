
$(document).ready(function(){
	
	var av = new OrdersValidator();
	var sc = new OrdersController();
	
	$('#orders-form').ajaxForm({
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
	
// customize the account signup form //
	
	$('#orders-form h2').text('Administrator View');
	$('#orders-opt-btn1').text('View Orders');
	$('#orders-opt-btn2').text('Manage Users');
	$('#orders-opt-btn3').text('Delete Orders');
	$('#orders-opt-btn4').text('TBD');
	$('#orders-form-form-btn1').html('Cancel');
	$('#orders-form-btn2').html('Submit');
	$('#orders-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Control Panel!');
	$('.modal-alert .modal-body p').html('Your administration has been performed.</br>Click OK to continue.');

});