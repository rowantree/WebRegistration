

// $Id: register.js 82 2016-02-28 22:38:07Z stephen $



// This function is called before we post the registration against the confirm php file
// mainly we verify that everything we want in available.
function Register() {

	var form = document.REGISTER;

	// did they check the waiver
	if ( !form.waiverSigned.checked ) 
	{
		alert("Please read the waiver and check the box to indicate that you agree!");
		form.waiverSigned.focus();
		return;
	}

	// make sure they entered a payment type
	if (form.paymentType.selectedIndex==0) 
	{
		alert("Please select a payment method");
		form.paymentType.focus();
		return;
	}

	// have they selected an option if the option block is visible
	var regOption = GetRegOption();
	if (regOption < 0) {
		alert("Please select an option");
		form.regOption1.focus();
		return;
	}

	// lets see if the kids are all set
	var childCount = 0;
	for ( var idx = 1; idx<=subRegSize; ++idx ) 
	{
		var chkBox = form['ADDREG'+idx];
		var adultBox = form['adult'+idx];
		if ( chkBox && chkBox.checked && (!adultBox || !adultBox.checked) ) 
		{
			if ( form['age'+idx].value == 'N/A' ) {
				alert("Please select an age for the child");
				form['age'+idx].focus();
				return;
			}
			if ( document.getElementById("gender" + idx) )
			{
				if ( form['gender'+idx].value == 'N/A') 
				{
					alert("Please select a gender for the child");
					form['gender'+idx].focus();
					return;
				}
			}
		}
	}


	// Go calculate the amount owed
	if ( !CalcAmountDue(false) ) 
	{
		return;
	}

	// make sure the amount is a number in case we opened the field
	if ( isNaN(form.amountDue.value) ) 
	{
		alert("The amount due must be a number");
		return;
	}


	// Check the clans
	if ( !ClanCheck(true) ) 
	{
		return;
	}


	// if this is a vendor for feast they need to have selected a number of tables
	if ( form.vendorTables )
	{
		var tableCnt = GetSelectionValue(form.vendorTables);
		if ( isNaN(tableCnt) || tableCnt < 1 ) 
		{
			alert("Vendors must select tables");
			return;
		}
	}

	// if they selected vendor option they need to fill in the details
	if ( form.vendor && form.vendor.checked ) 
	{
		if ( !ValidateField( form, '*Name of Business', 'text', 'vendorBusiness')
			|| !ValidateField( form, "*Business Address", 'text', 'vendorAddress')
			|| !ValidateField( form, "*Phone", 'text', 'vendorPhone')
			|| !ValidateField( form, "*Email", 'text', 'vendorEmail')
			|| !ValidateField( form, "*MASales Tax certificate number", 'text', 'maSalesTaxNbr')
			|| !ValidateField( form, "*Type of merchandise", 'text', 'vendorMerchandise')
			|| !ValidateField( form, "*Approximate size of your setup", 'text', 'vendorSetup')
			|| !ValidateField( form, "*When have you operated as a merchant at Rites of Spring before?", 'text', "vendorHistory")
		) return false;
	}

	// Now validate anything else on the form (this is in common.js)
	if ( ValidateForm(form) ) 
	{
		if ( !speakerFlag && !staffFlag ) 
		{
			// now validate the additional fields
			for ( var idx = 1; idx<=subRegSize; ++idx ) 
			{
				var chkBox = form['ADDREG'+idx];
				if ( chkBox.checked ) 
				{
					if ( !ValidateAdditional( idx ) ) return false;
				}
			}
		}
		form.submit();
	}

}


// validate the additional column
function ValidateAdditional( idx )
{
	return true;
}


// this is called on page load of the registration form
function start() 
{

	// if debug is one clear the debug message area
	if ( pl.debug ) DebugMsg('--- Start ---');


	// first hide the javascript required message
	var msg = document.getElementById("JSREQUIRED");
	if (msg) msg.style.display='none';

	UpdateForm();

	try {
		document.forms[0].elements[0].focus();
	} catch (e) {
		// don't worry about it
	}

	// Show the price of each registration option
	SetRegOptionPrice();

	// Now show the total due
	CalcAmountDue();

	toggleGrove();
	DebugMsg('Start Done');
}


