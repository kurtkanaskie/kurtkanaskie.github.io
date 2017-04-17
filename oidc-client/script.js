(function(angular) {
  'use strict';
angular.module('ngRouteExample', ['ngRoute'])

 .controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.controllerName = 'MainController';
	$scope.message = "Click to authorize then view customers.";
	$scope.authorize = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-client&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
 })

 /*
 https://kurtkanaskie.github.io/oidc-client/callback
    #state=A
    &id_token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdG1vYmlsZWgtc2IwNS5hcGlnZWUubmV0Iiwic3ViIjoiYm9laW5nYmlsbHVzZXJAdC1tb2JpbGUuY29tIiwiYXVkIjoiQU83d2YyNENGc3dKZVg2VW1hS2RiUmNKMXVoTUphb2giLCJleHAiOjE0OTI0NDIyMjYsIm5vbmNlIjoiMTQ5MjQ0MTYzODE0MyIsImlhdCI6MTQ5MjQ0MTY2MH0.rzs5rek9n8GImp0wYNKT3DFOv3geo7x40om-jm2YggI
    &access_token=mPqpPz5tGjme1gd0Am6UA9n93HLl
    &expires=599
    &token_type=Bearer
 */

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

 .controller('CallbackController', function($rootScope, $scope, $location) {
    $scope.controllerName = 'CallbackController';
    $scope.message = $routeParams;
    var hash = $location.path().substr(1);
    
    var splitted = hash.split('&');
    var params = {};
    
    for (var i = 0; i < splitted.length; i++) {
        var param  = splitted[i].split('=');
        var key    = param[0];
        var value  = param[1];
        params[key] = value;
        $rootScope.accesstoken=params;
    }
    $location.path("/");
 })

.config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
    controller: 'MainController'
  })
   .when('/customers', {
    templateUrl: 'customers.html',
    controller: 'CustomersController'
  })
  .when('/access_token="accessToken', {
    templateUrl: '',
    controller: 'CallbackController'
  });
  /*
  .otherwise({
    templateUrl: 'home.html',
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
