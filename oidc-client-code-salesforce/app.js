var app = angular.module("app", ['ui.router']);
var REDIRECT_URL = "https://kurtkanaskie.github.io/oidc-client-code-salesforce/callback.html";
var OIDC_BASEPATH = "https://kurtkanaskietrainer-trial-test.apigee.net/oidc-salesforce/v1";
var API_HOST = "https://kurtkanaskietrainer-trial-test.apigee.net";
var CLIENT_ID = "D8OGrhQ5YHZfLLg2lJanfU6qw48qAI6X";
var CLIENT_SECRET = "q2ZrmyRKvdmbWaGX";


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
        .state('userinfo', {
            url: '/userinfo',
            templateUrl: 'userinfo.html',
            controller: 'UserinfoController'
        })
        .state('ping', {
            url: '/ping',
            templateUrl: 'ping.html',
            controller: 'PingstatusPingController'
        });
    $urlRouterProvider.otherwise('/home');
});
 
app.controller("HomeController", function($scope, $state, $window) {
    console.log( "HomeController" );
 
    var url = $window.location.href;
    var redirect = url.replace("index.html#/home","callback.html");
    console.log( "REPLACE REDIRECT: " + redirect);
    // This is the oidc-v1-salesforce-test app: D8OGrhQ5YHZfLLg2lJanfU6qw48qAI6X, q2ZrmyRKvdmbWaGX
    var authorize = OIDC_BASEPATH + "/authorize" 
        + "?client_id=" + CLIENT_ID
        + "&client_secret=" + CLIENT_SECRET
		+ "&redirect_uri=" + REDIRECT_URL
		+ "&response_type=code"
		+ "&state=PA"
		+ "&scope=openid profile refresh_token";

    console.log( "URL: " + url );
    console.log( "REDIRECT: " + redirect);
    console.log( "AUTHORIZE: " + authorize );

    $scope.login = function() {
        $window.location.href = authorize;
    };
    $scope.logout = function() {
        $window.localStorage.setItem("oidc", "");
        $state.reload();
    };

    var oidc = $window.localStorage.getItem("oidc");
    if( oidc === null || oidc === "" ) {
        $scope.inOrOut = "out";
    } else {
		$scope.inOrOut = "in";
	}
 
});

app.controller("PingstatusPingController", function($scope, $http, $window) {
    console.log( "PingstatusPingController" );
 
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
            url : API_HOST + "/pingstatus-salesforce/v1/ping"
        }).then(function successCallback(response) {
          // console.log( "Ping OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.ping = JSON.stringify(response.data, undefined, 2);
        }, function errorCallback(response) {
          // console.log( "Ping ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = response.statusText;
          $scope.customers = [];
        });
    }
 
});

app.controller("UserinfoController", function($scope, $http, $window) {
    console.log( "UserinfoController" );
 
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
          url : API_HOST + "/oidc-salesforce/v1/userinfo"
      }).then(function successCallback(response) {
        // console.log( "Profile OK: " + response.status + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = "OK";
        $scope.userinfo = JSON.stringify(response.data, undefined, 2);
      }, function errorCallback(response) {
        // console.log( "Profile ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = response.statusText;
        $scope.userinfo = {};
      });
    }
 
});

app.controller("CallbackController", function($scope, $http, $window) {
    console.log( "CallbackController" );

    var oidc = $window.localStorage.getItem("oidc");
    // local storage can only hold strings, if not set "null"
    if( oidc === null || oidc === "" ) {
      $scope.status = 401;
      $scope.message = "You are not authorized";
    } else {
      var code = JSON.parse($window.localStorage.getItem("oidc")).oauth.code;
  		var data = { 
  			client_id:CLIENT_ID,
  			client_secret:CLIENT_SECRET,
  			grant_type:'authorization_code',
  			code:code,
        redirect_uri:REDIRECT_URL
  		};
      var fpdata = Object.keys(data).map((key) => { 
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]); 
      }).join('&');

  		console.log( "FPDATA: " + JSON.stringify(fpdata));

  		$http({
  			headers: {"Content-Type":"application/x-www-form-urlencoded"},
  			method : "POST",
  			url : OIDC_BASEPATH + "/token",
  			data : fpdata
  		}).then(function successCallback(response) {
        console.log( "POST /token request: " + OIDC_BASEPATH + "/token" );
        console.log( "POST /token OK: " + response.status);
        console.log( "POST /token response: " + JSON.stringify(response.data) );
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
  		  $scope.message = response.statusText;
  		  $scope.tokenResponse = {};
  			window.localStorage.setItem("oidc", "");
  			alert("Problem getting access_token");
  		});
    }
    var url = $window.location.href;
    var gohome = url.replace("#/callback","#/home");
    $window.location.href = gohome;
});
