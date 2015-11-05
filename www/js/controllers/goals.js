var app = angular.module('mealtrack.controllers.goals', []);

/*********************************************************************
 * StatsCtrl
 *********************************************************************/
app.controller('GoalsCtrl', function ($scope, $state, $ionicLoading, GoalsService) {

  $scope.goalData = GoalsService;

  console.log("inside GoalsCtrl");

  $ionicLoading.show();
  $scope.goalData.getUserGoals().then(function () {
    console.log("GoalsCtrl-after goalData.getUserGoals promise");

    $scope.daily = {
      calories: $scope.goalData.calories,
      carbs: $scope.goalData.carbs,
      fat: $scope.goalData.fat,
      fiber: $scope.goalData.fiber,
      protein: $scope.goalData.protein,
      sodium: $scope.goalData.sodium,
      sugar: $scope.goalData.sugar,
      vegetable: $scope.goalData.vegetable,
      fruit: $scope.goalData.fruit,
      proteinG: $scope.goalData.proteinG,
      dairy: $scope.goalData.dairy,
      grain: $scope.goalData.grain,
      oil: $scope.goalData.oil
    };

    $scope.weekly = {
      calories: ($scope.goalData.calories * 7),
      carbs: ($scope.goalData.carbs * 7),
      fat: ($scope.goalData.fat * 7),
      fiber: ($scope.goalData.fiber * 7),
      protein: ($scope.goalData.protein * 7),
      sodium: ($scope.goalData.sodium * 7),
      sugar: ($scope.goalData.sugar * 7),
      vegetable: ($scope.goalData.vegetable * 7),
      fruit: ($scope.goalData.fruit * 7),
      proteinG: ($scope.goalData.proteinG * 7),
      dairy: ($scope.goalData.dairy * 7),
      grain: ($scope.goalData.grain * 7),
      oil: ($scope.goalData.oil * 7)
    };

    $scope.id = $scope.goalData.id;

    $ionicLoading.hide();
  });

  $scope.saveDailyGoals = function(form){
    console.log("MealEditCtrl::saveMeal");
    $ionicLoading.show();

    GoalsService.updateUserGoals($scope.daily, $scope.id).then(function () {
      //TODO send a ionic popup message to user saying daily goals have been saved?
      //  Do I display the weekly goals after saving daily or stay on same page?
      $ionicLoading.hide();
      $state.go("menu.goals.daily");
    });
  };

});



