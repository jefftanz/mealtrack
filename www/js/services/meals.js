var app = angular.module('mealtrack.services.meals', []);

app.service("MealService", function ($q, AuthService) {
	var self = {
		'page': 0,
		'page_size': 20,
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
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

            //console.log("item.id"+item.id);
            //console.log("item.objectId"+item.objectId);
            //console.log("item.get(id)"+item.get("id"));
            //console.log("item.get(objectId)"+item.get("objectId"));
            //console.log("item"+item);
            //console.log("meal"+meal);
            //console.log("Id : "+meal.id);
            //console.log("get Id : "+meal.get("id"));
            //console.log("objectId : "+meal.objectId);
            //console.log("get objectId : "+meal.get("objectId"));

						//self.results.push(meal);
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

			var Meal = Parse.Object.extend("Meal");
			var user = AuthService.user;
			var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;

			var meal = new Meal();
			meal.set("owner", user);
			meal.set("picture", file);
			meal.set("title", data.title);
			meal.set("category", data.category);
			meal.set("calories", parseInt(data.calories));
      meal.set("fat", parseInt(data.fat));
      meal.set("sodium", parseInt(data.sodium));
      meal.set("sugar", parseInt(data.sugar));
      meal.set("protein", parseInt(data.protein));
      meal.set("carbs", parseInt(data.carbs));
      meal.set("fiber", parseInt(data.fiber));
      meal.set("group", data.group);
			meal.set("created", new Date());

			meal.save(null, {
				success: function (meal) {
					console.log("Meal tracked");
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
      console.log("this.results.length : "+this.results.length);
      for (var i = 0; i < this.results.length; i++){
        if (this.results[i].id == mealId){
          return this.results[i];
          console.log("Found meal");
        }
      }
      console.log("Meal Not found");
      return undefined;
    },
    'update': function (formData, mealId) {
      self.isSaving = true;
      var d = $q.defer();

      var Meal = Parse.Object.extend("Meal");
      var user = AuthService.user;
      //var file = formData.picture ? new Parse.File("photo.jpg", {base64: formData.picture}) : null;
      // TODO figure out when to replace the picture or leave it alone.

      var item = this.getMeal(mealId);
      var meal = new Meal(item);
      meal.set("owner", user);

      //if (file != null){ meal.set("picture", file);}

      meal.set("id", mealId);
      meal.set("title", formData.title);
      meal.set("category", formData.category);
      meal.set("calories", parseInt(formData.calories));
      meal.set("fat", parseInt(formData.fat));
      meal.set("sodium", parseInt(formData.sodium));
      meal.set("sugar", parseInt(formData.sugar));
      meal.set("protein", parseInt(formData.protein));
      meal.set("carbs", parseInt(formData.carbs));
      meal.set("fiber", parseInt(formData.fiber));
      meal.set("group", formData.group);

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
    }

	};

	return self;
});
