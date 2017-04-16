
$(document).ready(function(){
	
	var av = new SearchValidator();
	var sc = new SearchController();
	
	$('#search-form').ajaxForm({
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
	
	$('#search-form h2').text('Search');
	$('#search-form #customerName-tf').text('Customer Name');
	$('#search-form #add1-tf').text('Address Line 1 information');
	$('#search-form #add2-tf').text('Address Line 2 information');
	$('#search-form #state-tf').text('Enter State');
	$('#search-form #city-tf').text('Enter City');
	$('#search-form #zip-tf').text('Enter ZIP Code');
	$('#search-form-btn1').html('Cancel');
	$('#search-form-btn2').html('Submit');
	$('#search-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Searching!');
	$('.modal-alert .modal-body p').html('Your search has been performed.</br>Click OK to continue.');

});