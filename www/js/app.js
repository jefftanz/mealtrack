var app = angular.module('mealtrack', [
	'ionic',
  'ionic.service.core',
  'ionic.service.analytics',
	'ngMessages',
	'ngCordova',
	'angularMoment',
	'parse-angular',
	'parse-angular.enhance',
  'mealtrack.controllers.intro',
	'mealtrack.controllers.authentication',
	'mealtrack.controllers.meals',
	'mealtrack.controllers.account',
	'mealtrack.services.authentication',
	'mealtrack.services.meals',
	'mealtrack.filters.mealtime'
]);

app.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleBlackTranslucent();
		}
	});

		// Initialise Parse
		Parse.initialize(<KEY>, <KEY>);
});

app.run(function ($ionicPlatform, $ionicAnalytics){
  $ionicPlatform.ready(function (){
    $ionicAnalytics.register();
  });
});

app.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    var deploy = new Ionic.Deploy();
    deploy.watch().then(
      function noop() {
      },
      function noop() {
      },
      function hasUpdate(hasUpdate) {
        console.log("Has Update ", hasUpdate);
        if (hasUpdate) {
          console.log("Calling ionicDeploy.update()");
          deploy.update().then(function (deployResult) {
          // deployResult will be true when successfull and
          // false otherwise
          }, function (deployUpdateError) {
            // fired if we're unable to check for updates or if any
            // errors have occured.
            console.log('Ionic Deploy: Update error! ', deployUpdateError);
          }, function (deployProgress) {
            // this is a progress callback, so it will be called a lot
            // deployProgress will be an Integer representing the current
            // completion percentage.
            console.log('Ionic Deploy: Progress... ', deployProgress);
          });
        }
      }
    );
  });
});

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
    .state('intro', {
      url: "/intro",
      cache: false,
      controller: 'IntroCtrl',
      templateUrl: "templates/intro.html"
    })
    .state('login', {
			url: "/login",
			cache: false,
			controller: 'LoginCtrl',
			templateUrl: "templates/login.html"
		})
		.state('signup', {
			url: "/signup",
			cache: false,
			controller: 'SignupCtrl',
			templateUrl: "templates/signup.html"
		})
		.state('tab', {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html"
		})
		.state('tab.meals', {
			url: '/meals',
			views: {
				'tab-meals': {
					templateUrl: 'templates/tabs/tab-meals.html',
					controller: 'MealListCtrl'
				}
			}
		})
		.state('tab.track', {
			url: '/track',
			views: {
				'tab-track': {
					templateUrl: 'templates/tabs/tab-track.html',
					controller: 'MealCreateCtrl'
				}
			}
		})
		.state('tab.account', {
			url: '/account',
			views: {
				'tab-account': {
					templateUrl: 'templates/tabs/tab-account.html',
					controller: 'AccountCtrl'
				}
			}
		});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/intro');

});
