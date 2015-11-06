var app = angular.module('mealtrack.controllers.goals', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('GoalsCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, GoalsService) {

  $scope.goalData = GoalsService;

  console.log("inside GoalsCtrl");

  $ionicLoading.show();

  $scope.loadData = function(){
    $scope.goalData.getUserGoals().then(function () {
      console.log("GoalsCtrl-after goalData.getUserGoals promise");

      $scope.daily = {
        calories: $scope.goalData.item.calories,
        carbs: $scope.goalData.item.carbs,
        fat: $scope.goalData.item.fat,
        fiber: $scope.goalData.item.fiber,
        protein: $scope.goalData.item.protein,
        sodium: $scope.goalData.item.sodium,
        sugar: $scope.goalData.item.sugar,
        vegetable: $scope.goalData.item.vegetable,
        fruit: $scope.goalData.item.fruit,
        proteinG: $scope.goalData.item.proteinG,
        dairy: $scope.goalData.item.dairy,
        grain: $scope.goalData.item.grain,
        oil: $scope.goalData.item.oil
      };

      $scope.id = $scope.goalData.item.id;

      $ionicLoading.hide();
    });
  };

  $scope.editGoals = function(){
    console.log("going to edit goals page");
    //$state.go("menu.dailygoal"); // WORKS kinda. Displayed it off menu without back button

    $state.go("menu.editgoals");
  };

  $scope.saveDailyGoals = function(form){
    console.log("GoalsCtrl::saveDailyGoals");
    console.log("DailyGoals.id : "+$scope.id);
    $ionicLoading.show();

    GoalsService.updateUserGoals($scope.daily, $scope.id).then(function () {

      //console.log("after saveDailyGoals veg : "+$scope.daily.vegetable);

      var alertPopup = $ionicPopup.alert({
        title: 'Goals updated!'
      });
      alertPopup.then(function(res) {
        console.log('User goals updated.');
      });

      //TODO send a ionic popup message to user saying daily goals have been saved?
      //  Do I display the weekly goals after saving daily or stay on same page
      console.log("After daily goals updated. go to menu.goals state");

      //This should Reload the data?
      //$scope.loadData();

      $ionicLoading.hide();
      //$state.go("menu.goals");
    });
  };

  //Initial Load
  $scope.loadData();

});



