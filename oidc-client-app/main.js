var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'home.html',
			controller: 'HomeController'
		})
		.when('/viewCustomers', {
			templateUrl: 'viewCustomers.html',
			controller: 'CustomerController'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

mainApp.controller('HomeController', function($scope, $http) {
	$scope.message = "Here, Click to view customers.";
});

mainApp.controller('CustomerController', function($scope, $http) {
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