// Show the price of each registration option
function SetRegOptionPrice()
{
	DebugMsg("SetRegOptionPrice()");
	var form = document.REGISTER;
	if ( form.regOption ) 
	{
		if ( form.regOption.length)
		{
			DebugMsg("There are " + form.regOption.length + ' reg options');
			for (var i=0; i < form.regOption.length; i++)
			{
				var cost = FindCost(pl.baseFee, 99, i, 0);
				if ( cost == -1 ) cost = "n/a"; else cost = '$' + cost.toString();
				document.getElementById('lbl' + form.regOption[i].id).innerHTML = cost;
			}
		}
		else 
		{
			var cost = FindCost(pl.baseFee, 99, 0, 0);
			if ( cost == -1 ) cost = "n/a"; else cost = '$' + cost.toString();
			document.getElementById('lbl' + form.option.id).innerHTML = cost;
			form.option.checked = 1;
		}
	} 
	else DebugMsg("Odd but there is no form.regOption");
}





// Called on statup to set the form properly
function UpdateForm()
{
	var form = document.REGISTER;
	var regOption = GetRegOption();

	if (pl.event=="Feast") {

		var showVeggieCbox = false;

		// figure out if we should be showing the options for feast
		for ( var optionIdx = 0; optionIdx<pl.optionscnt; ++optionIdx )
		{
			var visibility = '';

			eval("optionList = pl.option" + optionIdx + ";");

			if ( optionList[1] == 'fridayBuffet' ) 
			{
				visibility = regOption==0 || regOption==1 ? '' : 'none';
			}
			else if ( optionList[1] == 'saturdayLunch' ) 
			{
				visibility = regOption==0 || regOption==2 ? '' : 'none';
			}
			else if ( optionList[1] == 'sundayBrunch' ) 
			{
				visibility = regOption==0 || regOption==3 ? '' : 'none';
			}
			else if ( optionList[1] == 'skipFeast' ) 
			{
				visibility = (regOption==0) ? '' : 'none';
			}


			document.getElementById(optionList[1]).style.display = visibility;

			if ( visibility=='none' ) 
			{
				form[optionList[1]].checked = false;
			}
			else
			{
				showVeggieCbox = true;
			}

		}

		// if either of those were enabled then show the veggie checkbox
		//document.getElementById("veggie").style.display = showVeggieCbox ? '' : 'none';
		SetFieldDisplay('veggie', showVeggieCbox ? '' : 'none');

	}

	else 
	{
		toggleMealPlan(0);
	}

	//toggleGuardian();   /* NOT NEEDED FOR Earthspirit */
	toggleVendor();
	toggleMedical();
	toggleHousing();
	toggleCoupon();
	toggleMasque();
	toggleDonation();

	if ( !speakerFlag && !staffFlag ) 
	{
		for( var idx=1; idx<=subRegSize; ++idx ) 
		{
			AddReg(idx);
		}
	} 
	else 
	{
		// For a speaker or staff force the veggie field to be visible
		//var veggieFld = document.getElementById("veggie");
		//veggieFld.style.display = '';
		SetFieldDisplay('veggie', '');
	}
}

// check the housing selection and display the appropriate fields. 
function toggleHousing() {

	if ( document.REGISTER.housing )
	{
		var tentSelected = document.REGISTER.housing[0].checked;
		document.getElementById("CABIN_GROUP").style.display = tentSelected ? 'none' : '';
		document.getElementById("CABIN_REQUEST").style.display = tentSelected ? 'none' : '';
		document.getElementById("RVNOTICE").style.display = tentSelected ? '' : 'none';
		//CalcAmountDue(false);
	}
}

// If the check the 'have coupon' box then ask for the coupon code
function toggleCoupon() {
	var field = document.REGISTER.discountCheckBox;
	var el = document.getElementById("CouponDiv");
	if (el) el.style.display = field.checked ? 'inline' : 'none';
}

// display should be 'inline' or 'none'
function SetFieldDisplay(fieldName, display)
{
	var el = document.getElementById(fieldName);
	if (el) el.style.display = display;
}


