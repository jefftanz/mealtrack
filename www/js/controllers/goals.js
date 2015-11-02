var app = angular.module('mealtrack.controllers.goals', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('GoalsCtrl', function ($scope, $state, $ionicLoading, GoalsService) {

  $scope.goalData = GoalsService;

  console.log("inside GoalsCtrl");

  $ionicLoading.show();
  $scope.statData.getTodaysItems().then(function () {
    console.log("StatsCtrl-after statData.load promise");
    $ionicLoading.hide();
  });

});



