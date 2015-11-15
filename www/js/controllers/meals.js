var app = angular.module('mealtrack.controllers.meals', []);


/*********************************************************************
 * Global meals array
 *********************************************************************/
 //var gMeals;

/*********************************************************************
 * MealListCtrl
 *********************************************************************/
app.controller('MealListCtrl', function ($scope, $state, $ionicLoading, MealService) {

	$scope.meals = MealService;
  gMeals = MealService;

  console.log("inside MealListCtrl");

	$ionicLoading.show();
	$scope.meals.load().then(function () {
		$ionicLoading.hide();
	});

	$scope.refreshItems = function () {
		$scope.meals.refresh().then(function () {
      console.log("MealListCtrl-refreshItems");
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.nextPage = function () {
		$scope.meals.next().then(function () {
      console.log("MealListCtrl-nextPage");
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

  $scope.editMeal = function(id){
    $state.go("menu.edit", { "mealId": id});
  };

  $scope.addMeal = function(){
    $state.go("menu.track");
  };

  //TODO Refresh meal data after user has logged out.
  // Or Remove the logout process for version 1.0?
  //$scope.label = "No More Results";

});

/*********************************************************************
 * MealCreateCtrl
 *********************************************************************/
app.controller('MealCreateCtrl', function ($scope,
                                           $state,
                                           $ionicPopup,
                                           $ionicLoading,
                                           $cordovaCamera,
                                           MealService) {

	$scope.resetFormData1 = function () {
		$scope.formData = {
			'title': '',
			'category': '',
			'calories': 0,
      'fat': 0,
      'sodium': 0,
      'carbs': 0,
      'sugar': 0,
      'protein': 0,
      'fiber': 0,
      'group' : '',
      'amount': 0,
      'foodGroups': [
        {'desc': "Vegetable", 'value': "veggie", 'unit': "cup"},
        {'desc': "Fruit", 'value': "fruit", 'unit': "cup"},
        {'desc': "Protein", 'value': "protein", 'unit': "ounce"},
        {'desc': "Dairy", 'value': "dairy", 'unit': "cups"},
        {'desc': "Grain", 'value': "grain", 'unit': "ounce"},
        {'desc': "Oil", 'value': "oil", 'unit': "tspn"},
        {'desc': "Other", 'value': "other", 'unit': "cup"}
      ],
      'selectedOption': {'desc': "Vegetable", 'value': "veggie", 'unit': "cup"}
		};

	};
	$scope.resetFormData1();

	$scope.createMeal = function (form) {
		if (form.$valid) {

			$ionicLoading.show();
			MealService.createMeal($scope.formData).then(function () {
        var saveAndAdd = $scope.saveAndAddVar;
				$scope.resetFormData1();
				$ionicLoading.hide();
				form.$setPristine(true);
        if (saveAndAdd){
          $state.go("menu.meals").then(function(){
            $state.go("menu.track");
          });
        }else{
          $state.go("menu.meals");
        }
			});
		}
	};

});

/*********************************************************************
 * MealEditCtrl
 *********************************************************************/
app.controller('MealEditCtrl', function ($scope,
                                         $state,
                                         $ionicPopup,
                                         $ionicLoading,
                                         $cordovaCamera,
                                         MealService) {

  $scope.mealId = $state.params.mealId;
  $scope.meals = MealService;

  $scope.setMeal = function(){
    var meal = MealService.getMeal($state.params.mealId);

    $scope.formData = {
      'title': meal.get("title"),
      'category': meal.get("category"),
      'calories': parseInt(meal.get("calories")),
      'fat': parseInt(meal.get("fat")),
      'sodium': parseInt(meal.get("sodium")),
      'carbs': parseInt(meal.get("carbs")),
      'sugar': parseInt(meal.get("sugar")),
      'protein': parseInt(meal.get("protein")),
      'fiber': parseInt(meal.get("fiber")),
      'group' : meal.get("group"),
      'amount': parseInt(meal.get("amount")),
      'foodGroups': [
        {'desc': "Vegetable", 'value': "veggie", 'unit': "cups"},
        {'desc': "Fruit", 'value': "fruit", 'unit': "cups"},
        {'desc': "Protein", 'value': "protein", 'unit': "ounce"},
        {'desc': "Dairy", 'value': "dairy", 'unit': "cup"},
        {'desc': "Grain", 'value': "grain", 'unit': "ounce"},
        {'desc': "Oil", 'value': "oil", 'unit': "tspn"},
        {'desc': "Other", 'value': "other", 'unit': "cup"}
      ],
      'selectedOption':  {'desc': "Vegetable", 'value': "veggie", 'unit': "cup"}
    };

    //Set selectedOption in Food Groups combobox
    var index = 0;
    switch($scope.formData.group){
      case "veggie": index = 0; break;
      case "fruit": index = 1; break;
      case "protein": index = 2; break;
      case "dairy": index = 3; break;
      case "grain": index = 4; break;
      case "oil":  index = 5; break;
      case "other":   index = 6; break;
      default : index = 0; break;
    };
    $scope.formData.selectedOption = $scope.formData.foodGroups[index];

  };

  //TODO move foundGroups from formData to a global variable for this controller.

  $scope.resetFormData = function () {
    $scope.formData = {
      'title': '',
      'category': '',
      'calories': 0,
      'fat': 0,
      'sodium': 0,
      'carbs': 0,
      'sugar': 0,
      'protein': 0,
      'fiber': 0,
      'group' : '',
      'amount': 0,
      'foodGroups': [
        {'desc': "Vegetable", 'value': "veggie", 'unit': "cup"},
        {'desc': "Fruit", 'value': "fruit", 'unit': "cup"},
        {'desc': "Protein", 'value': "protein", 'unit': "ounce"},
        {'desc': "Dairy", 'value': "dairy", 'unit': "cup"},
        {'desc': "Grain", 'value': "grain", 'unit': "ounce"},
        {'desc': "Oil", 'value': "oil", 'unit': "tspn"},
        {'desc': "Other", 'value': "other", 'unit': "cup"}
      ],
      'selectedOption':  {'desc': "Vegetable", 'value': "veggie", 'unit': "cup"}
    };
  };

  $scope.saveMeal = function (form) {
    $ionicLoading.show();
    MealService.update($scope.formData, $scope.mealId).then(function () {

      $scope.meals.refresh().then(function(){
        $scope.resetFormData();
        $ionicLoading.hide();
        form.$setPristine(true);
        $state.go("menu.meals");
      });
    });
  };

  $scope.deleteMeal = function (mealId){
    $ionicLoading.show();

    MealService.destroyMeal($scope.mealId).then(function () {
      $ionicLoading.hide();

      $scope.meals.refresh().then(function(){
        $scope.resetFormData();
        $ionicLoading.hide();
        $state.go("menu.meals");
      });
    });

  };

  $scope.setMeal();

});
