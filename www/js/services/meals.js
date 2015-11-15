var app = angular.module('mealtrack.services.meals', [
  "mealtrack.myUtil.basic"
]);

app.service("MealService", function ($q, $ionicPopup, AuthService) {
	var self = {
		'page': 0,
		'page_size': 20,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
    'selectedMeal': null,
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var d = $q.defer();

			// Initialise Query
			var Meal = Parse.Object.extend("Meal");
			var mealQuery = new Parse.Query(Meal);
			mealQuery.descending('created');
			mealQuery.equalTo("owner", AuthService.user);

			// Paginate
			mealQuery.skip(self.page * self.page_size);
			mealQuery.limit(self.page_size);

			// Perform the query
			mealQuery.find({
				success: function (results) {
					angular.forEach(results, function (item) {
            //TODO Figure out why turning it into a Meal gets rid of the .id accessibility
						//var meal = new Meal(item);
						//self.results.push(meal);

            self.results.push(item);

					});
					//console.debug(self.results);
					//Displays objects in console to easily read

					// Are we at the end of the list?
					if (results.length == 0) {
						self.hasMore = false;
					}

					// Finished
					d.resolve();
				}
			});

			return d.promise;
		},
		'createMeal': function (data) {
			self.isSaving = true;
			var d = $q.defer();
      var iconName;
			var Meal = Parse.Object.extend("Meal");
			var user = AuthService.user;
			var meal = new Meal();

			meal.set("owner", user);
			meal.set("title", data.title);
			meal.set("calories", parseMyInt(data.calories));
      meal.set("fat", parseMyInt(data.fat));
      meal.set("sodium", parseMyInt(data.sodium));
      meal.set("sugar", parseMyInt(data.sugar));
      meal.set("protein", parseMyInt(data.protein));
      meal.set("carbs", parseMyInt(data.carbs));
      meal.set("fiber", parseMyInt(data.fiber));
      meal.set("group",  data.selectedOption.value);
      meal.set("amount", parseMyInt(data.amount));
			meal.set("created", new Date());

      switch(data.selectedOption.value){
        case "fruit": iconName = 'img/food/fruit-icon.png';break;
        case "veggie": iconName = 'img/food/veggie-icon.png';break;
        case "grain": iconName = 'img/food/grain-icon.png';break;
        case "protein": iconName = 'img/food/meat-icon.png';break;
        case "oil": iconName = 'img/food/oil-icon.png';break;
        case "dairy": iconName = 'img/food/dairy-icon.png';break;
        case "other": iconName = 'img/food/question-icon.png';break;
        default: iconName = 'img/food/question-icon.png';break;
      }

      meal.set("iconName", iconName);

			meal.save(null, {
				success: function (meal) {
					self.results.unshift(meal);
					d.resolve(meal);
				},
				error: function (item, error) {
					$ionicPopup.alert({
						title: "Error saving meal",
						subTitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		},
    'getMeal': function (mealId) {
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == mealId){
          self.selectedMeal = this.results[i];
          return this.results[i];
        }
      }
      console.log("Meal Not found");
      return undefined;
    },
    'getMealIndex': function (mealId) {
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == mealId){
          return i;
        }
      }
      return undefined;
    },
    'update': function (formData, mealId) {
      self.isSaving = true;
      var d = $q.defer();
      var iconName;
      var Meal = Parse.Object.extend("Meal");
      var user = AuthService.user;
      var item = this.getMeal(mealId);
      var meal = new Meal(item);

      meal.set("owner", user);
      meal.set("id", mealId);
      meal.set("title", formData.title);
      meal.set("calories", parseMyInt(formData.calories));
      meal.set("fat", parseMyInt(formData.fat));
      meal.set("sodium", parseMyInt(formData.sodium));
      meal.set("sugar", parseMyInt(formData.sugar));
      meal.set("protein", parseMyInt(formData.protein));
      meal.set("carbs", parseMyInt(formData.carbs));
      meal.set("fiber", parseMyInt(formData.fiber));
      meal.set("group", formData.selectedOption.value);
      meal.set("amount", parseMyInt(formData.amount));

      switch(formData.selectedOption.value){
        case "fruit": iconName = 'img/food/fruit-icon.png';break;
        case "veggie": iconName = 'img/food/veggie-icon.png';break;
        case "grain": iconName = 'img/food/grain-icon.png';break;
        case "protein": iconName = 'img/food/meat-icon.png';break;
        case "oil": iconName = 'img/food/oil-icon.png';break;
        case "dairy": iconName = 'img/food/dairy-icon.png';break;
        case "other": iconName = 'img/food/question-icon.png';break;
        default : iconName = 'img/food/veggie-icon.png';break;
      }

      meal.set("iconName", iconName);

      meal.save(null, {
        success: function (meal) {
          self.results.unshift(meal);
          d.resolve(meal);
        },
        error: function (item, error) {
          $ionicPopup.alert({
            title: "Error saving meal",
            subTitle: error.message
          });
          d.reject(error);
        }
      });

      return d.promise;
    },
    'destroyMeal': function (mealId) {
      self.isSaving = true;
      var d = $q.defer();
      var index = this.getMealIndex(mealId);

      self.results[index].destroy().then(function(){
        d.resolve();
      });

      return d.promise;
    }

	};

	return self;
});