// need to see if we should show the masque button
// we don't need it if they selected the full weekend or just the masque
// also don't need if they are a vendor
function toggleMasque()
{
	var form = document.REGISTER;
	var el = document.getElementById("masque");

	if ( el ) {
		var option = GetRegOption();
		var msg = document.getElementById("masqueMsg");
		if ( pl.vendor )
		{
			el.style.display = 'none';
			msg.style.display = 'inline';
			form["masque"].checked = false;
		}
		else if ( option==0 || option==pl.masqueOption )
		{
			//DebugMsg("toggleMasque option zero or option " + pl.masqueOption + " was checked");
			// full weekend || masque only => included
			el.style.display = 'none';
			msg.style.display = 'inline';
			form["masque"].checked = false;
		} 
		else 
		{
			//DebugMsg("toggleMasque masque is optional so lets see it");
			// saturday => optional
			el.style.display = 'inline';
			msg.style.display = 'none';
		}
	}
}


// if they click on the vendor checkbox then display the vendor input fields
function toggleVendor() 
{
	var form = document.REGISTER;
	if ( form.vendor ) 
	{
		document.getElementById("VENDOR_DETAIL").style.display = form.vendor.checked ? '' : 'none';
	}
}

function toggleMedical() 
{
	var form = document.REGISTER;
	if ( form.medical ) 
	{
		document.getElementById("tr_qualifications").style.display = form.medical.checked ? '' : 'none';
	}
}

function toggleDonation()
{
	var form = document.REGISTER;
	if ( form.donateFlag ) 
	{
		document.getElementById("tr_donateDetail").style.display = form.donateFlag.checked ? '' : 'none';
	}

}



// check to see if we need a guardian.
// This is not needed for rites
// NOT NEEDED
function toggleGuardian() 
{
	var form = document.REGISTER;

	if ( form.birthDate_year ) {
		if ( form.birthDate_year.selectedIndex>0  && form.birthDate_mon.selectedIndex>0 
				&& form.birthDate_day.selectedIndex>0 ) 
		{
			var year = form.birthDate_year[form.birthDate_year.selectedIndex].text;
			var mon = form.birthDate_mon[form.birthDate_mon.selectedIndex].value;
			var day = form.birthDate_day[form.birthDate_day.selectedIndex].text;
			//alert("toggleGuardian  year=" + year + " month=" + mon + " day=" + day);
			var birthDate = new Date();
			birthDate.setFullYear( year, mon-1, day ); 
			var age = GetAge( birthDate);
			form.age.value = age;
			var guardianFld = document.getElementById("guardian");
			guardianFld.style.display = age < 18 ? '' : 'none';
			//CalcAmountDue(false);
		}
	}
}


/*
 * UTILITY
 *
 */

function DebugMsg(msg)
{
	if ( pl.debug ) 
	{
		console.log(msg);
		/*
		var debugMsg = document.forms[0].needs;
		if ( debugMsg ) 
		{
			//debugMsg.value = debugMsg.value + msg + "\r\n";;
			debugMsg.value = msg + "\r\n" + debugMsg.value;
		}
		*/
	}
}

function sortAge(a,b)
{
	return b.age - a.age;
}





/*
 *
 * COST
 *
 */


// Scan the provided array for the appropriate cost based on the person's age
// The first element in each row of the array is the option code
// The second element in each row of the array is the age limit
// at this point regOption is a zero based index
function FindCost(costArray, age, regOption, option)
{
	option = option || 0;
	DebugMsg("FindCost(age=" + age + " regOption=" + regOption + " option=" + option);

	for (i=0; i<costArray.length; ++i)
	{
		costRow = costArray[i];
		DebugMsg("Checking [" + i + "] option:" + costRow[0] + " age:" + costRow[1] + " price:" + costRow[2]);
		if ( costRow[0] == option && costRow[1] >= age ) 
		{
			DebugMsg("[" + i + "] Found cost for age " + age + " at regOption " + regOption + " and meal " + option + "=" + costRow[regOption+2]);
			return costRow[regOption+2];
		}
	}

	//DebugMsg("Could not find cost for specified age:" + age + " and option:" + option);
	return 0;
}

		



