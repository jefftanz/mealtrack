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

    $scope.formData = {
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

    $ionicLoading.hide();
  });

  $scope.saveDailyGoals = function(form){
    console.log("MealEditCtrl::saveMeal");
    $ionicLoading.show();
    ''
    GoalsService.updateUserGoals($scope.formData, $scope.id).then(function () {
      //TODO send a ionic popup message to user saying daily goals have been saved?
      //  Do I display the weekly goals after saving daily or stay on same page?
    });
  };

});



