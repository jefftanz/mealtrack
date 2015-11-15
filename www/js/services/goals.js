var app = angular.module('mealtrack.services.goals', [
  "mealtrack.myUtil.basic"
]);

app.service("GoalsService", function ($q, AuthService) {

  var self = {
    'isLoading': false,
    'results':[],
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
            self.setGoalServiceItemFromParseObject(item);
            self.results.push(item);
          });

          // Finished
          d.resolve();
        }
      });

      return d.promise;
    },
    'setGoalServiceItemFromParseObject' : function(parseObject){
      self.item.calories = parseObject.get("calories");
      self.item.fat = parseObject.get("fat");
      self.item.carbs = parseObject.get("carbs");
      self.item.fiber = parseObject.get("fiber");
      self.item.protein = parseObject.get("protein");
      self.item.sodium = parseObject.get("sodium");
      self.item.sugar = parseObject.get("sugar");
      self.item.vegetable = parseObject.get("vegetable");
      self.item.fruit = parseObject.get("fruit");
      self.item.proteinG = parseObject.get("proteinG");
      self.item.dairy = parseObject.get("dairy");
      self.item.grain = parseObject.get("grain");
      self.item.oil = parseObject.get("oil");
    },
    'setGoalServiceItemFromFormData' : function(formData){
      self.item.calories = formData.calories;
      self.item.fat = formData.fat;
      self.item.carbs = formData.carbs;
      self.item.fiber = formData.fiber;
      self.item.protein = formData.protein;
      self.item.sodium = formData.sodium;
      self.item.sugar = formData.sugar;
      self.item.vegetable = formData.vegetable;
      self.item.fruit = formData.fruit;
      self.item.proteinG = formData.proteinG;
      self.item.dairy = formData.dairy;
      self.item.grain = formData.grain;
      self.item.oil = formData.oil;
    },
    'updateUserGoals': function(dailyGoalData, goalId){
      self.isSaving = true;
      var d = $q.defer();

      var DailyGoal = Parse.Object.extend("DailyGoal");
      var user = AuthService.user;
      var parseObject = new DailyGoal(self.item);

      //User info
      parseObject.set("owner", user);
      parseObject.set("id", self.item.id);

      //Basic Nutrition
      parseObject.set("calories", parseMyInt(dailyGoalData.calories));
      parseObject.set("fat", parseMyInt(dailyGoalData.fat));
      parseObject.set("carbs", parseMyInt(dailyGoalData.carbs));
      parseObject.set("fiber", parseMyInt(dailyGoalData.fiber));
      parseObject.set("protein", parseMyInt(dailyGoalData.protein));
      parseObject.set("sodium", parseMyInt(dailyGoalData.sodium));
      parseObject.set("sugar", parseMyInt(dailyGoalData.sugar));

      //Food Groups
      parseObject.set("vegetable", parseMyInt(dailyGoalData.vegetable));
      parseObject.set("fruit", parseMyInt(dailyGoalData.fruit));
      parseObject.set("proteinG", parseMyInt(dailyGoalData.proteinG));
      parseObject.set("dairy", parseMyInt(dailyGoalData.dairy));
      parseObject.set("grain", parseMyInt(dailyGoalData.grain));
      parseObject.set("oil", parseMyInt(dailyGoalData.oil));

      parseObject.save(null, {
        success: function (returnObject) {
          self.setGoalServiceItemFromParseObject(returnObject);
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
    'resetUserGoals' : function(){
      self.isSaving = true;
      var d = $q.defer();
      var user = AuthService.user;
      var gender = parseInt(user.get("gender"));
      var age = parseInt(user.get("age"));

      var vegetable = 0;
      var protein = 0;
      var oil = 0;
      var grain = 0;
      var fruit = 0;
      var dairy = 0;

        //Male
        if (gender == 0){

          switch(age){
            //19 - 30
            case 0 :
              vegetable = 3;
              fruit = 2;
              protein = 6.5;
              oil = 7;
              grain = 8;
              dairy = 3;
              break;

            // 31 - 50
            case 1 :
              vegetable = 3;
              fruit = 2;
              protein = 6;
              oil = 6;
              grain = 7;
              dairy = 3;
              break;

            // 51+
            case 2 :
              vegetable = 2.5;
              fruit = 2;
              protein = 5.5;
              oil = 6;
              grain = 6;
              dairy = 3;
              break;
          }
          //Female
        }else if(gender == 1){

          switch(age){
            //19 - 30
            case 0 :
              vegetable = 2.5;
              fruit = 2;
              protein = 5.5;
              oil = 6;
              grain = 6;
              dairy = 3;
              break;

            // 31 - 50
            case 1 :
              vegetable = 2.5;
              fruit = 1.5;
              protein = 5;
              oil = 5;
              grain = 6;
              dairy = 3;
              break;

            // 51+
            case 2 :
              vegetable = 2;
              fruit = 1.5;
              protein = 5;
              oil = 5;
              grain = 5;
              dairy = 3;
              break;
          }
        }

      var DailyGoal = Parse.Object.extend("DailyGoal");
      var goals = new DailyGoal(self.item);

      console.log("self.item.id: "+self.item.id);

      //PKs
      goals.set("owner", user);
      goals.set("id", self.item.id);

      //Food Groups
      goals.set("vegetable", parseInt(vegetable));
      goals.set("fruit", parseInt(fruit));
      goals.set("proteinG", parseInt(protein));
      goals.set("oil", parseInt(oil));
      goals.set("dairy", parseInt(dairy));
      goals.set("grain", parseInt(grain));

      //Avg 2000 Calorie Diet
      goals.set("calories", 2000);
      goals.set("protein", 50);
      goals.set("fat", 70);
      goals.set("carbs", 310);
      goals.set("sugar", 90);
      goals.set("sodium", 2300);
      goals.set("fiber", 30);

      console.log("goals.get(id): "+goals.get("id"));

      self.item.vegetable = parseInt(vegetable);
      self.item.fruit = parseInt(fruit);
      self.item.proteinG = parseInt(protein);
      self.item.dairy = parseInt(dairy);
      self.item.grain = parseInt(grain);
      self.item.oil = parseInt(oil);

      self.item.calories = 2000;
      self.item.protein = 50;
      self.item.fat = 70;
      self.item.carbs = 310;
      self.item.sugar = 90;
      self.item.sodium = 2300;
      self.item.fiber = 30;

      goals.save(null, {
        success: function (savedGoal) {
          console.log("Goals updated id: "+savedGoal.id);
          d.resolve(savedGoal);
        },
        error: function (item, error) {
          $ionicPopup.alert({
            title: "Error saving goals",
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
