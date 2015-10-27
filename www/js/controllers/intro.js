
var app = angular.module('mealtrack.controllers.intro', []);

app.controller('IntroCtrl', function($scope, $state) {

  $scope.login = function () {
    console.log("IntroCtrl::login");
    $state.go("login");
  };

  $scope.signup = function () {
    console.log("IntroCtrl::signup");
    $state.go("signup");
  };

});

