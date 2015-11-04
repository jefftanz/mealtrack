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
  'mealtrack.controllers.stats',
  'mealtrack.controllers.goals',
	'mealtrack.services.authentication',
	'mealtrack.services.meals',
  'mealtrack.services.stats',
  'mealtrack.services.goals',
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
		Parse.initialize("<TAG>","<TAG>");
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
    .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html"
    })
    .state('menu.home', {
      url: '/home',
      templateUrl: 'templates/menu/home.html'
    })
    .state('menu.settings', {
      url: '/settings',
      templateUrl: 'templates/menu/settings.html'
    })
    .state('menu.goals', {
      url: '/goals',
      abstract: true,
      templateUrl: 'templates/menu/goals.html'
    })
    .state('menu.goals.daily', {
      url: '/daily',
      views: {
        'goal-daily': {
          templateUrl: 'templates/menu/goal/goal-daily.html',
          controller : 'GoalsCtrl'
        }
      }
    })
    .state('menu.goals.weekly', {
      url: '/weekly',
      views: {
        'goal-weekly': {
          templateUrl: 'templates/menu/goal/goal-weekly.html',
        }
      }
    })
    //.state('menu.goals', {
    //  url: '/goals',
    //  abstract: true,
    //  templateUrl: 'templates/menu/goals.html'
    //})
    //.state('menu.goal.daily', {
    //  url: '/daily',
    //  parent: 'menu.goals',
    //  views: {
    //    'goal-daily': {
    //      templateUrl: 'templates/menu/goal/goal-daily.html'
    //    }
    //  }
    //})
    //.state('menu.goal.weekly', {
    //  url: '/weekly',
    //  parent: 'menu.goals',
    //  views: {
    //    'goal-weekly': {
    //      templateUrl: 'templates/menu/goal/goal-weekly.html'
    //    }
    //  }
    //})
    .state('menu.meals', {
      url: '/meals',
      templateUrl: 'templates/menu/meals.html',
      controller : 'MealListCtrl'
    })
		.state('menu.track', {
			url: '/track',
      templateUrl: 'templates/menu/track.html',
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
    .state('menu.vegatable', {
      url: '/group/vegatable',
      templateUrl: 'templates/menu/group/group-vegatable.html',
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
