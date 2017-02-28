
function SearchValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#customerName-tf'), $('#add1-tf'), $('#add2-tf'), $('#zip-tf')];
	this.controlGroups = [$('#customerName-cg'), $('#add1-cg'), $('#add2-cg'), $('#zip-cg')];
	
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
	if (this.validateZip(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error'); e.push('Please Enter A Valid Zip Code');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	