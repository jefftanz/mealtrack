var app = angular.module('mealtrack.controllers.account', []);

/*********************************************************************
 * AccountCtrl
 *********************************************************************/
app.controller('AccountCtrl', function ($scope, $state, $ionicPopup, AuthService) {

	$scope.formData = {
		name: AuthService.user.attributes.name,
		email: AuthService.user.attributes.email,
    gender: AuthService.user.attributes.gender,
    age: AuthService.user.attributes.age
	};

	$scope.submit = function (form) {
		if (form.$valid) {
			console.log("AccountCtrl::submit");
			AuthService.update($scope.formData).then(function () {
				//$state.go("menu.meals");

        var alertPopup = $ionicPopup.alert({
          title: 'Account uddated!'
        });
        alertPopup.then(function(res) {
          console.log('User data updated.');
        });

			});
		}
	};

	$scope.logout = function () {
		console.log("AccountCtrl::logout");
		Parse.User.logOut();
		$state.go("login");
	};
});
