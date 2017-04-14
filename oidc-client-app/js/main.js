var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/oidc-client-app/home', {
			templateUrl: 'oidc-client-app/home.html',
			controller: 'HomeController'
		})
		.when('/oidc-client-app/callback', {
			templateUrl: 'oidc-client-app/callback.html',
			controller: 'CallbackController'
		})
		.when('/oidc-client-app/customers', {
			templateUrl: 'oidc-client-app/customers.html',
			controller: 'CustomersController'
		})
		.otherwise({
			redirectTo: '/oidc-client-app/home'
		});

		$locationProvider.html5Mode(true);
});

mainApp.controller('HomeController', function($scope, $http) {
	$scope.message = "Click to authorize then view customers.";
    $scope.date = Date.now();
	$scope.authorize = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-client-app/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
});

mainApp.controller('CallbackController', function($scope, $http) {
	$scope.message = "Callback Handler";
});

mainApp.controller('CustomersController', function($scope, $http) {
	$http({
		method : "GET",
		url : "https://apibaas-trial.apigee.net/kurtkanaskie/sandbox/customers"
	}).then(function mySucces(response) {
      $scope.status = "OK";
      $scope.customers = response.data.entities;
    }, function myError(response) {
      $scope.status = "Uh oh";
      $scope.customers = response.status;
	});
});
