var app = angular.module('mealtrack.services.authentication', []);

app.service('AuthService', function ($q, $ionicPopup) {

	var self = {
		user: Parse.User.current(),
    ageDesc : '',
    genderDesc: '',
		login: function (email, password) {
			var d = $q.defer();

			Parse.User.logIn(email, password, {
				success: function (user) {
          console.log("inside parse.user.login");
					self.user = user;
          //TODO turn on 4 ionic deploy, push, analytics
          //self.registerUser();
          self.setDescriptions();
					d.resolve(self.user);
				},
				error: function (user, error) {
					$ionicPopup.alert({
						title: 'Login Error',
						subTitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		},
		signup: function (email, name, password, age, gender) {
			var d = $q.defer();

			var user = new Parse.User();
			user.set('username', email);
			user.set('name',name);
			user.set('password',password);
			user.set('email',email);
      user.set("age", age);
      user.set("gender", gender);

      console.log("signup user - Age: "+age +" gender: "+ gender);

			user.signUp(null,{
				success: function (user) {
					console.log("Account Created");
					self.user = user;
          //TODO turn on 4 ionic deploy, push, analytics
          //self.registerUser();
          self.setDescriptions();
					d.resolve(self.user);
				},
				error: function (user, error) {
					$ionicPopup.alert({
						title:'Signup Error',
						subTitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		},
		'update': function (data)  {
			var d = $q.defer();

			var user = self.user;
			user.set("username", data.email);
			user.set("name", data.name);
			user.set("email", data.email);
      user.set("age", data.age);
      user.set("gender", data.gender);

      console.log("update user info - Age: "+data.age +" gender: "+ data.gender);

			user.save(null, {
				success: function (user) {
					self.user = user;
          self.setDescriptions();
					d.resolve(self.user);
				},
				error: function (user, error) {
					$ionicPopup.alert({
						title: "Save Error",
						subTitle: error.message
					});
					d.reject(error);
				}
			});

			return d.promise;
		},
    setDescriptions: function(){

      console.log("inside setDescriptions");
      console.log("self.user.attributes.age: "+self.user.attributes.age);
      console.log("self.user.attributes.gender: "+self.user.attributes.gender);

      switch(parseInt(self.user.attributes.age)){
        case 0: self.ageDesc = "19 - 30"; break;
        case 1: self.ageDesc = "31 - 50"; break;
        case 2: self.ageDesc = "51+"; break;
      }

      switch(parseInt(self.user.attributes.gender)){
        case 0: self.genderDesc = "Male"; break;
        case 1: self.genderDesc = "Female"; break;
      }

    },
    setGoalDefaults: function () {
      var d = $q.defer();
      var user = self.user;
      var gender = parseInt(self.user.get("gender"));
      var age = parseInt(self.user.get("age"));

      console.log("user gender: "+gender);
      console.log("user age: "+age);

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
      var goals = new DailyGoal();
      goals.set("owner", user);

      //Food Groups
      goals.set("vegetable", vegetable);
      goals.set("fruit", fruit);
      goals.set("proteinG", protein);
      goals.set("oil", oil);
      goals.set("dairy", dairy);
      goals.set("grain", grain);

      //Avg 2000 Calorie Diet
      goals.set("calories", 2000);
      goals.set("protein", 50);
      goals.set("fat", 70);
      goals.set("carbs", 310);
      goals.set("sugar", 90);
      goals.set("sodium", 2300);
      goals.set("fiber", 30);

      goals.save(null, {
        success: function (goals) {
          console.log("Goals Default values set");
          console.log("new Goals Id "+goals.id);
          d.resolve(goals);
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
    //TODO Turn back on for Registering Ionic users for analytics, deploy, push
    //,
    //'registerUser': function() {
    //  // kick off the platform web client
    //  Ionic.io();
    //  // this will give you a fresh user or the previously saved 'current user'
    //  var user = Ionic.User.current();
    //  // if the user doesn't have an id, you'll need to give it one.
    //  if (!user.id) {
    //    user.id = self.user.id;
    //    user.set('name', self.user.get("name"));
    //    user.set('username', self.user.get("username"));
    //    user.set('email', self.user.get("email"));
    //  }
    //  //persist the user
    //  user.save().then(function () {
    //  // register this device for pushes
    //    var push = new Ionic.Push({"debug": true});
    //    push.register(function (token) {
    //      // store the resulting device token to the user object
    //      console.log('Got token', token.token, token.platform);
    //      self.current.deviceToken = token.token;
    //      self.current.$save();
    //    });
    //  })
    //}

	};





	return self;
})
;