// age==-1 => adulst
// feast options: 1=full 2=Saturday 3=feast 4=saturday&feast
function Cost( regOption, mealPlan, member, feast, age, childCnt, regFree )
{
	if (pl.debug) DebugMsg("Cost() regOption=" + regOption + " age=" + age + " mealPlan=" + mealPlan);
	if ( regOption < 0 ) return 0;
	var total = 0;
	if ( age == -1 ) {
		// Main registration person
		if (!regFree) total += FindCost( pl.baseFee, 99, regOption, 0 );
		DebugMsg("Cost() Base Fee:" + total);
		if ( mealPlan > 0 ) {
			total += FindCost(pl.mealPlanFee, 99, regOption, mealPlan);
		}

		total -= member ? pl.memberDiscount : 0;
	}

	else {

		if ( age >= pl.childAge && childCnt <= pl.maxPayingChildren ) {
			//total += pl.childFee[regOption];
			total += FindCost(pl.baseFee,age,regOption, 0);
			//if ( age < pl.teenAge ) total -= pl.childDiscount;
		}

		if ( mealPlan ) {
			total += FindCost(pl.mealPlanFee,age,regOption, mealPlan);

			/*
			if ( age >= pl.teenAge ) {
				total += pl.mealPlanFee[regOption];
			} else if ( age >= pl.childAge ) {
				total += pl.childMealPlanFee[regOption];
			}
			*/
		}
	}



	//debugMsg.value = debugMsg.value + "(total=" + total + ")";

	return total;

}





var eventDate = new Date();



eventDate.setFullYear( 2009, 5, 20 );



// Compute age in years

function GetAge( d1 ) {

	var age = eventDate.getFullYear()-d1.getFullYear();

	//alert("age="+age);

	if ( eventDate.getMonth() < d1.getMonth() ) {

		--age;

	} else {

		if ( eventDate.getMonth() == d1.getMonth() && eventDate.getDay() < d1.getDay() ) {

			--age;

		}

	}

	return age;

}



function SelectOption() 
{
	DebugMsg("SelectOption Called");
	var form = document.REGISTER;
	var regOption = GetRegOption();

	toggleGrove();


	// select the meal plan if its free with the new option
	if ( pl.mealPlanFee[regOption-1] == 0 && form.mealPlan ) 
	{
		form.mealPlan.checked = true;
		toggleMealPlan(0);
	}

	CalcAmountDue();
}


function toggleGrove()
{
	if (pl.event=="Rites") 
	{
		// See if we should show or hid the grove list
		var regOption = GetRegOption();
		el = document.getElementById('CLANSELECTION');
		if (el) el.style.display = (regOption==2 ? '' : 'none');
	}
}


// Calculate the cost unless it has been forced set by coupon code
// Display the amount due on the form
function CalcAmountDue( force ) 
{
	UpdateForm();
	DebugMsg("CalcAmountDue");
	var form = document.REGISTER;
	if ( pl.operation == 'ADMIN' && !force ) return true;
	// If the field is unlocked then we don't calculate anything
	if ( form.priceOverride.value==1 ) return true;
	var totalCost  = CalcCost(form);
	if ( totalCost < 0 ) return false;
	form.calculatedAmount.value = totalCost;
	form.amountDue.value = totalCost.toFixed(2);
	return true;
}




