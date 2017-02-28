function OrdersController()
{
// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

	$('.ordersRad').on('change', function(){ that.addRowHandlers(); })

	// confirm ORDER //
	$('#orders-form-btn1').click(function(){$('.modal-confirm').modal('show')});

	// handle order submit 
	$('.modal-confirm .submit').click(function(){  that.submitOrder(); });

	this.submitOrder = function()
	{
		var data = {};		
		data.status = $('.orderselect').map(function() {return $(this).val();}).get();
		data._ids = $('.ordersRad').map(function() {return $(this).val();}).get();

		$.ajax({
			url: '/orders',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(){		
		    	that.showUpdateAlert();
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});		
	}

	this.addRowHandlers = function()
	{
		document.getElementById('orders-form-btn1').disabled = false;
		var table = document.getElementById('tblorders');
		var rows = table.getElementsByTagName('tr');
		var orderId;
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = 
			function(row){
				return function() { 
					row.getElementsByClassName('ordersRad')[0].checked = true;
					orderId = row.getElementsByClassName('ordersRad')[0].value;
					that.refreshTable(orderId);
				};
			};
			currentRow.onclick = createClickHandler(currentRow);
		}
	}

	this.refreshTable = function(orderId)
	{
		$('#tblordersdtl tbody').empty();
		var data = {};
		data._id = orderId;
		$.ajax({
			url: "/refreshOrderTable",
			type: "POST",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(dat){		
		    	for (i = 0; i < dat.length; i++) {
		    		var temp = dat[i];		    		
		       		$('#tblordersdtl tbody').append('<tr><td>'+temp['_id']+'</td><td>'+temp['serviceRad']+'</td><td>'+temp['add1']+'</td><td>'+temp['add2']+'</td><td>'+temp['state']+'</td><td>'+temp['city']+'</td><td>'+temp['zip']+'</td></tr>');
		    	}
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

OrdersController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your order has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
