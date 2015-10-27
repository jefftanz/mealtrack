var app = angular.module('mealtrack.controllers.stats', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('StatsCtrl', function ($scope, $state, $ionicLoading, StatsService) {

  $scope.statData = StatsService;

  console.log("inside StatsCtrl");

  $ionicLoading.show();
  $scope.statData.getTodaysItems().then(function () {
    console.log("StatsCtrl-after statData.load promise");
    $ionicLoading.hide();
  });

});



