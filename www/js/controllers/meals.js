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
  console.log("state param goToEdit: "+$state.params.gotoEdit);
  console.log("state param lastMealIdAdded: "+$state.params.lastMealIdAdded);

	$ionicLoading.show();
	$scope.meals.load().then(function () {
    console.log("MealListCtrl-after meals.load promise");
		$ionicLoading.hide();
	});

  $scope.$on("callEditFromAdd", function(event, args){
    console.log("callEditFromAdd event : "+args.mealId);
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
    //$state.go("menu.edit");
  };

  $scope.addMeal = function(){
    console.log("MealListCtrl-addMeal");
    $state.go("menu.track");
  };

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
			'picture': null
		};

    $scope.saveAndAddVar = false;
	};
	$scope.resetFormData();

	$scope.trackMeal = function (form) {
		if (form.$valid) {
			console.log("MealCreateCtrl::trackMeal");

			$ionicLoading.show();
			MealService.track($scope.formData).then(function () {
        var saveAndAdd = $scope.saveAndAddVar;
				$scope.resetFormData();
				$ionicLoading.hide();
				form.$setPristine(true);
        //console.log("lastMealIdAdded "+MealService.lastMealIdAdded);
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

  //$scope.trackMealAndAdd = function (form) {
  //  if (form.$valid) {
  //    console.log("MealCreateCtrl::trackAndAdd");
  //
  //    $ionicLoading.show();
  //    MealService.track($scope.formData).then(function () {
  //      $scope.resetFormData();
  //      $ionicLoading.hide();
  //      form.$setPristine(true);
  //      //console.log("lastMealIdAdded "+MealService.lastMealIdAdded);
  //      $state.go("menu.meals").then(function(){
  //        $state.go("menu.track");
  //      });
  //    });
  //  }
  //};

	$scope.addPicture = function () {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 480,
			popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false
		};

		$cordovaCamera.getPicture(options).then(function (imageData) {
			$scope.formData.picture = imageData;
		}, function (err) {
			console.error(err);
			$ionicPopup.alert({
				title:'Error getting picture',
				subTitle: 'We had a problem trying to get that picture, please try again'
			});
		});
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
      'picture': null
    };
  };

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
      'picture': null
    };
  };

  $scope.addPicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // CAMERA
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 480,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.formData.picture = imageData;
    }, function (err) {
      console.error(err);
      $ionicPopup.alert({
        title:'Error getting picture',
        subTitle: 'We had a problem trying to get that picture, please try again'
      });
    });
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

  $scope.setMeal();
  console.log("selectedMeal : "+ MealService.selectedMeal);

});
