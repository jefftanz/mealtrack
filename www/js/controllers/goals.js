var app = angular.module('mealtrack.controllers.goals', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('GoalsCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, GoalsService) {

  $scope.goalData = GoalsService;

  console.log("inside GoalsCtrl");
  $ionicLoading.show();
  console.log("After show");

  $scope.loadData = function(){
    $scope.goalData.getUserGoals().then(function () {
      console.log("GoalsCtrl-after goalData.getUserGoals promise");

      $scope.resetDailyData();
      $scope.id = $scope.goalData.item.id;

      $ionicLoading.hide();
      console.log("After hide");
    });
  };

  $scope.resetDailyData = function(){
    console.log("reset daily data calories: "+$scope.goalData.item.calories);

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

  }

  $scope.editGoals = function(){
    console.log("going to edit goals page");
    $state.go("menu.editgoals");
  };

  $scope.saveDailyGoals = function(form){
    console.log("GoalsCtrl::saveDailyGoals");
    console.log("DailyGoals.id : "+$scope.id);

    $ionicLoading.show();
    console.log("After show");

    GoalsService.updateUserGoals($scope.daily, $scope.id).then(function () {
      //$scope.resetDailyData();
      $scope.loadData();
      form.$setPristine(true);

      $ionicLoading.hide();
      console.log("After hide");

      //var alertPopup = $ionicPopup.alert({
      //  title: 'Goals updated!'
      //});
      //alertPopup.then(function(res) {
      //  console.log('User goals updated.');
      //});

      //console.log("After daily goals updated. go to menu.goals state");

      $state.go("menu.goals");
    }).catch(function(reason){
      console.log("updateUserGoals Handle rejected promise("+reason+") here.");
      $ionicLoading.hide();
      console.log("After hide catch");
    });
  };

  $scope.resetGoals = function(){
    $ionicLoading.show();
    console.log("After show");

    GoalsService.resetUserGoals().then(function(){
      console.log("after resetUserGoals");
      $scope.resetDailyData();

      //var alertPopup = $ionicPopup.alert({
      //  title: 'Goals updated!'
      //});
      //alertPopup.then(function(res) {
      //  console.log('User goals updated.');
      //});

      $ionicLoading.hide();
      console.log("After hide");
      $state.go("menu.goals")
    }).catch(function(reason){
      console.log("resetUserGoals Handle rejected promise("+reason+") here.");
      $ionicLoading.hide();
      console.log("After hide catch");
    });
  };

  //Initial Load
  $scope.loadData();

});



