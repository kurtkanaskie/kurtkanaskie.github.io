var app = angular.module("app", ['ui.router']);

var REDIRECT_URL = "https://kurtkanaskie.github.io/oidc-client-code-okta-2019-06-06/callback.html";
var API_HOST = "https://amer-demo13-test.apigee.net";
var OIDC_BASEPATH = API_HOST + "/okta-trial/v1/oauth";
// App = pingstatus-oidc-v1-okta-trial-app-test
var CLIENT_ID = "RctL2S53lGyA8yA8zGRmBbg2HJb642gp";
var CLIENT_SECRET = "iB7rciCeMZ6AzHX2";


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
 
app.controller("HomeController", function($scope, $http, $state, $window) {
    console.log( "HomeController" );
 
    var url = $window.location.href;
    var redirect = url.replace("index.html#/home","callback.html");
    var authorize = OIDC_BASEPATH + "/authorize" 
        + "?client_id=" + CLIENT_ID
        + "&client_secret=" + CLIENT_SECRET
    + "&redirect_uri=" + REDIRECT_URL
    + "&response_type=code"
    + "&state=PA-code"
    + "&scope=EDGE-READ EDGE-WRITE CODE";

    console.log( "URL: " + url );
    console.log( "REDIRECT: " + redirect);
    console.log( "AUTHORIZE: " + authorize );

    $scope.login = function() {
        $window.location.href = authorize;
    };
    $scope.logout = function() {
        var token = JSON.parse($window.localStorage.getItem("oidc")).oauth.access_token;
        /*
        $window.localStorage.setItem("oidc", "");
        var logout = OIDC_BASEPATH + "/logout?access_token=" + token;
        $window.location.href = logout;
        */

        $http({
            headers: {"Authorization":"Bearer " + token},
            method : "GET",
            url : OIDC_BASEPATH + "/logout"
        }).then(function successCallback(response) {
          console.log( "Logout OK: " + response.status + JSON.stringify(response.data) );
        }, function errorCallback(response) {
          console.log( "Logout ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
        });

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
            url : API_HOST + "/pingstatus-oauth/v1/ping"
        }).then(function successCallback(response) {
          // console.log( "Ping OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.ping = JSON.stringify(response.data, undefined, 2);
        }, function errorCallback(response) {
          // console.log( "Ping ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = response.statusText;
          $scope.ping = {};
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
          url : OIDC_BASEPATH + "/userinfo"
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
