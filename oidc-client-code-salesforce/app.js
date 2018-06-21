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
        .state('identity', {
            url: '/id',
            templateUrl: 'profile.html',
            controller: 'ProfileController'
        })
        .state('ping', {
            url: '/ping',
            templateUrl: 'ping.html',
            controller: 'PingstatusPingController'
        });
    $urlRouterProvider.otherwise('/home');
});
 
app.controller("HomeController", function($scope, $state, $window) {
 
    var url = $window.location.href;
    var redirect = url.replace("index.html#/home","callback.html");
    // This is the oidc-v1-salesforce-test app: D8OGrhQ5YHZfLLg2lJanfU6qw48qAI6X, q2ZrmyRKvdmbWaGX
    var authorize = "https://kurtkanaskietrainer-trial-test.apigee.net/oidc-salesforce/v1/authorize" 
        + "?client_id=D8OGrhQ5YHZfLLg2lJanfU6qw48qAI6X"
        + "&client_secret=q2ZrmyRKvdmbWaGX"
		+ "&redirect_uri=" + redirect
		+ "&response_type=code"
		+ "&state=PA"
		+ "&scope=openid profile refresh_token";

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

app.controller("PingstatusPingController", function($scope, $http, $window) {
 
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
            url : "https://kurtkanaskietrainer-trial-test.apigee.net/pingstatus-salesforce/v1/ping"
        }).then(function successCallback(response) {
          // console.log( "Ping OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.ping = response.data;
        }, function errorCallback(response) {
          // console.log( "Ping ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = response.statusText
          $scope.customers = [];
        });
    }
 
});

app.controller("ProfileController", function($scope, $http, $window) {
 
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
            url : "https://kurtkanaskietrainer-trial-test.apigee.net/oidc-salesforce/v1/id"
        }).then(function successCallback(response) {
          // console.log( "Profile OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.profile = response.data;
        }, function errorCallback(response) {
          // console.log( "Profile ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
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
			client_id:'D8OGrhQ5YHZfLLg2lJanfU6qw48qAI6X',
			client_secret:'q2ZrmyRKvdmbWaGX',
			grant_type:'authorization_code',
			code:code,
            redirect_uri:'https://kurtkanaskie.github.io/oidc-client-code-salesforce/callback.html'
		};

		console.log( "FPDATA: " + JSON.stringify(fpdata));

		$http({
			headers: {"Content-Type":"application/x-www-form-urlencoded"},
			method : "POST",
			url : "https://kurtkanaskietrainer-trial-test.apigee.net/oidc-salesforce/v1/token",
			data : fpdata
		}).then(function successCallback(response) {
		  console.log( "POST /token OK: " + response.status + JSON.stringify(response.data) );
		  $scope.status = response.status;
		  $scope.message = "OK";
		  $scope.tokenResponse = response.data;

			var oidc = {
				oauth: {
					access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token
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
