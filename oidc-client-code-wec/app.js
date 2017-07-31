var app = angular.module("app", ['ui.router']);
 
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('callback', {
            url: '/callback',
            templateUrl: 'callback.html',
            controller: 'CallbackController'
        })
        .state('customers', {
            url: '/customers',
            templateUrl: 'customers.html',
            controller: 'CustomersController'
        });
    $urlRouterProvider.otherwise('/home');
});
 
app.controller("HomeController", function($scope, $state, $window) {
 
    var url = $window.location.href;
    var redirect = url.replace("index.html#/home","callback.html");
    // This is the Demo-Azure-OIDC-Code app: wkDnvYG73mmiSCdJqkxZELfkzLZ7YqJu
    var authorize = "https://wec-nonprod-dev.apigee.net/azure-b2c/authorize" 
		+ "?client_id=wkDnvYG73mmiSCdJqkxZELfkzLZ7YqJu"
		+ "&redirect_uri=" + redirect
		+ "&response_type=code"
		+ "&state=A"
		+ "&scope=openid+profile&nonce=" + Date.now();

	console.log( "URL: " + url + " REDIRECT: " + redirect + " AUTHORIZE: " + authorize );
    $scope.login = function() {
        $window.location.href = authorize;
    }
    $scope.logout = function() {
        $window.localStorage.setItem("oidc", "");
        $state.reload();
    }

    var oidc = $window.localStorage.getItem("oidc");
    if( oidc === null || oidc === "" ) {
        $scope.inOrOut = "out";
    } else {
		$scope.inOrOut = "in";
	}
 
});

app.controller("CustomersController", function($scope, $http, $window) {
 
    var oidc = $window.localStorage.getItem("oidc");
    // local storage can only hold strings, if not set "null"
    if( oidc === null || oidc === "" ) {
          $scope.status = 401;
          $scope.message = "You are not logged in";
    } else {

        var token = JSON.parse($window.localStorage.getItem("oidc")).oauth.access_token;

        $http({
            headers: {"Authorization":"Bearer " + token},
            method : "GET",
            url : "https://wec-nonprod-dev.apigee.net/v1/customers"
        }).then(function successCallback(response) {
          // console.log( "Customers OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.customers = response.data.customers;
        }, function errorCallback(response) {
          // console.log( "Customers ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = response.statusText
          $scope.customers = [];
        });
    }
 
});

app.controller("CallbackController", function($scope, $http, $window) {
 
    var oidc = $window.localStorage.getItem("oidc");
    // local storage can only hold strings, if not set "null"
    if( oidc === null || oidc === "" ) {
          $scope.status = 401;
          $scope.message = "You are not authorized";
    } else {

        var code = JSON.parse($window.localStorage.getItem("oidc")).oauth.code;
		var fpdata = { 
			client_id:'wkDnvYG73mmiSCdJqkxZELfkzLZ7YqJu',
			client_secret:'s9QFxne0ghxLLsnS',
			grant_type:'authorization_code',
			code:parameterMap.code
		};

		console.log( "FPDATA: " + JSON.stringify(fpdata));

		$http({
			headers: {"Content-Type":"application/x-www-form-urlencoded"},
			method : "POST",
			url : "https://wec-nonprod-dev.apigee.net/azure-b2c/token",
			data : fpdata
		}).then(function successCallback(response) {
		  console.log( "POST /token OK: " + response.status + JSON.stringify(response.data) );
		  $scope.status = response.status;
		  $scope.message = "OK";
		  $scope.tokenResponse = response.data;

			var oidc = {
				oauth: {
					code: parameterMap.code,
					state: parameterMap.state,
					scope: parameterMap.scope,
					access_token: response.data.access_token
				}
			};
			window.localStorage.setItem("oidc", JSON.stringify(oidc));
			console.log( "OIDC: " + JSON.stringify(oidc));
		}, function errorCallback(response) {
		  console.log( "POST /token ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
		  $scope.status = response.status;
		  $scope.message = response.statusText
		  $scope.tokenResponse = {};
			window.localStorage.setItem("oidc", "");
			alert("Problem getting access_token");
		});

    }
 
});
