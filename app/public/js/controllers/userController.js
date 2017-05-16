function UserController()
{
	// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

	// confirm ORDER //
	$('#mngusers-form-btn1').click(function(){$('.modal-confirm').modal('show')});

	// handle order submit 
	$('.modal-confirm .submit').click(function(){  that.updateUsers(); });

	this.updateUsers = function()
	{
		var data = {};		
		data._ids = $('.userRad').map(function() {return $(this).val();}).get();
		data.status = $('.userRad').map(function() {return $(this).is(":checked");}).get();
		$.ajax({
			url: '/users',
			type: 'PUT',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(){
				$('.modal-confirm').modal('hide');		
		    	that.showUpdateAlert();
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});		
	} 
	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/logout",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}
	this.showUpdateAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html('Your order has been updated.');
		$('.modal-alert').modal('show');
		$('.modal-alert button').off('click');
	}
}
UserController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Records have been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}