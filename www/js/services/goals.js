var app = angular.module('mealtrack.services.goals', []);

app.service("GoalsService", function ($q, AuthService) {

  var self = {
    'isLoading': false,
    'item': {
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
    },
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
            self.item.id = item.id;
            console.log("item.id : "+item.id);
            self.item.calories = item.get("calories");
            self.item.fat = item.get("fat");
            self.item.carbs = item.get("carbs");
            self.item.fiber = item.get("fiber");
            self.item.protein = item.get("protein");
            self.item.sodium = item.get("sodium");
            self.item.sugar = item.get("sugar");

            self.item.vegetable = item.get("vegetable");
            self.item.fruit = item.get("fruit");
            self.item.proteinG = item.get("proteinG");
            self.item.dairy = item.get("dairy");
            self.item.grain = item.get("grain");
            self.item.oil = item.get("oil");
          });

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },
    'updateUserGoals': function(dailyGoalData, goalId){
      //TODO get this saving correctly to Parse.
      self.isSaving = true;
      var d = $q.defer();

      console.log("DailyGoalData.calories : "+dailyGoalData.calories);
      console.log("GoalId : "+goalId);

      var DailyGoal = Parse.Object.extend("DailyGoal");
      var user = AuthService.user;
      //var file = formData.picture ? new Parse.File("photo.jpg", {base64: formData.picture}) : null;
      // TODO figure out when to replace the picture or leave it alone.

      var parseObject = new DailyGoal(self.item);

      console.log("self.calories : "+self.item.calories);

      parseObject.set("owner", user);
      parseObject.set("id", dailyGoalData.id);
      parseObject.set("calories", dailyGoalData.calories);
      parseObject.set("fat", dailyGoalData.fat);
      parseObject.set("carbs", dailyGoalData.carbs);
      parseObject.set("fiber", dailyGoalData.fiber);
      parseObject.set("protein", dailyGoalData.protein);
      parseObject.set("sodium", dailyGoalData.sodium);
      parseObject.set("sugar", dailyGoalData.sugar);

      parseObject.set("vegetable", dailyGoalData.vegetable);
      parseObject.set("fruit", dailyGoalData.fruit);
      parseObject.set("proteinG", dailyGoalData.proteinG);
      parseObject.set("dairy", dailyGoalData.dairy);
      parseObject.set("grain", dailyGoalData.grain);
      parseObject.set("oil", dailyGoalData.oil);

      parseObject.save(null, {
        success: function (returnObject) {
          console.log("dailyGoal updated");
          //self.resetUserGoals(dailyGoal);

          d.resolve(returnObject);
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
    'resetUserGoals' : function(dailyGoalData){

      //self.calories = dailyGoalData.calories;
      //self.fat = dailyGoalData.fat;
      //self.carbs = dailyGoalData.carbs;
      //self.fiber = dailyGoalData.fiber;
      //self.protein = dailyGoalData.protein;
      //self.sodium = dailyGoalData.sodium;
      //self.sugar = dailyGoalData.sugar;
      //
      //self.vegetable = dailyGoalData.vegetable;
      //self.fruit = dailyGoalData.fruit;
      //self.proteinG = dailyGoalData.proteinG;
      //self.dairy = dailyGoalData.dairy;
      //self.grain = dailyGoalData.grain;
      //self.oil = dailyGoalData.oil;

    }

  };

  return self;
});
