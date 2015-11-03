var app = angular.module('mealtrack.services.goals', []);

app.service("GoalsService", function ($q, AuthService) {

  var self = {
    'isLoading': false,
    'id': '',
    'fat': 0,
    'calories': 0,
    'carbs': 0,
    'fiber': 0,
    'protein': 0,
    'sodium': 0,
    'sugar': 0,
    'vegetable': 0,
    'fruit': 0,
    'proteinG': 0,
    'dairy': 0,
    'grain': 0,
    'oil': 0,
    'getUserGoals': function () {
      self.isLoading = true;
      var d = $q.defer();

      console.log("get User Goals - query");

      // Initialise Query
      var DailyGoal = Parse.Object.extend("DailyGoal");
      var query = new Parse.Query(DailyGoal);
      query.equalTo("owner", AuthService.user);

      // Perform the query
      query.find({
        success: function (results) {
          angular.forEach(results, function (item) {

            console.log("length of results: "+results.length);

            //Avg diet values on 2000 Calories
            self.id = item.id;
            console.log("item.id : "+item.id);
            self.calories = item.get("calories");
            self.fat = item.get("fat");
            self.carbs = item.get("carbs");
            self.fiber = item.get("fiber");
            self.protein = item.get("protein");
            self.sodium = item.get("sodium");
            self.sugar = item.get("sugar");

            self.vegetable = item.get("vegetable");
            self.fruit = item.get("fruit");
            self.proteinG = item.get("proteinG");
            self.dairy = item.get("dairy");
            self.grain = item.get("grain");
            self.oil = item.get("oil");
          });

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },
    'updateUserGoals': function(){

    }

  };

  return self;
});
