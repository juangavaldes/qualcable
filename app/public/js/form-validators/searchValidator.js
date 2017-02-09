
function SearchValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#name-tf'), $('#email-tf'), $('#phone-tf'), $('#user-tf'), $('#pass-tf')];
	this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#phone-cg'), $('#user-cg'), $('#pass-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
		
	this.validateZip = function(e)
	{
		var re = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		return re.test(e);
	}	
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

SearchValidator.prototype.showInvalidZip = function()
{
	this.controlGroups[2].addClass('error');
	this.showErrors(['That zip code is invalid.']);
}

SearchValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateName(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Please Enter Your Name');
	}
	if (this.validateEmail(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); e.push('Please Enter A Valid Email');
	}
	if (this.validatePhone(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error'); e.push('Please Enter A Valid Phone Number');
	}
	if (this.validateName(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error');
		e.push('Please Choose A Username');
	}
	if (this.validatePassword(this.formFields[4].val()) == false) {
		this.controlGroups[4].addClass('error');
		e.push('Password Should Be At Least 6 Characters');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	