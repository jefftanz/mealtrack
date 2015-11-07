var app = angular.module('mealtrack.services.stats', []);

app.service("StatsService", function ($q, AuthService) {

  var self = {
    'isLoading': false,
    'totals': {
      'results': [],
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
      'oil': 0
    },
    'daily': {
      'results': [],
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
      'oil': 0
    },
    'percentage': {
      'results': [],
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
      'oil': 0
    },
    'getDailyGoals': function () {
      self.isLoading = true;
      var d = $q.defer();

      //Clear the values
      self.daily.results = [];
      self.daily.calories = 0;
      self.daily.fat = 0;
      self.daily.carbs = 0;
      self.daily.fiber = 0;
      self.daily.protein = 0;
      self.daily.sodium = 0;
      self.daily.sugar = 0;
      self.daily.vegetable = 0;
      self.daily.fruit = 0;
      self.daily.proteinG = 0;
      self.daily.dairy = 0;
      self.daily.grain = 0;
      self.daily.oil = 0;

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
            console.log("item.id : "+item.id);

            self.daily.id = item.id;
            self.daily.calories = item.get("calories");
            self.daily.fat = item.get("fat");
            self.daily.carbs = item.get("carbs");
            self.daily.fiber = item.get("fiber");
            self.daily.protein = item.get("protein");
            self.daily.sodium = item.get("sodium");
            self.daily.sugar = item.get("sugar");
            self.daily.vegetable = item.get("vegetable");
            self.daily.fruit = item.get("fruit");
            self.daily.proteinG = item.get("proteinG");
            self.daily.dairy = item.get("dairy");
            self.daily.grain = item.get("grain");
            self.daily.oil = item.get("oil");

            self.daily.results.push(item);
          });

          console.debug(self.daily.results);

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },
    'getTodaysTotals': function () {
      self.isLoading = true;
      var d = $q.defer();

      //clear the totals
      self.totals.results = [];
      self.totals.calories = 0;
      self.totals.carbs = 0;
      self.totals.fat = 0;
      self.totals.fiber = 0;
      self.totals.protein = 0;
      self.totals.sodium = 0;
      self.totals.sugar = 0;
      self.totals.vegetable = 0;
      self.totals.fruit = 0;
      self.totals.proteinG = 0;
      self.totals.dairy = 0;
      self.totals.grain = 0;
      self.totals.oil = 0;

      console.log("getTodaysItems - query");

      // Initialise Query
      var Meal = Parse.Object.extend("Meal");
      var totalsQuery = new Parse.Query(Meal);
      totalsQuery.descending('created');

      var lastMidnight = new Date();
      lastMidnight.setHours(0,0,0,0); // last midnight
      totalsQuery.greaterThan("created", lastMidnight);
      totalsQuery.equalTo("owner", AuthService.user);

      // Perform the query
      totalsQuery.find({
        success: function (results) {
          angular.forEach(results, function (item) {

            self.totals.calories += item.get("calories");
            self.totals.fat += item.get("fat");
            self.totals.carbs += item.get("carbs");
            self.totals.fiber += item.get("fiber");
            self.totals.protein += item.get("protein");
            self.totals.sodium += item.get("sodium");
            self.totals.sugar += item.get("sugar");

            switch(item.get("group")){
              case "vegetable": self.totals.vegetable += item.get("amount"); break;
              case "fruit":  self.totals.fruit += item.get("amount"); break;
              case "proteinG": self.totals.proteinG += item.get("amount"); break;
              case "dairy": self.totals.dairy += item.get("amount"); break;
              case "grain": self.totals.grain += item.get("amount"); break;
              case "oil": self.totals.oil += item.get("amount"); break;
            }

            self.totals.results.push(item);
          });

          console.debug(self.totals.results);
          console.log("size of stats: "+self.totals.results.length);
          console.log("total calories: "+self.totals.calories);

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },
    'setPercentages': function(){
      self.isLoading = true;
      var d = $q.defer();

      //Clear the values
      self.percentage.results = [];
      self.percentage.calories = 0;
      self.percentage.fat = 0;
      self.percentage.carbs = 0;
      self.percentage.fiber = 0;
      self.percentage.protein = 0;
      self.percentage.sodium = 0;
      self.percentage.sugar = 0;
      self.percentage.vegetable = 0;
      self.percentage.fruit = 0;
      self.percentage.proteinG = 0;
      self.percentage.dairy = 0;
      self.percentage.grain = 0;
      self.percentage.oil = 0;

      if (self.totals.calories == 0 || self.daily.calories == 0){
        self.percentage.calories = 0;
      }else{
        self.percentage.calories = ((self.totals.calories / self.daily.calories).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.fat == 0 || self.daily.fat == 0){
        self.percentage.fat = 0;
      }else{
        self.percentage.fat = ((self.totals.fat / self.daily.fat).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.carbs == 0 || self.daily.carbs == 0){
        self.percentage.carbs = 0;
      }else{
        self.percentage.carbs = ((self.totals.carbs / self.daily.carbs).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.fiber == 0 || self.daily.fiber == 0){
        self.percentage.fiber = 0;
      }else{
        self.percentage.fiber = ((self.totals.fiber / self.daily.fiber).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.protein == 0 || self.daily.protein == 0){
        self.percentage.protein = 0;
      }else{
        self.percentage.protein = ((self.totals.protein / self.daily.protein).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.carbs == 0 || self.daily.carbs == 0){
        self.percentage.carbs = 0;
      }else{
        self.percentage.carbs = ((self.totals.carbs / self.daily.carbs).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.sodium == 0 || self.daily.sodium == 0){
        self.percentage.sodium = 0;
      }else{
        self.percentage.sodium = ((self.totals.sodium / self.daily.sodium).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.sugar == 0 || self.daily.sugar == 0){
        self.percentage.sugar = 0;
      }else{
        self.percentage.sugar = ((self.totals.sugar / self.daily.sugar).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.vegetable == 0 || self.daily.vegetable == 0){
        self.percentage.vegetable = 0;
      }else{
        self.percentage.vegetable = ((self.totals.vegetable / self.daily.vegetable).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.fruit == 0 || self.daily.fruit == 0){
        self.percentage.fruit = 0;
      }else{
        self.percentage.fruit = ((self.totals.fruit / self.daily.fruit).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.proteinG == 0 || self.daily.proteinG == 0){
        self.percentage.proteinG = 0;
      }else{
        self.percentage.proteinG = ((self.totals.proteinG / self.daily.proteinG).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.dairy == 0 || self.daily.dairy == 0){
        self.percentage.dairy = 0;
      }else{
        self.percentage.dairy = ((self.totals.dairy / self.daily.dairy).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.grain == 0 || self.daily.grain == 0){
        self.percentage.grain = 0;
      }else{
        self.percentage.grain = ((self.totals.grain / self.daily.grain).toPrecision(4) * 100).toFixed(2);
      }

      if (self.totals.oil == 0 || self.daily.oil == 0){
        self.percentage.oil = 0;
      }else{
        self.percentage.oil = ((self.totals.oil / self.daily.oil).toPrecision(4) * 100).toFixed(2);
      }

      // Finished
      d.resolve();
      return d.promise;
    }
  };

  return self;
});
