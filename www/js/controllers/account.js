var app = angular.module('mealtrack.controllers.account', []);

/*********************************************************************
 * AccountCtrl
 *********************************************************************/
app.controller('AccountCtrl', function ($scope, $state, $ionicPopup, AuthService) {

  $scope.accountData = AuthService;

	$scope.editAccountFormData = {
		name: AuthService.user.attributes.name,
		email: AuthService.user.attributes.email,
    gender: AuthService.user.attributes.gender,
    age: AuthService.user.attributes.age
	};

	$scope.submit = function (form) {
		if (form.$valid) {
			console.log("AccountCtrl::submit");
			AuthService.update($scope.editAccountFormData).then(function () {
				//$state.go("menu.meals");

        //var alertPopup = $ionicPopup.alert({
        //  title: 'Account updated!'
        //});
        //alertPopup.then(function(res) {
        //  console.log('User data updated.');
        //});

        $state.go("menu.account");
			});
		}
	};

  $scope.editAccount = function () {
    console.log("state.go(menu.editaccount)");
    $state.go("menu.editaccount");
  };

  //Disabled logout functionality for now, TODO re-enable version 2
	//$scope.logout = function () {
	//	console.log("AccountCtrl::logout");
	//	Parse.User.logOut();
	//	$state.go("login");
	//};

});
