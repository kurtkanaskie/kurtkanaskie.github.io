var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'home.html',
			controller: 'HomeController'
		})
		.when('/authorize', {
			templateUrl: 'authorize.html',
			controller: 'AuthorizeController'
		})
		.when('/callback', {
			templateUrl: 'callback.html',
			controller: 'CallbackController'
		})
		.when('/customers', {
			templateUrl: 'customers.html',
			controller: 'CustomersController'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

mainApp.controller('HomeController', function($scope, $http) {
	$scope.message = "Click to authorize then view customers.";
    var date = new Date();
    $scope.date = date;
	$scope.callback = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-client-app/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + date;
});

mainApp.controller('AuthorizeController', function($scope, $http) {
	$scope.message = "Complete form, using id_token for implicit flow, code for code flow.";
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
