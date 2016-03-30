

(function(){
	"use strict";

	function MainCtrl($scope){
		var MainCtrl = this;

		MainCtrl.image = '';
		MainCtrl.clearCanvas = function() {
			$scope.$broadcast('tb.freedraw.clear');
		}
	}

	angular	.module('app')
			.controller('MainCtrl', ['$scope', MainCtrl]);



})();