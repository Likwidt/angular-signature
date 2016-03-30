(function(){
	"use strict";

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
				setImage(canvas.toDataURL('image/png')); 
			}	

			function initDraw(e) {
				var event = e.changedTouches[0];
				context.moveTo(event.pageX, event.pageY); //place context
				context.beginPath(); //begin path
				canvas.addEventListener('touchmove', draw, false); //draw line on move event
				canvas.addEventListener('touchend', stopDrawing, false); //stop drawing on end event
				canvas.addEventListener('touchleave', stopDrawing, false); //stop drawing on out event
			}

			function setImage(newImage) {
				scope.$apply(function() {
					scope.signature = newImage;
				});
				
			}

			function clearCanvas() {
				var canvasCoords = canvas.getBoundingClientRect(),
					canvasContext = canvas.getContext('2d');
				canvasContext.clearRect ( 0 , 0 , canvasCoords.width , canvasCoords.height );
				setImage(canvas.toDataURL('image/png'));
			}


			// initiate drawing on start event		
			canvas.addEventListener('touchstart', initDraw, false);

		}

	}

	angular.module('angular-signature', [])
		.directive('signatureCanvas', [function() {    
		    return {
		      restrict: 'A',
		      scope: { signature : '=' },
		      link: signatureCanvasHandler
		    };
		}]);		

})();