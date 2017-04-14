(function(angular) {
  'use strict';
angular.module('ngRouteExample', ['ngRoute'])

 .controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.controllerName = 'MainController';
	$scope.message = "Click to authorize then view customers.";
	$scope.authorize = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-client/callback&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
 })

 .controller('CustomersController', function($scope, $http) {
    $scope.controllerName = 'CustomersController';
	$http({
		method : "GET",
		url : "https://apibaas-trial.apigee.net/kurtkanaskie/sandbox/customers"
	}).then(function mySucces(response) {
      $scope.message = "OK";
      $scope.status = response.status;
      $scope.customers = response.data.entities;
    }, function myError(response) {
      $scope.message = "Uh oh";
      $scope.status = response.status;
      $scope.customers = [];
	});
 })

 .controller('CallbackController', function($scope, $routeParams) {
    $scope.controllerName = 'CallbackController';
    $scope.message = $routeParams;
 })

.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/customers', {
    templateUrl: 'customers.html',
    controller: 'CustomersController'
  })
  .when('/callback', {
    templateUrl: 'index.html',
    controller: 'CallbackController'
  });
  /*
  .otherwise({
    templateUrl: 'index.html',
    controller: 'MainController'
  });
  */

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});
})(window.angular);

/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
