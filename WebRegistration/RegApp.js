(function(angular) {
    'use strict';

    var myApp = angular.module('RegApp',[]);

    myApp.component('greetUser', 
		{
		    template: 'Hello, {{$ctrl.user}}!',
		    controller: function GreetUserController() 
		    {
		        this.user = 'world';
		    }
		}
		);

    myApp.component('rowTest',
        {
            template: '<tr><td>Hello</td><td>New Row Test</td></tr>'
        }
        );

    /*
    Pre Bootstap fields
    myApp.component('textField',
        {
            template: '<div class="row" id="{{$ctrl.name}}"> <span class="label">{{$ctrl.label}}</span> <span class="formw"> <input name="{{$ctrl.name}}" maxlength="60" size="60" type="text" required> </span>{{parent.$ctrl.name}} </div>',
            bindings: { label: '@', name: '@' },
        }
        );
    myApp.directive('optionField', function () {
        return {
            scope: {},
            bindToController: {
                label: '=',
                name: '&',
                values: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="row"> <span class="label">{{ctrl.label}}</span> <span class="formw"> <select name="ctrl.name"><option selected="selected">select ...</option><option ng-repeat="data in ctrl.values" value="{{data.Value}}">{{data.Label}}</option></select></span></div>'
        }
    });
    myApp.directive('checkBox', function() {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                model: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="row" id="ctrl.name"><label><input ng-model="ctrl.model" name="ctrl.name" value="on" type="checkbox">&nbsp;{{ctrl.label}}</label></div>'
        }
    });
    myApp.directive('radioOptions', function () {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                values: '=',
                model: '=',
                change: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="row"><span class="label">{{ctrl.label}}</span><span class="formw"><label ng-repeat="ho in ctrl.values" ><input value="{{ho.Value}}" name="{{ctrl.name}}" type="radio" ng-change="ctrl.change" ng-model="ctrl.model">{{ho.Label}}&nbsp;&nbsp;</label></span></div>',
        }
    });

    */

    myApp.component('formMsg',
        {
            template: '<label class="col-sm-2"></label> <div class="col-sm-10" style="background:#d8d8d8;font-style:italic">{{$ctrl.msg}}</div><br />',
            bindings: { msg: '@' },
        }
        );

    myApp.component('textField',
        {
            template: '<div class="form-group" id="{{$ctrl.name}}"><label class="col-sm-2 control-label">{{$ctrl.label}}</label><div class="col-sm-10"><input class="form-control" name="{{$ctrl.name}}" maxlength="60" size="60" type="text" ng-model="$ctrl.model" ng-required="$ctrl.label.indexOf(\'*\')>0" >{{parent.$ctrl.name}}</div></div>',
            bindings: { label: '@', name: '@', model: '=' },
        }
        );

    myApp.component('vtextField',
        {
            template: '<label>{{$ctrl.label}}</label><div class="form-group" id="{{$ctrl.name}}"><label class="col-sm-2 control-label"></label><div class="col-sm-10"><input class="form-control" name="{{$ctrl.name}}" maxlength="60" size="60" type="text" required>{{parent.$ctrl.name}}</div></div>',
            bindings: { label: '@', name: '@' },
        }
        );

    myApp.component('rule',
        {
            template: '<div class="row"><hr /></div>'
        }
        );


    myApp.directive('checkBox', function () {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                model: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="form-group" id="ctrl.name"><div class="col-sm-10 checkbox"><label><input ng-model="ctrl.model" name="ctrl.name" value="on" type="checkbox" ng-required="$ctrl.label.indexOf(\'*\')>0" >&nbsp;{{ctrl.label}}</label></div></div>'
        }
    });

    myApp.directive('checkBoxField', function () {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                model: '=',
                prompt: '@'
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="form-group"><label class="col-sm-2 control-label">{{ctrl.label}}</label><div class="col-sm-10 checkbox"><label><input ng-model="ctrl.model" name="ctrl.name" value="on" type="checkbox" ng-required="$ctrl.label.indexOf(\'*\')>0" >&nbsp;{{ctrl.prompt}}</label></div></div>'
        }
    });

    myApp.directive('optionField', function () {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                values: '=',
                model: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="form-group"><label class="col-sm-2 control-label">{{ctrl.label}}</label><div class="col-sm-10"><select class="form-control" name="ctrl.name" ng-model="ctrl.model" ng-required="ctrl.label.indexOf(\'*\')>0" ><option selected="selected" value="">select ...</option><option ng-repeat="data in ctrl.values" value="{{data.Value}}">{{data.Label}}</option></select></div></div>'
        }
    });

    myApp.directive('radioOptions', function () {
        return {
            scope: {},
            bindToController: {
                label: '@',
                name: '&',
                values: '=',
                model: '=',
                change: '='
            },
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<div class="form-group"><label class="col-sm-2 control-label">{{ctrl.label}}</label><div class="col-sm-10"><div class="radio"><label ng-repeat="ho in ctrl.values" ><input value="{{ho.Value}}" name="{{ctrl.name}}" type="radio" ng-change="ctrl.change" ng-model="ctrl.model">{{ho.Label}}&nbsp;&nbsp;</label></div></div></div>',
        }
    });

    myApp.directive('testBlock', function () {
        return {
            scope: {},
            controller: function () { },
            controllerAs: 'ctrl',
            template: '<input type="text" name="testBlock" value="something" ng-model="formData.testBlock">[testBlock={{formData.testBlock}}]',
        }
    });

    myApp.component('testField',
        {
            template: '<input type="text" name="testField" value="something" ng-model="formData.testField">[testField={{formData.testField}}]',
        }
        );

    myApp.component('vendorInfo',
        {
            templateUrl: 'VendorInfo.html'
        }
        );



    myApp.controller('RegController', function ()
    {

		this.formData = {};
		this.formData.children = [];
		this.formData.children[0] = {};

		this.formData.clanSelection = [];

		this.formData.regOption=3; 
		this.formData.mealPlan = 1;
		this.formData.housing = 'cabin';

		this.pl = pl;

	    // Ages for dropdown
		this.ageData = [];
		for (var $i = 0; $i < 18; ++$i)
		{
		    this.ageData[$i] = ($i+1).toString();
		}

        // clan/grove data for repeat
		this.clanData = [];
		for (var $i = 0; $i < pl.clanSelectionCnt; ++$i)
		{
		    this.clanData[$i] = $i;
		}

		this.ShowTotal = function ShowTotal() { return this.messageBlock + " RegOption=" + this.formData.regOption; }

		this.SubmitForm = function SubmitForm(formData)
		{
		    alert("Trying to Submit");
		    console.log("Submit Form");
		    return false;
		}

		this.ReCalc = function ReCalc() 
		{
			console.log("ReCalc Price");
			this.formData.calculatedAmount = this.CalcAmountDue();
		}

		this.ResetPage = function() 
		{
    		this.formData = {};
    		this.formData.children = [];
    		this.formData.children[0] = {};
    		this.formData.clanSelection = [];

    		this.formData.regOption=3; 
    		this.formData.mealPlan = 1;
    		this.formData.housing = 'cabin';
		}

		this.LoadSampleData = function () {
		    // Sample Data
		    this.formData.firstName = "Stephen";
		    this.formData.lastName = "Morley";
		    this.formData.akaName = "Stephen";
		    this.formData.address = "60 Portland Ave";
		    this.formData.city = "Redding";
		    this.formData.state = "CT";
		    this.formData.country = "USA";
		    this.formData.zipcode = "06896";
		    this.formData.email = "stephen@morley.co";
		    this.formData.bestPhone = "203.733.2578";
		}



		this.ChgRegOption = function ChgRegOption()
		{
			console.log("ChgRegOption");
			this.messageBlock = "Change RegOption " + this.formData.regOption;
			this.mealPlanOptions = this.FindMealPlan(this.formData.regOption).Options;
			this.formData.mealPlan = this.CheckMealPlanOption(this.mealPlanOptions, this.formData.mealPlan);
			this.formData.calculatedAmount = this.CalcAmountDue();
		}

		this.AddChild = function AddChild()
		{
		    this.formData.children.push({});
		}

		this.RemoveChild = function RemoveChild(child)
		{
		    this.formData.children.splice(this.formData.children.indexOf(child), 1);
		}


		$scope.processForm = function () {
		    $http({
		        method: 'POST',
		        url: 'process.php',
		        data: $.param($scope.formData),  // pass in data as strings
		        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
		    })
            .success(function (data) {
                console.log(data);

                if (!data.success) {
                    // if not successful, bind errors to error variables
                    $scope.errorName = data.errors.name;
                    $scope.errorSuperhero = data.errors.superheroAlias;
                } else {
                    // if successful, bind success message to message
                    $scope.message = data.message;
                }
            });
		};


		this.CheckMealPlanOption = function (options, mealPlanCode)
		{
			for (var i=0, len = options.length; i < len; i++)
			{
				if ( options[i].Value == mealPlanCode )
				{
					return mealPlanCode;
				}
			}
			console.log("Meal Plan Code " + mealPlanCode + " is not valid, changed to " + options[0].Value);
			return options[0].Value;
		}

		this.CalcAmountDue = function()
		{
			console.log("CalcAmountDue");
			var cost = 0;

			// Scan the base prices for the selected reg option
			cost = this.FindRegOptionCost(this.formData.regOption, 99).Price;
			console.log("RegOption{" + this.formData.regOption + "} Cost is " + cost);
			var mpCost =  this.FindMealPlanCost(this.formData.regOption, this.formData.mealPlan, 99).Price;
			console.log("MealPlan{" + this.formData.mealPlan + "} Cost is " + mpCost);
			cost += mpCost;

		    // Find the housing cost
			for (var i = 0, len = this.pl.housingOptions.length; i < len; ++i)
			{
			    if ( this.pl.housingOptions[i].Value == this.formData.housing )
			    {
			        cost += this.pl.housingOptions[i].Cost;
			    }
			}

			this.messageBlock = "Housing=" + this.formData.housing;

			return cost;
		}

		this.FindRegOptionCost = function (regOption, age)
		{
		    for (var i = 0, len = pl.RegOptions.length; i < len; i++)
		    {
		        if (pl.RegOptions[i].Value == regOption)
		        {
		            for (var j = 0, jLen = pl.RegOptions[i].Cost.length; j < jLen; j++)
		            {
		                if (pl.RegOptions[i].Cost[j].Age >= age)
		                {
		                    return pl.RegOptions[i].Cost[j];
		                }
		            }
		        }
		    }
		}

		this.FindMealPlanCost = function(regOption, mealOption, age)
		{
			var mp = this.FindMealPlan(regOption);
			console.log("Find Meal Plan Cost in RegOption:" + regOption + " mealOption:" + mealOption + " age:" + age + " Tag=" + mp.Tag);
			for (var i=0, len = mp.Options.length; i < len; i++)
			{
				console.log("Checking Meal Plan Option " + mp.Options[i].Label);
				if ( mp.Options[i].Value == mealOption )
				{
					for (var j=0, jLen = mp.Options[i].Cost.length; j < jLen; j++)
					{
						if ( mp.Options[i].Cost[j].Age >= age )
						{
							console.log("Found Meal Plan Cost Age=" + mp.Options[i].Cost[j].Age + " and Price=" + mp.Options[i].Cost[j].Price); 
							return mp.Options[i].Cost[j];
						}
					}
				}
			}
			console.log("** ERROR ** Could not find meal plan cost");
			return { Price: 0 };
		}


		this.FindMealPlan = function(regOption)
		{
			for (var i = 0, len = pl.mealPlans.length; i < len; i++)
			{
				if ( pl.mealPlans[i].RegOption == regOption )
				{
					console.log("Found Meal Plan Options Tag=" + pl.mealPlans[i].Tag);
					return pl.mealPlans[i];
				}
			}
			console.log("** ERROR ** No Meal Plan Options Found");
		}

		this.CheckClans = function()
		{
		    this.clanSelectionMsg = '';
		    var len = this.formData.clanSelection.length;

		    if (len < this.pl.clanSelectionCnt)
		    {
		        this.clanSelectionMsg = "Please select " + this.pl.clanSelectionCnt + " " + this.pl.clanSelectionName + 's';
		        return;
		    }


		    for( var i=0; i<len-1; ++i)
		    {
		        var valueI = this.formData.clanSelection[i];
		        if (valueI === '')
		        {
		            this.clanSelectionMsg = "Please select " + this.pl.clanSelectionCnt + " " + this.pl.clanSelectionName + 's';
		        }
                else for (var j = i + 1; j < len; ++j)
		        {
		            if (this.formData.clanSelection[j] === valueI)
		            {
		                this.formData.clanSelection[j] = '';
		                this.clanSelectionMsg = 'All clans must be unique';
		            }
		        }
		    }
		}




		this.ChgRegOption();
		//this.ResetPage();
		this.LoadSampleData();





	});


})(window.angular);
