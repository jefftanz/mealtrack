var app = angular.module('mealtrack.services.stats', []);

app.service("StatsService", function ($q, AuthService) {

  var self = {
    'isLoading': false,
    'results': [],
    'total_fat': 0,
    'total_calories': 0,
    'total_carbs': 0,
    'total_fiber': 0,
    'total_protein': 0,
    'total_sodium': 0,
    'total_sugar': 0,
    'getTodaysItems': function () {
      self.isLoading = true;
      var d = $q.defer();

      //clear the results
      self.results = [];
      self.total_calories = 0;
      self.total_carbs = 0;
      self.total_fat = 0;
      self.total_fiber = 0;
      self.total_protein = 0;
      self.total_sodium = 0;
      self.total_sugar = 0;

      console.log("getTodaysItems - query");

      // Initialise Query
      var Meal = Parse.Object.extend("Meal");
      var mealItemQuery = new Parse.Query(Meal);
      mealItemQuery.descending('created');

      var lastMidnight = new Date();
      lastMidnight.setHours(0,0,0,0); // last midnight
      mealItemQuery.greaterThan("created", lastMidnight);
      mealItemQuery.equalTo("owner", AuthService.user);

      // Perform the query
      mealItemQuery.find({
        success: function (results) {
          angular.forEach(results, function (item) {

            self.total_calories += item.get("calories");
            self.total_fat += item.get("fat");
            self.total_carbs += item.get("carbs");
            self.total_fiber += item.get("fiber");
            self.total_protein += item.get("protein");
            self.total_sodium += item.get("sodium");
            self.total_sugar += item.get("sugar");

            //console.log("item calories: "+item.get("calories"));

            self.results.push(item);
          });
          console.debug(self.results);
          console.log("size of stats: "+self.results.length);
          console.log("total calories: "+self.total_calories);

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    }
  };

  return self;
});