// Calculate the amount due and return it
function CalcCost(form) 
{
	var total = 0;

	if ( speakerFlag ) {
		form.amountDue.value = 0;
		return 0;
	}

	var heatedCabin = 0;
	var feast = 0;
	var mealPlan = 0;
	var member = 0;

	/*
	 * which option: full week, weekend only, etc
	 */
	var regOption = GetRegOption();
	DebugMsg("CalcCost GetRegOption->" + regOption);
	// If they did not pick anything off we go
	if ( regOption < 0 ) return 0;

	/*
	 * Member
	 */
	if ( form.member )
	{
		member = form.member.checked;
		DebugMsg("Member flag is set to " + member);
	}

	/*
	 * Housing
	 */
	if ( form.housing ) 
	{
		if ( form.housing.type == 'hidden' ) 
			heatedCabin = form.housing.value;
		else if ( form.housing[3].checked ) 
			heatedCabin = 1;

		if ( form.feastOnly ) {
			if ( form.feastOnly.type == 'hidden' ) 
				feast = form.feastOnly.value;
			else if ( form.feastOnly.checked ) 
				feast = 1;
		}
	} else 
	{
		if ( form.heatedspace ) heatedCabin = form.heatedspace.checked;
	}


	/*
	 * Meal Plan
	 */
	var mealPlanOption = GetMealPlanOption(form);

	// Compute the adult cost
	DebugMsg("CalcCost Call Cost for regOption=" + regOption);
	total = Cost(regOption, mealPlanOption, member, feast, -1, 0, form.priceOverride.value=="REGFREE");
	if ( heatedCabin ) { total += pl.heatedCabinFee; }

	// This is a hack for the masque for a saturday only
	var masque = (form.masque && form.masque.checked);
	if (masque) total += pl.masqueCost;

	// Vendor
	if ( form.vendor && form.vendor.checked ) 
	{
		total += pl.vendorFee;
	}


	// Options
	var optionList;
	for ( var optionIdx = 0; optionIdx<pl.optionscnt; ++optionIdx )
	{
		eval("optionList = pl.option" + optionIdx + ";");
		//alert("Checking option " + optionIdx + "=>" + optionList[0]);
		if ( form[optionList[1]].checked ) 
		{
			total += optionList[2];
		}
	}

	DebugMsg("Total for main registrant is " + total);


	// Add in the additional registrations
	// NOTE: child age value is +1 because its zero based ( age 0 => 1 )
	var childCount = 0;

	var childList = new Array();
	for ( var childIdx = 1; childIdx<=subRegSize; ++childIdx ) 
	{
		var chkBox = form['ADDREG'+childIdx];
		if ( chkBox && chkBox.checked ) 
		{
			var age = form['age'+childIdx].value-1;
			childList[childList.length] = {age:age, idx:childIdx};
		}
	}

	childList.sort(sortAge);

	var childMealPlanIssue = false;

	for ( var i in childList )
	{
		var childIdx = childList[i].idx;
		var age = childList[i].age;
		var mealPlan = 0;

		if ( form['mealPlan'+childIdx] ) 
		{
			if ( form['mealPlan'+childIdx].checked && mealPlanOption==0 ) {
				childMealPlanIssue = true;
				form['mealPlan'+childIdx].checked = false;
			}
			if ( form['mealPlan'+childIdx].checked ) mealPlan = mealPlanOption;
			DebugMsg("Child meal plan option is " + mealPlan);
		}

		var adult = false;
		if ( age >= pl.childAge ) 
		{
			total += Cost(regOption, mealPlan, 0, 0, age, ++childCount,false );
		}

		// kids pay for heat
		if ( heatedCabin ) { total += pl.heatedCabinFee; }


		if (pl.event=="Feast") 
		{
			masque = (form['masque'+childIdx] && form['masque'+childIdx].checked);
			if (masque & age >= pl.childAge) total += pl.masqueCost;
		}

		for ( var optionIdx = 0; optionIdx<pl.optionscnt; ++optionIdx )
		{
			eval("optionList = pl.option" + optionIdx + ";");
			if ( form[optionList[1]+childIdx].checked ) {
				total += (adult || age>pl.optionDiscountAge) ? optionList[2] : optionList[3];
			}
		}

		DebugMsg("Total after child " + i + " is " + total);

	}



	// Scholarship fund
	var schfund = form.schfund;
	if ( schfund && schfund.value != '') 
	{
		var newVal = Math.max(parseInt(schfund.value),0);
		if ( !isNaN(newVal) ) 
		{
			schfund.value = newVal;
			total += newVal;
		} 
		else 
		{
			alert("I could not understand the value you entered for the scholarship fund");
			schfund.value = "";
		}
	}

	if ( childMealPlanIssue ) 
	{
		alert("You can't put a child on the meal plan unless the parent is also on");
	}

	// vendor tables
	if ( form.vendorTables )
	{
		var tableCnt = GetSelectionValue(form.vendorTables);
		DebugMsg('Vendor Table Count:' + tableCnt);
		if ( !isNaN(tableCnt) ) 
		{
			total += tableCnt * 40;
		}
	}



	return total;



}

