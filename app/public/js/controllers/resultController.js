function ResultController()
{
// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

	$('.inputRad').on("change", function(){ that.addRowHandlers(); })

	this.addRowHandlers = function()
	{
		var table = document.getElementById('tblproviders');
		var rows = table.getElementsByTagName('tr');
		var provider;
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = 
			function(row){
				return function() { 
				var cell = row.getElementsByTagName('td')[0];
				provider = cell.innerHTML;			
				that.refreshTable(provider);
				};
			};
			currentRow.onclick = createClickHandler(currentRow);
		}
	}

	this.refreshTable = function(prov)
	{
		$('#tblprices tbody').empty();
		var pdata;
		var data = {};
		data.message = prov;
		$.ajax({
			url: "/refreshTable",
			type: "POST",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function(dat){		
		    	for (i = 0; i < dat.length; i++) {
		    		var temp = dat[i];		    		
		    		console.log(temp['price']);
		       		$('#tblprices tbody').append('<tr><td>'+temp['price']+'</td><td>'+temp['additional']+'</td><td><input type="radio", class="priceRad", name="priceRad", value="'+i+'"</td></tr>');
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
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
