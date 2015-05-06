"use strict";

(function(){
	function appConfig( $compileProvider, $stateProvider, $urlRouterProvider ){

		// Un comment if you need to include link to mail, skype, phone or other
		//$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|tel):/);

		// For any unmatched url, redirect to /home
  		$urlRouterProvider.otherwise("/home");

  		$stateProvider
  			.state('home', { url: "/home", templateUrl: "views/home.html" });

	}

	angular.module('app', ['ngResource', 'ui.router', 'ui.bootstrap', 'angular-signature'])
		.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', appConfig]);

})();