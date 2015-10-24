
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

  //$scope.slides = [];
  //for (var i = 1; i <= 5; i++){
  //  $scope.slides.push({
  //    title: 'Slide #' + i,
  //    description: 'This is the slide number ' + i
  //  });
  //}
  //
  //$scope.activeSlide = 0;
  //
  //$scope.setSlide = function(index){
  //  $scope.activeSlide = index;
  //};

});

