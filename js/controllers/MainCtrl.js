

(function(){
	"use strict";

	function MainCtrl( SignatureFactory ){
		var MainCtrl = this;

		MainCtrl.image = SignatureFactory.image;
		//MainCtrl.setImage = SignatureFactory.setImage;
	}

	angular	.module('app')
			.controller('MainCtrl', ['SignatureFactory', MainCtrl]);



})();