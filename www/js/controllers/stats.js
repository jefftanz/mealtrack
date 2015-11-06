var app = angular.module('mealtrack.controllers.stats', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('StatsCtrl', function ($scope, $state, $ionicLoading, StatsService) {

  $scope.statData = StatsService;

  console.log("inside StatsCtrl");

  $ionicLoading.show();
  $scope.statData.getTodaysTotals().then(function () {
    console.log("StatsCtrl-after getTodaysTotals promise");
    $scope.statData.getDailyGoals().then(function () {
      console.log("StatsCtrl-after getDailyGoals promise");
      $scope.statData.setPercentages().then(function() {
        console.log("StatsCtrl-after setPercentages promise");
        $ionicLoading.hide();
      });
    });
  });
});



