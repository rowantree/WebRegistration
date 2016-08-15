
var speakerFlag = false;
var vendorFlag = false;
var staffFlag = false;
var pl = {
	"memberDiscount" : 5,
	"heatedCabinFee" : 60,
	"RegOptions": [
			{ Label: 'Full Rites of Spring',                       Value: 1, Cost: [ {Age: 99, Price: 300 }, { Age: 17, Price: 150} ] },
			{ Label: 'Weekend Only',                               Value: 2, Cost: [ {Age: 99, Price: 230 }, { Age: 17, Price: 120} ] },
			{ Label: 'Village Builders (w/ Full Rites of Spring)', Value: 3, Cost: [ {Age: 99, Price: 400 }, { Age: 17, Price: 200} ] },
		],
	"mealPlans" : [
		{ RegOption: 1, Tag: "Meal Plans For Full Rites of Spring",
			Options : [
					{ Label: 'None',        Value: 0, Cost: [ { Age:99, Price:0  } ] },
					{ Label: 'Full',        Value: 1, Cost: [ { Age:99, Price:95 } ] },
					{ Label: 'Dinner Only', Value: 2, Cost: [ { Age:99, Price:95 } ] },
			]
		},
		{ RegOption: 2, Tag: "Meal Plans for Weekend Only",
			Options : [
					{ Label: 'None',        Value: 0, Cost: [ { Age:99, Price:0  } ] },
					{ Label: 'Full',        Value: 1, Cost: [ { Age:99, Price:95 } ] },
			]
		},
		{ RegOption: 3, Tag: "Meal Plans for Village Builders",
			Options : [
					{ Label: 'Included',    Value: 1, Cost: [ { Age:99, Price:0 } ] },
			]
		},
		],
	"optionscnt" : 0,
	"adultAge" : 18,
	"teenAge" : 13,
	"childAge" : 5,
	"childDiscount" : 0,
	"vendorFee" : -100,
	"maxPayingChildren" : 2,
	"masqueOption" : 0,
	"masqueCost" : 0,
	"optionDiscountAge" : 12,
	"debug" : 0,
	"vendor": 0,
	"clanSelectionName": 'grove',
	"clanSelectionCnt" : 3,
	"operation" : '',
	"event": 'Rites',
	"groveOptions":[
        { Value:"Stone",  Label:"Stone (includes Torches; Healers Hall)" },
        { Value:"Green Ones", Label:"Green Ones (includes tent set up; Gates)" },
        { Value:"Fire", Label:"Fire (includes prep at ritual fire circle; wood cutting)" },
        { Value:"Lake", Label:"Lake (includes merchant area prep; workshop spaces)" },
        { Value: "Heart", Label: "Heart (includes Registration prep; Center Fire and Dining Hall lighting)" },
        { Value: "Inspiration", Label: "Inspiration (includes workshop spaces; Sara Cooper set up)" },
	],

	"statesList" : [
        { Value: "AB", Label: "Alberta" },
        { Value: "CA", Label: "California" },
        { Value: "CO", Label: "Colorado" },
        { Value: "CT", Label: "Connecticut" }
	],
	"housingOptions": [
        { Value: "tent", Label: "My Tent", Cost: 0 },
        { Value: "cabin", Label: "a Cabin", Cost: 0 },
        { Value: "rustic cabin", Label: "Rustic Cabin", Cost: 0 },
        { Value: "heated cabin", Label: "Heated Space($60)", Cost: 60 }
	],
	"housingGenderOptions":[
        { Value: "1", Label: "No Preference" },
        { Value: "2", Label: "All-Female" },
        { Value: "3", Label: "All-Male" }
	],
	"housingAreaOptions": [
        { Value: "1", Label: "No Preference" },
        { Value: "2", Label: "Quiet" },
        { Value: "3", Label: "Late Night" },
    	{ Value: "4", Label: "Family" }
    ],
	"paymentTypeOptions": [
        { Value: "PayPal", Label: "PayPal" },
        { Value: "MO", Label: "Money Order" },
        { Value: "FinAss", Label: "Financial Assistance" },
    	{ Value: "Check", Label: "Check" }
    ],

}
	var subRegSize = 4;
var fieldList = new Object;
	fieldList.firstName = [ 'First Name*', 'firstName', 'text', '60' ];
	fieldList.lastName = [ 'Last Name*', 'lastName', 'text', '60' ];
	fieldList.akaName = [ 'Preferred Name', 'akaName', 'text', '60' ];
	fieldList.address = [ 'Address*', 'address', 'text', '60' ];
	fieldList.city = [ 'City*', 'city', 'text', '60' ];
	fieldList.state = [ 'State*', 'state', 'StateList', '2' ];
	fieldList.country = [ 'Country', 'country', 'text', '60' ];
	fieldList.zipcode = [ 'Zipcode*', 'zipcode', 'text', '10' ];
	fieldList.email = [ 'Email Address*', 'email', 'text', '60' ];
	fieldList.bestPhone = [ 'Best Phone*', 'bestPhone', 'text', '20' ];
	fieldList.secondPhone = [ '2nd Phone', 'secondPhone', 'text', '20' ];
	fieldList.regOption = [ 'Option*', 'regOption', 'radioList', 'SelectOption()' ];
	fieldList.mealPlanOption = [ 'Meal Plan', 'mealPlanOption', 'radioList', 'toggleMealPlan(0)' ];
	fieldList.veggie = [ 'Vegetarian', 'veggie', 'check', '' ];
	fieldList.firstros = [ 'This is my first Rites of Spring', 'firstros', 'rcheck', '' ];
	fieldList.EmailList = [ 'Please check here if you do <b>not</b> want to be added to the EarthSpirit event e-mail list', 'EmailList', 'rcheck', '' ];
	fieldList.vendor = [ 'I would like to be a merchant at Rites of Spring', 'vendor', 'rcheck', 'toggleVendor()' ];
	fieldList.medical  = [ 'Are you a trained medical person (Nurse, MD, EMT, etc)', 'medical', 'rcheck', 'toggleMedical()' ];
	fieldList.qualifications = [ 'Qualifications', 'qualifications', 'textarea', '60' ];
	fieldList.housing = [ 'Housing', 'housing', 'radio', 'toggleHousing()' ];
	fieldList.needs = [ 'Special Needs', 'needs', 'textarea', '60' ];


