var app = angular.module('mealtrack.controllers.meals', []);


/*********************************************************************
 * Global meals array
 *********************************************************************/
 var gMeals;

/*********************************************************************
 * MealListCtrl
 *********************************************************************/
app.controller('MealListCtrl', function ($scope, $state, $ionicLoading, MealService) {

	$scope.meals = MealService;
  gMeals = MealService;

  console.log("inside MealListCtrl");

	$ionicLoading.show();
	$scope.meals.load().then(function () {
    console.log("MealListCtrl-after meals.load promise");
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
    console.log("mealId : "+id);
    console.log("MealListCtrl-editMeal");
    $state.go("menu.edit", { "mealId": id});
  };

  $scope.addMeal = function(){
    console.log("MealListCtrl-addMeal");
    $state.go("menu.track");
  };

  //TODO Refresh meal data after user has logged out.
  // Or Remove the logout process for version 1.0?
  $scope.label = "No More Results";

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

  $scope.saveAndAdd = function(){
    $scope.saveAndAddVar = true;
    console.log("inside saveAndAdd");
  }

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

    $scope.saveAndAddVar = false;
	};
	$scope.resetFormData1();

	$scope.trackMeal = function (form) {
		if (form.$valid) {
			console.log("MealCreateCtrl::trackMeal");

			$ionicLoading.show();
			MealService.track($scope.formData).then(function () {
        var saveAndAdd = $scope.saveAndAddVar;
				$scope.resetFormData1();
				$ionicLoading.hide();
				form.$setPristine(true);
        console.log("saveAndAdd:"+saveAndAdd);
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

  console.log("state param mealId : "+ $scope.mealId);
  console.log("length of meals array : "+ MealService.results.length);

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

    console.log("before group : "+$scope.formData.group);
    console.log("before selectedOption.value : "+$scope.formData.selectedOption.value);

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

    console.log("after group : "+$scope.formData.group);
    console.log("after selectedOption.value : "+$scope.formData.selectedOption.value);
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
    console.log("MealEditCtrl::saveMeal");
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
    console.log("deleteMeal mealId: "+mealId);
    $ionicLoading.show();

    MealService.destroyMeal($scope.mealId).then(function () {
      console.log("destroy after .then");
      $ionicLoading.hide();

      $scope.meals.refresh().then(function(){
        console.log("after destroy.then");
        $scope.resetFormData();
        $ionicLoading.hide();
        //form.$setPristine(true);
        $state.go("menu.meals");
      });
    });

    //MealService.destroyMeal($scope.mealId);
  };

  $scope.setMeal();
  console.log("selectedMeal : "+ MealService.selectedMeal);

});