// for a specified drop down get the value of the current selection
function GetSelectionValue(dropDown)
{
	var value = 0;
	if ( dropDown ) 
	{
		if ( dropDown.length)
		{
			DebugMsg("GetSlectionValue: checking " + dropDown.length + " options");
			for (var i=0; i < dropDown.length; i++)
			{
				if (dropDown[i].selected)
				{
					value = dropDown[i].value;
					DebugMsg("GetSelectionValue:i=" + i + " value=" + value);
					break;
				}
			}
			// They did not select anything
			DebugMsg("GetSelectionValue:value=" + value);
			if (value==0) return -1;
		}
		else 
		{
			DebugMsg("GetSlectionValue: No length");
			// there is only one option
			return dropDown[0].value;
		}
	} 
	else 
	{
		value = 1;
	}
	return value;
}




function toggleMealPlan( index ) {

	var form = document.REGISTER;
	var mealPlan = false;

	CalcAmountDue(false);


	if ( index == 0 ) {
		if ( form.mealPlanOption ) 
		{
			if (pl.event=="Feast") {

				mealPlan = (form.saturdayLunch && form.saturdayLunch.checked) 
					|| (form.sundayBrunch && form.sundayBrunch.checked)
					|| (form.fridayBuffet && form.fridayBuffet.checked)
					|| (form.skipFeast && !form.skipFeast.checked);

			} else {
				mealPlan = GetMealPlanOption(form);
			}
		}
		else {
			// if no meal plan field then assume its true
			mealPlan = 1;
		}



		// Display the veggie option if meal plan is checked or if there is no meal plan option
		/*
		var veggieFld = document.getElementById("veggie");
		if ( veggieFld ) {
			veggieFld.style.display = mealPlan > 0 ? '' : 'none';
		}
		*/
		SetFieldDisplay('veggie', mealPlan > 0 ? '' : 'none');

	} else {
		// update the veggie toggle for additional registrations
		//document.getElementById("VEGGIE_HDR").style.visibility = form.mealPlan.checked ? 'visible' : 'hidden';
		AddReg( index );
	}
}








// hide or show the fields for additional registrations
function AddReg( nbr ) {

	var form = document.REGISTER;
	var chkBox = form['ADDREG'+nbr];
	var visibility = chkBox.checked ? 'visible' : 'hidden';
	var regOption = GetRegOption();



	// set visibility on the name fields

	document.getElementById("fname" + nbr).style.visibility = visibility;

	document.getElementById("lname" + nbr).style.visibility = visibility;



	// if we have the adult checkbox available then we show it and evaluate it otherwise its a kid
	var adultFlag = false;
	var adultCheckBox = document.getElementById('adult'+nbr);
	if ( adultCheckBox )
	{
		adultCheckBox.style.visibility = visibility;
		adultFlag = form['adult'+nbr].checked;
	}



	// only shows these if we are not processing an adult
	if ( document.getElementById("gender" + nbr) )
	{
		document.getElementById("gender" + nbr).style.visibility = adultFlag ? 'hidden' : visibility;
	}
	document.getElementById("age" + nbr).style.visibility = adultFlag ? 'hidden' : visibility;



	// Show/Hide the option fields (force invisible if not option 0)
	for ( var optionIdx = 0; optionIdx<pl.optionscnt; ++optionIdx )
	{

		var thisVisibility = visibility;
		eval("optionList = pl.option" + optionIdx + ";");

		// child can only select options the parent has selected
		var parentSelected = form[optionList[1]] && form[optionList[1]].checked;

		if ( optionList[1] == 'saturdayLunch' ) 
		{
			if ( (regOption!=0 && regOption!=2) || !parentSelected)
				thisVisibility = 'hidden';
		}
		else if ( optionList[1] == 'sundayBrunch' )
		{
			if ( (regOption!=0 && regOption!=3) || !parentSelected ) 
				thisVisibility = 'hidden';
		}

		else if ( optionList[1] == 'fridayBuffet' )
		{
			if ( (regOption!=0 && regOption!=1) || !parentSelected )
				thisVisibility = 'hidden';
		}

		else if ( optionList[1] == 'skipFeast' )
		{
			if ( (regOption!=0 && regOption!=1) || !parentSelected )
				thisVisibility = 'hidden';
		}


		document.getElementById(optionList[1]+nbr).style.visibility = thisVisibility;

		if ( thisVisibility=='hidden' ) form[optionList[1]+nbr].checked = false;

	}



	var mealPlan = 0;

	if (pl.event=="Feast") {
		mealPlan = (form['saturdayLunch'+nbr] && form['saturdayLunch'+nbr].checked) 
			|| (form['sundayBrunch'+nbr] && form['sundayBrunch'+nbr].checked)
			|| (form['fridayBuffet'+nbr] && form['fridayBuffet'+nbr].checked);
	} else {
		if ( document.getElementById("mealPlan" + nbr) ) 
		{
			document.getElementById("mealPlan" + nbr).style.visibility = visibility;
			if ( form["mealPlan" + nbr].checked ) mealPlan = GetMealPlanOption(form);
		}
	}

	// only show the veggie option if the meal plan is selected
	if ( document.getElementById("veggie" + nbr) ) {
		document.getElementById("veggie" + nbr).style.visibility = 
			mealPlan ? visibility : 'hidden';
	}

	// Masque only is charged for if they did NOT get a full weekend which
	// has to be option zero
	// its is included with option==2 mask only
	// its not available with option==1 saturday only
	var el = document.getElementById("masque" + nbr);
	if ( el ) {
		if ( pl.vendor || form.regOption[0].checked || form.regOption[pl.masqueOption].checked ) {
			// full or stage king only => included
			el.style.display='none';
			document.getElementById("masqueMsg" + nbr).style.display =
				(visibility=='hidden' ? 'none' : 'inline');
	    } else {
			// Saturday only => optional for kids
			el.style.display = (visibility=='hidden' ? 'none' : 'inline');
			document.getElementById("masqueMsg" + nbr).style.display = 'none';
		}
		if ( el.style.display=='none' ) form["masque"+nbr].checked = false;
	}

	// I DONT THINK WE NEED THIS
	//CalcAmountDue(false);
}


