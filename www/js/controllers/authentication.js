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
          localStorage.setItem('firstVisit', '1');
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
		"password": "",
    "age": "",
    "gender": ""
	};

	$scope.signup = function (form) {
		if (form.$valid) {
			console.log("SignupCtrl::signup");
			AuthService.signup($scope.formData.email,
                         $scope.formData.name,
                         $scope.formData.password,
                         $scope.formData.age,
                         $scope.formData.gender)
				.then(function () {
          localStorage.setItem('firstVisit', '1');
          //  Set default values after user creation.
          AuthService.setGoalDefaults()
            .then(function () {
              $state.go("menu.meals")
            });
				});
		}
	};

});
