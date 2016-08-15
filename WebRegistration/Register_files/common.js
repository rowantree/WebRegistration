// $Id: common.js 22 2009-07-25 04:01:43Z stephen $
//

// Validate all the fields on the form
function ValidateForm( form ) {

	for ( var i = 0; i<fieldList.length; ++i ) {

		var fld = fieldList[i];
		var fldLabel = fld[0];
		var fldName  = fld[1];
		var fldType  = fld[2];
		var fldLen   = fld[3];

		//DebugMsg("Checking " + fldType + " Field " + i + ":" + fldLabel + " index=" + fldLabel.indexOf('*'));

		if ( !ValidateField( form, fldLabel, fldType, fldName ) ) return false;

	}

	return true;
}

function SetError( objField ) {
	objField.saveClassName = objField.className;
	objField.className = "Error";
}

function ClrError( objField ) {
	if ( objField.className == "Error" ) objField.className = objField.saveClassName;
}

function ValidateField( form, fldLabel, fldType, fldName ) 
{
	var objField = form[fldName];

	if ( fldType == "StateList" ) fldType='select';


	if ( fldType == "text" || fldType == "textarea" ) {

		if ( objField.value.length == 0 && fldLabel.indexOf('*') != -1) {
			SetError( objField );
			alert("Please enter a value for " + fldLabel );
			objField.focus();
			return false;
		} else {
			ClrError( objField );
		}

	} else if ( fldType == "date" ) {
		if ( form[fldName+'_mon'].selectedIndex==0 ||
				form[fldName+'_day'].selectedIndex==0 ||
				form[fldName+'_year'].selectedIndex==0 ) {
			SetError( form[fldName+'_mon'] );
			SetError( form[fldName+'_day'] );
			SetError( form[fldName+'_year'] );
			alert("Please select a value for " + fldLabel );
			return false;
		} else {
			ClrError( form[fldName+'_mon'] );
			ClrError( form[fldName+'_day'] );
			ClrError( form[fldName+'_year'] );
		}
	} else if ( fldType == "select" ) {

		if ( objField.selectedIndex == 0 ) {
			SetError( objField );
			alert("Please select a value for " + fldLabel );
			objField.focus();
			return false;
		} else {
			ClrError( objField );
		}

	} else if ( fldType == "radio" ) {

		// find if any of the fields are selected
		var cnt = objField.length;
		var found = false;
		while( !found && cnt-- ) {
			if ( objField[cnt].checked ) found = true;
		}
		cnt = objField.length;

		if ( !found ) {
			while( cnt-- ) {
				SetError( objField[cnt] );
			}
			alert("Please select a value for " + fldLabel );
			objField[0].focus();
			return false;
		} else {
			while( cnt-- ) {
				ClrError( objField[cnt] );
			}
		}

	}

	if ( fldName=='email' ) {
		if (!ValidateEmail( objField.value ) ) {
			alert("A valid e-mail address is required.");
			objField.focus();
			return false;
		}
	}

	if ( fldName=='zipcode' ) {
		if (!ValidateZipcode( objField.value ) ) {
			alert("A valid zip-code is required. (" + objField.value + ")");
			objField.focus();
			return false;
		}
	}


	return true;
}

// validate email address
function ValidateEmail(emailAddr)
{
	var validRegExp = /^[^@]+@[^@]+.[a-z]{2,}$/i;
	if (emailAddr.search(validRegExp) == -1)
	{
		return false;
	} 
	return true;
}

function ValidateZipcode( zipCode ) {
	var validZipExp = /^[0-9]{5}$/;
	if (!validZipExp.test(zipCode)) {
		return false;
	}
	return true;
}



function isaPosNum(s) {
   return (parseInt(s) >= 0)
}

