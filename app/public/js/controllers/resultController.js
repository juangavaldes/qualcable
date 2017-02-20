function ResultController()
{
// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

	$('.inputRad').on("change", function(){ that.addRowHandlers(); })

	// confirm ORDER //
	$('#result-form-btn1').click(function(){$('.modal-confirm').modal('show')});

	// handle order submit 
	$('.modal-confirm .submit').click(function(){  that.submitOrder(); });

	this.submitOrder = function()
	{
		$('#result-form-btn2').click();
	}

	this.addRowHandlers = function()
	{
		document.getElementById('result-form-btn1').disabled = false;
		var table = document.getElementById('tblproviders');
		var rows = table.getElementsByTagName('tr');
		var provider;
		var zone;
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = 
			function(row){
				return function() { 
					var prv = row.getElementsByTagName('td')[0];
					var ze = row.getElementsByTagName('td')[2];
					row.getElementsByClassName('inputRad')[0].checked = true;
					provider = prv.innerHTML;
					zone = ze.innerHTML;
					that.refreshTable(provider,zone);
				};
			};
			currentRow.onclick = createClickHandler(currentRow);
		}
	}

	this.refreshTable = function(prov, zon)
	{
		$('#tblprices tbody').empty();
		var pdata;
		var data = {};
		data.message = prov;
		data.title = zon;
		$.ajax({
			url: "/refreshTable",
			type: "POST",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(dat){		
		    	for (i = 0; i < dat.length; i++) {
		    		var temp = dat[i];		    		
		       		$('#tblprices tbody').append('<tr><td>'+temp['price']+'</td><td>'+temp['additional']+'</td><td><input type="radio" class="priceRad" name="priceRad" checked="" value="'+temp['_id']+'"></td></tr>');
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
}

ResultController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your service request has been submitted.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
