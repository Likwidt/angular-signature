(function(){
	"use strict";

	function CanvasCtrl( $scope, SignatureFactory ){
		var ctrl = this;

		ctrl.setImage = SignatureFactory.setImage;

		ctrl.clearCanvas = function(){
			var canvasCoords = $scope.canvasElem.getBoundingClientRect(),
				canvasContext = $scope.canvasElem.getContext('2d');
			canvasContext.clearRect ( 0 , 0 , canvasCoords.width , canvasCoords.height );
			SignatureFactory.setImage($scope.canvasElem.toDataURL('image/png'));
		}

		
	}

	function signatureCanvasHandler(scope, element, attrs, ctrl){
		var canvas = element[0];

		if (canvas.nodeName === 'CANVAS') {
			initCanvas();
		}

		function initCanvas() {

			var context = canvas.getContext('2d'); //context

			// draw function
			function draw (e){
				var event = e.changedTouches[0],
					canvasPosition = canvas.getBoundingClientRect();
				e.preventDefault();
				context.lineTo( ( event.clientX - canvasPosition.left ), ( event.clientY - canvasPosition.top ) ); // point to relative position
				context.stroke();		
			}

			function stopDrawing (e){	
				canvas.removeEventListener('touchmove', draw, false); //remove draw command			
				//point link to new image file as soon as finished drawing
				ctrl.setImage(canvas.toDataURL('image/png')); 
			}	

			function initDraw(e) {
				var event = e.changedTouches[0];
				context.moveTo(event.pageX, event.pageY); //place context
				context.beginPath(); //begin path
				canvas.addEventListener('touchmove', draw, false); //draw line on move event
				canvas.addEventListener('touchend', stopDrawing, false); //stop drawing on end event
				canvas.addEventListener('touchleave', stopDrawing, false); //stop drawing on out event
			}


			// initiate drawing on start event		
			canvas.addEventListener('touchstart', initDraw, false);
			scope.canvasElem = canvas;

			function cropImageFromCanvas(ctx, canvas) {
				var newCanvas = canvas,
					newContext = ctx,
				  	canvasWidth = newCanvas.width,
					canvasHeight = newCanvas.height,
					pix = {x:[], y:[]},
					imageData = newContext.getImageData(0,0,canvasWidth,canvasHeight),
					x, y, index;

				for (y = 0; y < canvasHeight; y++) {
				    for (x = 0; x < canvasWidth; x++) {
				        index = (y * canvasWidth + x) * 4;
				        if (imageData.data[index+3] > 0) {

				            pix.x.push(x);
				            pix.y.push(y);

				        }   
				    }
				}

				pix.x.sort(function(a,b){return a-b});
				pix.y.sort(function(a,b){return a-b});
				var n = pix.x.length-1;

				canvasWidth = pix.x[n] - pix.x[0];
				canvasHeight = pix.y[n] - pix.y[0];
				var cut = newContext.getImageData(pix.x[0], pix.y[0], canvasWidth, canvasHeight);

				newCanvas.width = canvasWidth;
				newCanvas.height = canvasHeight;
				newContext.putImageData(cut, 0, 0);

				var image = newCanvas.toDataURL('image/png');
				return image;

			}


			//set canvas size to max

			/*window.onresize = function(e){
				var width = window.innerWidth * 0.8;
				var height = window.innerHeight / 4;
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
			}
			
			$(window).trigger('resize');*/

			

		}

	}

	function SignatureFactory ($rootScope){
		var factory = {};

		factory.image = {src: ''};
		factory.setImage = setImage;

		function setImage( newImage ){
			$rootScope.$apply(function() {
				factory.image.src = newImage;
			});
		}

		return factory;
	}



	angular.module('angular-signature', [])
		.controller('CanvasCtrl', ['$scope', 'SignatureFactory', CanvasCtrl])
		.factory('SignatureFactory', ['$rootScope', SignatureFactory])
		.directive('signatureCanvas', [function() {    
		    return {
		      restrict: 'A',
		      replace: false,
		      scope: { signature : '=' },
		      controller: 'CanvasCtrl',
		      controllerAs: 'canvas',
		      link: signatureCanvasHandler
		    };
		}]);		

})();