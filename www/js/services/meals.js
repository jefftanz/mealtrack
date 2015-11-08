var app = angular.module('mealtrack.services.meals', []);

app.service("MealService", function ($q, $ionicPopup, AuthService) {
	var self = {
		'page': 0,
		'page_size': 20,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
    'selectedMeal': null,
    'lastMealIdAdded': '',
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

      console.log("loading meal service data");

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

            console.log("item group:"+item.get("group"));

            self.results.push(item);

					});
					console.debug(self.results);

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
		'track': function (data) {
			self.isSaving = true;
			var d = $q.defer();
      var iconName;
			var Meal = Parse.Object.extend("Meal");
			var user = AuthService.user;
			var meal = new Meal();

			meal.set("owner", user);
			meal.set("title", data.title);
			meal.set("calories", parseInt(data.calories));
      meal.set("fat", parseInt(data.fat));
      meal.set("sodium", parseInt(data.sodium));
      meal.set("sugar", parseInt(data.sugar));
      meal.set("protein", parseInt(data.protein));
      meal.set("carbs", parseInt(data.carbs));
      meal.set("fiber", parseInt(data.fiber));
      console.log("formData.selectedOption.value : "+ data.selectedOption.value);
      meal.set("group",  data.selectedOption.value);
      console.log("formData.amount : "+ data.amount);
      meal.set("amount", parseInt(data.amount));
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
					console.log("Meal tracked");
					self.results.unshift(meal);
          console.log("new Meal Id "+meal.id);
          //self.lastMealIdAdded = meal.id;
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
      console.log("this.results.length : "+this.results.length);
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == mealId){
          self.selectedMeal = this.results[i];
          return this.results[i];
          console.log("Found meal");
        }
      }
      console.log("Meal Not found");
      return undefined;
    },
    'getMealIndex': function (mealId) {
      console.log("this.results.length : "+this.results.length);
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == mealId){
          return i;
          console.log("Found meal index");
        }
      }
      console.log("Meal index Not found");
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
      meal.set("calories", parseInt(formData.calories));
      meal.set("fat", parseInt(formData.fat));
      meal.set("sodium", parseInt(formData.sodium));
      meal.set("sugar", parseInt(formData.sugar));
      meal.set("protein", parseInt(formData.protein));
      meal.set("carbs", parseInt(formData.carbs));
      meal.set("fiber", parseInt(formData.fiber));
      console.log("getMeal formData.group.value : "+formData.selectedOption.value);
      meal.set("group", formData.selectedOption.value);
      console.log("getMeal formData.amount : "+formData.amount);
      meal.set("amount", parseInt(formData.amount));

      switch(formData.selectedOption.value){
        case "fruit": iconName = 'img/food/fruit-icon.png';break;
        case "veggie": iconName = 'img/food/veggie-icon.png';break;
        case "grain": iconName = 'img/food/grain-icon.png';break;
        case "protein": iconName = 'img/food/meat-icon.png';break;
        case "oil": iconName = 'img/food/oil-icon.png';break;
        case "dairy": iconName = 'img/food/dairy-icon.png';break;
        case "other": iconName = 'img/food/other-icon.png';break;
        default : iconName = 'img/food/veggie-icon.png';break;
      }

      meal.set("iconName", iconName);

      meal.save(null, {
        success: function (meal) {
          console.log("Meal updated");
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
      console.log("destroyMeal mealId: "+mealId);
      self.isSaving = true;
      var d = $q.defer();
      var index = this.getMealIndex(mealId);

      self.results[index].destroy().then(function(){
        console.log("after destroy then");
        d.resolve();
      });

      //self.results[index].destroy(null, {
      //  success: function (meal) {
      //    console.log("Meal destroyed");
      //    self.results.splice(index, 1);
      //    d.resolve(meal);
      //  },
      //  error: function (item, error) {
      //    $ionicPopup.alert({
      //      title: "Error destroying meal",
      //      subTitle: error.message
      //    });
      //    d.reject(error);
      //  }
      //});

      console.log("after meal.destroy");

      return d.promise;
    }

	};

	return self;
});
