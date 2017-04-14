var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'app/home.html',
			controller: 'HomeController'
		})
		.when('/callback', {
			templateUrl: 'app/callback.html',
			controller: 'CallbackController'
		})
		.when('/customers', {
			templateUrl: 'app/customers.html',
			controller: 'CustomersController'
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
});

app.controller('HomeController', function($scope, $http) {
	$scope.message = "Click to authorize then view customers.";
    $scope.date = Date.now();
	$scope.callback = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-client-app/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
});

app.controller('CallbackController', function($scope, $http) {
	$scope.message = "Callback Handler";
});

app.controller('CustomersController', function($scope, $http) {
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
