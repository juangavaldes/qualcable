function ResultController()
{
// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

// handle table click//
	$('#tblproviders').on('click-row.bs.table',function(){ that.addRowHandlers(); });    

	$('input.inputRad').click(function(){ that.addRowHandlers(); });

}
	this.addRowHandlers = function()
	{
		console.log("click received");
		var table = document.getElementById("tblproviders");
		var rows = table.getElementsByTagName("tr");
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = 
			function(row){
				return function() { 
				var cell = row.getElementsByTagName("td")[0];
				var id = cell.innerHTML;
				alert("id:" + id);
				};
			};

			currentRow.onclick = createClickHandler(currentRow);
		}
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

HomeController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
