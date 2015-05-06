(function(){
	"use strict";

	function CanvasCtrl( $scope, SignatureFactory ){
		var CanvasCtrl = this;

		CanvasCtrl.clearCanvas = function(){
			SignatureFactory.setImage('');
			var canvasCoords = $scope.canvasElem.getBoundingClientRect(),
				canvasContext = $scope.canvasElem.getContext('2d');
			canvasContext.clearRect ( 0 , 0 , canvasCoords.width , canvasCoords.height );
			$scope.$apply();
		}

		CanvasCtrl.saveSignature = function( newImage ){
			SignatureFactory.setImage(newImage);
			$scope.$apply();
		}
	}

	function signatureCanvasHandler(scope, element, attrs, controllers){
		var canvas = element.context.querySelector('canvas'), //canvas,
			context = canvas.getContext('2d'); //context

		function cropImageFromCanvas(ctx, canvas) {
			var newCanvas = canvas,
				newContext = ctx;

			var w = newCanvas.width,
				h = newCanvas.height,
				pix = {x:[], y:[]},
				imageData = newContext.getImageData(0,0,newCanvas.width,newCanvas.height),
				x, y, index;

			for (y = 0; y < h; y++) {
			    for (x = 0; x < w; x++) {
			        index = (y * w + x) * 4;
			        if (imageData.data[index+3] > 0) {

			            pix.x.push(x);
			            pix.y.push(y);

			        }   
			    }
			}

			pix.x.sort(function(a,b){return a-b});
			pix.y.sort(function(a,b){return a-b});
			var n = pix.x.length-1;

			w = pix.x[n] - pix.x[0];
			h = pix.y[n] - pix.y[0];
			var cut = newContext.getImageData(pix.x[0], pix.y[0], w, h);

			newCanvas.width = w;
			newCanvas.height = h;
			newContext.putImageData(cut, 0, 0);

			var image = newCanvas.toDataURL();
			return image;

		}


		//set canvas size to max

		window.onresize = function(e){
			var width = window.innerWidth * 0.8;
			var height = window.innerHeight / 4;
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
		}
		
		$(window).trigger('resize');

		// TODO: find better way to suspend scrolling 
		canvas.ontouchmove = function(e){ 
    		e.preventDefault(); 
		}	

				// draw function
		function draw (e){
			var event = e.changedTouches[0],
				canvasPosition = canvas.getBoundingClientRect();
			context.lineTo( ( event.pageX - canvasPosition.left ), ( event.pageY - canvasPosition.top ) ); // point to relative position
			context.stroke();		
		}

		function stopDrawing (e){		
			canvas.removeEventListener('touchmove', draw, false); //remove draw command			
			//point link to new image file as soon as finished drawing
			controllers.saveSignature(canvas.toDataURL('image/png')); 
		}	


		// initiate drawing on start event		
		canvas.addEventListener('touchstart', function(e){
			var event = e.changedTouches[0];
			context.moveTo(event.pageX, event.pageY); //place context
			context.beginPath(); //begin path
			canvas.addEventListener('touchmove', draw, false); //draw line on move event
			canvas.addEventListener('touchend', stopDrawing, false); //stop drawing on end event
			canvas.addEventListener('touchleave', stopDrawing, false); //stop drawing on out event
		}, false);

		scope.canvasElem = canvas;

	}

	function SignatureFactory ( ){
		var SignatureFactory = this;

		SignatureFactory.image = {
			src: ''
		};

		SignatureFactory.setImage = function( newImage ){
			SignatureFactory.image.src = newImage;

		};

		return SignatureFactory;

	}



	angular.module('angular-signature', [])
		.controller('CanvasCtrl', ['$scope', 'SignatureFactory', CanvasCtrl])
		.factory('SignatureFactory', [SignatureFactory])
		.directive('signatureCanvas', [function() {    
		    return {
		      restrict: 'E',
		      transclude: true,
		      scope: { signature : '=' },
		      controller: 'CanvasCtrl',
		      controllerAs: 'canvas',
		      template:[
		      	'<div style="position:relative">',
		      		'<canvas id="myCanvas" height="300"></canvas>',
		      		'<div class="signature-canvas-btn signature-canvas-btn-left" ng-click="canvas.clearCanvas()">',
		      			'<button type="button" class="btn btn-default btn-lg">',
		      				'<span class="glyphicon glyphicon-repeat"></span>',
		      			'</button>',
		      		'</div>',
		      	'</div>'
		      ].join(''),
		      link: signatureCanvasHandler
		    };
		}]);		

})();