
function ResultValidator()
{
// bind a simple alert window to this controller to display any errors //
	this.loginErrors = $('.modal-alert');
	
	this.showLoginError = function(t, m)
	{
		$('.modal-alert .modal-header h4').text(t);
		$('.modal-alert .modal-body').html(m);
		this.loginErrors.modal('show');
	}
}

ResultValidator.prototype.validateForm = function()
{
	console.log('validate form');
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateZip(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error'); e.push('Please Enter A Valid Zip Code');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}