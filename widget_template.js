YUI().use('widget', function(Y){
	
	
		var Carousel = function(config){
		  Carousel.superclass.constructor.apply(this, arguments);
		};

		Y.mix(Carousel, {
     		NAME: 'carousel',
     		ATTRS: {}
		});

		Y.extend(Carousel, Y.Widget, {
			initializer: function(){
				Y.log('initializer');
			},
			destructor: function(){
				Y.log('destructor');
			},
			renderUI: function(){
				Y.log('renderUI');
			},
			bindUI: function(){
				Y.log('bindUI');
			},
			syncUI: function(){
				Y.log('syncUI');
			}
		});






/*
	 ATTRS
	 initializer
*/

var carou = new Carousel({
		contentBox: '#glide1'
});

/*
	 renderUI()
	 bindUI()
	 syncUI()

*/
carou.render();

/*
   destructor()
*/
carou.destroy();
