

(function(){
	"use strict";

	function MainCtrl(){
		var MainCtrl = this;

		MainCtrl.image = '';
	}

	angular	.module('app')
			.controller('MainCtrl', [MainCtrl]);



})();