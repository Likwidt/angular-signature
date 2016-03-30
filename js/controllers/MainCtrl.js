

(function(){
	"use strict";

	function MainCtrl(){
		var MainCtrl = this;

		MainCtrl.image = '';
		MainCtrl.clearCanvas = function() {
			MainCtrl.image = null;
		}
	}

	angular	.module('app')
			.controller('MainCtrl', [MainCtrl]);



})();