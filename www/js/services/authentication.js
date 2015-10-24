var app = angular.module('mealtrack.services.authentication', []);

app.service('AuthService', function ($q, $ionicPopup) {

	var self = {
		user: Parse.User.current(),
		login: function (email, password) {
			var d = $q.defer();

			Parse.User.logIn(email, password, {
				success: function (user) {
					self.user = user;
          self.registerUser();
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
		signup: function (email, name, password) {
			var d = $q.defer();

			var user = new Parse.User();
			user.set('username', email);
			user.set('name',name);
			user.set('password',password);
			user.set('email',email);

			user.signUp(null,{
				success: function (user) {
					console.log("Account Created");
					self.user = user;
          self.registerUser();
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

			user.save(null, {
				success: function (user) {
					self.user = user;
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
    'registerUser': function() {
      // kick off the platform web client
      Ionic.io();
      // this will give you a fresh user or the previously saved 'current user'
      var user = Ionic.User.current();
      // if the user doesn't have an id, you'll need to give it one.
      if (!user.id) {
        user.id = self.user.id;
        user.set('name', self.user.get("name"));
        user.set('username', self.user.get("username"));
        user.set('email', self.user.get("email"));
      }
      //persist the user
      user.save().then(function () {
      // register this device for pushes
        var push = new Ionic.Push({"debug": true});
        push.register(function (token) {
          // store the resulting device token to the user object
          console.log('Got token', token.token, token.platform);
          self.current.deviceToken = token.token;
          self.current.$save();
        });
      })
    }

	};





	return self;
})
;