// This is called when we get the result back from the coupon check
function gotCode(result)
{
	var form = document.REGISTER;

	if ( result == "OPEN" ) 
	{
		form.amountDue.readOnly=false;
		alert("Enter total amount due in the amount due field");
		form.amountDue.focus();
		form.priceOverride.value=1;
		return;
	}

	if ( result == "REGFREE" )
	{
		form.priceOverride.value = "REGFREE";
		!CalcAmountDue(false);
		return;
	}

	var result = result.match(/FIXED=(\d+)/);
	if ( result != null ) {
		form.amountDue.value=result[1];
		form.priceOverride.value=1;
		return;
	}

	alert("Coupon code was not valid." + result);
	form.coupon.value='';
}



// Call this when the user enters a coupon code

function CheckCoupon() 
{
	HTTP.getText("CheckCode.php?code=" + document.forms[0].coupon.value,gotCode);
}



// Twilight: When user clicks a clan that requires input
// Also confirm that they have selected unique clans
function ToggleClanNotes(index)
{
	var el = "test";
	var form = document.forms[0];
	eval("el = form.CLAN" + index + ";");
	var text = el.options[el.selectedIndex].text;
	var show = text.indexOf("*") >= 0;
	//alert(el.options[el.selectedIndex].text);
	el = document.getElementById('CLAN_NOTES' + index);
	el.style.display = show ? 'inline' : 'none';
	ClanCheck(false);
}


