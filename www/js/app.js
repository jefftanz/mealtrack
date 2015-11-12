var app = angular.module('mealtrack', [
	'ionic',
	'ngMessages',
	'ngCordova',
	'angularMoment',
	'parse-angular',
	'parse-angular.enhance',
  'mealtrack.controllers.intro',
	'mealtrack.controllers.authentication',
	'mealtrack.controllers.meals',
	'mealtrack.controllers.account',
  'mealtrack.controllers.stats',
  'mealtrack.controllers.goals',
	'mealtrack.services.authentication',
	'mealtrack.services.meals',
  'mealtrack.services.stats',
  'mealtrack.services.goals',
	'mealtrack.filters.mealtime'
]);

//TODO need to add
// $ ionic add ionic-platform-web-client
// $ ionic plugin add ionic-plugin-deploy
// 4 ionic deploy, push, analytics
// ionic . core or something as well?

app.run(function ($ionicPlatform, $location) {
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
		Parse.initialize("<KEY>","<KEY>");

  var firstVisit = localStorage.getItem('firstVisit');
  if (!firstVisit) {
    $location.url('/intro');
  }

});

//TODO turn on 4 ionic deploy, push, analytics
//app.run(function ($ionicPlatform, $ionicAnalytics){
//  $ionicPlatform.ready(function (){
//    $ionicAnalytics.register();
//  });
//});

//TODO turn on 4 ionic deploy, push, analytics
//app.run(function ($ionicPlatform) {
//  $ionicPlatform.ready(function () {
//    var deploy = new Ionic.Deploy();
//    deploy.watch().then(
//      function noop() {
//      },
//      function noop() {
//      },
//      function hasUpdate(hasUpdate) {
//        console.log("Has Update ", hasUpdate);
//        if (hasUpdate) {
//          console.log("Calling ionicDeploy.update()");
//          deploy.update().then(function (deployResult) {
//          // deployResult will be true when successfull and
//          // false otherwise
//          }, function (deployUpdateError) {
//            // fired if we're unable to check for updates or if any
//            // errors have occured.
//            console.log('Ionic Deploy: Update error! ', deployUpdateError);
//          }, function (deployProgress) {
//            // this is a progress callback, so it will be called a lot
//            // deployProgress will be an Integer representing the current
//            // completion percentage.
//            console.log('Ionic Deploy: Progress... ', deployProgress);
//          });
//        }
//      }
//    );
//  });
//});

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
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html"
    })
    .state('menu.goals', {
      url: '/goals',
      templateUrl: 'templates/menu/edit-goal-daily.html',
      //templateUrl: 'templates/menu/goal-daily.html',
      controller: 'GoalsCtrl',
    })
    .state('menu.editgoals', {
      url: '/goals/edit',
      templateUrl: 'templates/menu/edit-goal-daily.html',
      controller: 'GoalsCtrl',
    })
    .state('menu.meals', {
      url: '/meals',
      templateUrl: 'templates/menu/meals.html',
      controller : 'MealListCtrl'
    })
		.state('menu.track', {
			url: '/track',
      templateUrl: 'templates/menu/add-meal.html',
      controller : 'MealCreateCtrl'
		})
    .state('menu.edit', {
      url: '/edit/:mealId',
      templateUrl: 'templates/menu/edit-meal.html',
      controller : 'MealEditCtrl'
    })
		.state('menu.account', {
			url: '/account',
      templateUrl: 'templates/menu/account.html',
      controller : 'AccountCtrl'
		})
    .state('menu.groups', {
      url: '/groups',
      templateUrl: 'templates/menu/groups.html',
    })
    .state('menu.dairy', {
      url: '/group/dairy',
      templateUrl: 'templates/menu/group/group-dairy.html',
    })
    .state('menu.fruit', {
      url: '/group/fruit',
      templateUrl: 'templates/menu/group/group-fruit.html',
    })
    .state('menu.grain', {
      url: '/group/grain',
      templateUrl: 'templates/menu/group/group-grain.html',
    })
    .state('menu.oil', {
      url: '/group/oil',
      templateUrl: 'templates/menu/group/group-oil.html',
    })
    .state('menu.protein', {
      url: '/group/protein',
      templateUrl: 'templates/menu/group/group-protein.html',
    })
    .state('menu.vegetable', {
      url: '/group/vegetable',
      templateUrl: 'templates/menu/group/group-vegetable.html',
    })
    .state('menu.stats', {
      url: '/stats',
      templateUrl: 'templates/menu/stats.html',
    })
    .state('menu.today', {
      url: '/stats/today',
      templateUrl: 'templates/menu/stats/today.html',
      controller : 'StatsCtrl'
    });

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/intro');

});
