var app = angular.module('mealtrack.controllers.authentication', []);

/*********************************************************************
 * LoginCtrl
 *********************************************************************/
app.controller('LoginCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		"email": "",
		"password": ""
	};

	$scope.login = function (form) {

		if (form.$valid) {
			console.log("LoginCtrl::login");
			AuthService.login($scope.formData.email, $scope.formData.password)
				.then(function () {
					$state.go("menu.meals")
				});
		}

	};

});

/*********************************************************************
 * SignupCtrl
 *********************************************************************/
app.controller('SignupCtrl', function ($scope, $state, AuthService) {

	$scope.formData = {
		"name": "",
		"email": "",
		"password": ""
	};

	$scope.signup = function (form) {
		if (form.$valid) {
			console.log("SignupCtrl::signup");
			AuthService.signup($scope.formData.email,
                         $scope.formData.name,
                         $scope.formData.password)
				.then(function () {
          //TODO call another function to add defaults based off of the users gender and age
          //  Don't let the user sign up unless they provide that data.
					$state.go("menu.meals")
				});
		}
	};

});