// If allSelected is true then we make sure they have selected all the clans
function ClanCheck(allSelected)
{
	var form = document.REGISTER;
	if ( !form.CLAN0 ) return true;

	// if this is rights then we only want to check this if they select VB
	el = document.getElementById('CLANSELECTION');
	if (!el) return true; 
	if (el.style.display == 'none') return true;

	var clanSelection = [];
	for (var i=0; i<pl.clanSelectionCnt; ++i)
	{
		clanSelection[i] = form["CLAN"+i].selectedIndex;
	}

	for (var i=0; i<pl.clanSelectionCnt; ++i)
	{
		for(var j=i+1; j<pl.clanSelectionCnt; ++j)
		{
			if (clanSelection[i] != 0 && clanSelection[i] == clanSelection[j])
			{
				alert( pl.clanSelectionName + " selection must be unique");
				return false;
			}
		}
	}

	if ( allSelected )
	{
		for (var i=0; i<pl.clanSelectionCnt; ++i)
		{
			if (clanSelection[i] == 0)
			{
				alert("Please select " + pl.clanSelectionCnt + " " + pl.clanSelectionName + 's');
				return false;
			}
		}
	}

/*
	if ( (
		form.CLAN0.selectedIndex > 0 && 
			(form.CLAN0.selectedIndex==form.CLAN1.selectedIndex ||
			 form.CLAN0.selectedIndex==form.CLAN2.selectedIndex ||
			 form.CLAN0.selectedIndex==form.CLAN3.selectedIndex )
		) || (
		form.CLAN1.selectedIndex > 0 && 
			(form.CLAN1.selectedIndex==form.CLAN2.selectedIndex ||
			 form.CLAN1.selectedIndex==form.CLAN3.selectedIndex )
		) || (
		form.CLAN2.selectedIndex > 0 && 
			 form.CLAN2.selectedIndex==form.CLAN3.selectedIndex 
		)
		)
		{
			alert("Clan Selection Must Be Unique");
			return false;
		}

	if ( allSelected && ( form.CLAN0.selectedIndex==0 ||
				form.CLAN1.selectedIndex==0 ||
				form.CLAN2.selectedIndex==0 ||
				form.CLAN3.selectedIndex==0  )
	   )
	{
		alert("Please select " + p.clanSelectionCnt + " " + pl.clanSelectionName);
		return false;
	}
*/

	// see if they entered the required info for advanced clans
	if ( allSelected) 
	{
		var select;
		var text;
		for (var i=0; i<4; ++i) {
			eval("select=form.CLAN"+i);
			if ( select!=null ) {
				if ( select.value.indexOf('*') != -1 )
				{
					// its an advanced field and there should be some text in CLAN_MSG[i]
					eval("text=form.CLAN_MSG"+i);
					if (!text.value.match(/\w+/)) {
						alert("Please enter some text for clan " + select.value);
						text.focus();
						return false;
					}
				}
			}
		}
	}
	return true;
}


function GetMealPlanOption(form)
{
	DebugMsg("GetMealPlanOption()");
	var regOption = GetRegOption();
	var mealPlanOption = -1;
	if ( form.mealPlanOption && form.mealPlanOption.length ) 
	{
		for (var i=0; i < form.mealPlanOption.length; i++)
		{
			var cost = FindCost(pl.mealPlanFee, 99, regOption, i);
			if ( cost == -1 ) cost = "n/a"; else cost = '$' + cost.toString();
			document.getElementById('lbl' + form.mealPlanOption[i].id).innerHTML = cost;
			if (form.mealPlanOption[i].checked)
			{
				if ( cost == "n/a" ) 
				{
					form.mealPlanOption[0].checked = true;
					mealPlanOption = 0;
				}
				else 
				{
					mealPlanOption = form.mealPlanOption[i].value;
				}
			}
		}
		if (mealPlanOption==-1) 
		{
			form.mealPlanOption[0].checked = true;
			return 0;
		}
	}
	else if ( form.mealPlanOption && !form.mealPlanOption.length )
	{
		mealPlanOption = form.mealPlanOption.value;
	}
	return mealPlanOption;

}



// Return which general option they selected
// 2012.11.23 changed to return 0 if there is not option form, only known case
// is a vendor registration
function GetRegOption()
{
	var form = document.REGISTER;
	var regOption = -1;
	if ( form.regOption ) 
	{
		if ( form.regOption.length)
		{
			for (var i=0; i < form.regOption.length; i++)
			{
				if (form.regOption[i].checked)
				{
					regOption = (form.regOption[i].value)-1;
					DebugMsg("GetRegOption found regOption " + i + " checked, value=" + form.regOption[i].value + " option=>" + regOption);
					break;
				}
			}
			if (regOption < 0) {
				DebugMsg("GetRegOption found an regOption less than zero so we return the first one:" + form.regOption[0].value-1);
				form.regOption[0].checked = true;
				return form.regOption[0].value-1;
			}
		}
		else 
		{
			// there is only one option
			DebugMsg("GetRegOption is returning the single regOption:" + (form.regOption.value-1));
			return (form.regOption.value)-1;
		}
	} 
	else 
	{
		regOption = 0;
	}

	DebugMsg("GetRegOption() is returning " + regOption);
	return regOption;
}
