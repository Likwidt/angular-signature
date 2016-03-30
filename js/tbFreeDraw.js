(function(){
	"use strict";

	angular.module('tb-free-draw', [])
		.directive('tbFreeDraw', ['$timeout', function($timeout) {    
			return {
				restrict: 'A',
				scope: { drawTo : '=' },
				link: function freeDrawCanvasHandler(scope, element){
					var canvas = element[0];

					if (canvas.nodeName === 'CANVAS') {
						initCanvas();
					}

					function initCanvas() {

						var context = canvas.getContext('2d'); //context

						function preventDefault(e) {
							e.preventDefault();
						}

						// draw function
						function draw (e){
							var event = e.changedTouches ? e.changedTouches[0] : e,
								canvasPosition = canvas.getBoundingClientRect();
							context.lineTo( ( event.clientX - canvasPosition.left ), ( event.clientY - canvasPosition.top ) ); // point to relative position
							context.stroke();		
						}

						function stopDrawing (){	
							canvas.removeEventListener('touchmove', draw); //remove draw command	
							canvas.removeEventListener('touchend', stopDrawing); //stop drawing on end event
							canvas.removeEventListener('touchleave', stopDrawing); //stop drawing on out event
							canvas.removeEventListener('mousemove', draw); //draw line on move event
							canvas.removeEventListener('mouseup', stopDrawing); //stop drawing on end event
							canvas.removeEventListener('mouseout', stopDrawing); //stop drawing on out event
							window.removeEventListener('touchmove', preventDefault); //remove scrolling precaution	
							//point link to new image file as soon as finished drawing
							setImage(canvas.toDataURL('image/png')); 
						}	

						function initDraw(e) {
							var event = e.changedTouches ? e.changedTouches[0] : e;
							context.moveTo(event.pageX, event.pageY); //place context
							context.beginPath(); //begin path
							canvas.addEventListener('touchmove', draw, false); //draw line on move event
							canvas.addEventListener('touchend', stopDrawing, false); //stop drawing on end event
							canvas.addEventListener('touchleave', stopDrawing, false); //stop drawing on out event
							canvas.addEventListener('mousemove', draw, false); //draw line on move event
							canvas.addEventListener('mouseup', stopDrawing, false); //stop drawing on end event
							canvas.addEventListener('mouseout', stopDrawing, false); //stop drawing on out event
							window.addEventListener('touchmove', preventDefault, false);
						}

						function setImage(newImage) {
							scope.$apply(function() {
								scope.drawTo = newImage;
							});
						}

						function clearCanvas() {
							var canvasCoords = canvas.getBoundingClientRect(),
								canvasContext = canvas.getContext('2d');
							canvasContext.clearRect ( 0 , 0 , canvasCoords.width , canvasCoords.height );
							$timeout(function() {setImage(canvas.toDataURL('image/png'))}, 0);
						}

						scope.$on('tb.freedraw.clear', clearCanvas);

						// initiate drawing on start event		
						canvas.addEventListener('touchstart', initDraw, false);
						canvas.addEventListener('mousedown', initDraw, false);
					}
				}
			};
		}]);		
})();