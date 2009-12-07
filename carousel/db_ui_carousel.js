YUI.add('db-ui-carousel', function(Y){

		var _Cn = Y.ClassNameManager.getClassName;
		var CURRENT_CLASS = _Cn('carousel', 'current');
		var BTN_NEXT_CLASS = _Cn('carousel', 'btn','next');
		var BTN_PREV_CLASS = _Cn('carousel', 'btn', 'prev');
		var BTN_DISABLE_CLASS = _Cn('carousel', 'dis');
		var BTN_DOT_CLASS = _Cn('carousel', 'switchdot');

	var Carousel = function(config){
		  Carousel.superclass.constructor.apply(this, arguments);
		};

	Y.mix(Carousel, {
			
     NAME: 'carousel',

     ATTRS: {

		currentIndex: { value: 0 },

		contentItems: null,

		switchNode: null,

		effect:  { value: 'easeOutStrong' },

		duration:  { value: 0.5 },
		
		intervalTime: { value: 0 },
		
		isLoop: { value: false },

		strings: {
			value: {
					next: '前进',
					back: '后退'
				 }
		 }
	},

HTML_PARSER: {
	contentItems: function(contentBox){
	  return contentBox.all('.bd ul');
	} 
},

TEMPL_CONTROL: '<div class="' + _Cn('carousel', 'switch') + '"><span class="' + BTN_NEXT_CLASS + '"><a href="#" title="{NEXT_TITLE}" hidefocus="ture">&gt;</a></span><span class="' + BTN_PREV_CLASS + '"><a class="' + BTN_DISABLE_CLASS + '" href="#" title="{BACK_TITLE}" hidefocus="ture">&lt;</a></span><ul class="' + BTN_DOT_CLASS + '">{ITEMS}</ul></div>'
});

Y.extend(Carousel, Y.Widget, {

initializer: function(){},

destructor: function(){
 this.switchButtons[0] = null;
 this.switchButtons[1] = null;
 this.itemsContainer = null;
 if(this._timer){
	this._timer.cancel();
 }
},

renderUI: function(){
 this._uiCreateSwitch();
 var switchNode = this.get('switchNode'), 
 items_cn = _Cn('carousel', 'items'), 
 itemsNode, unit,  
 items = this.get('contentItems'),
 bdNode = this.get('contentBox').one('.bd');
 this.switchButtons = [switchNode.one('.' + BTN_NEXT_CLASS + ' a'), switchNode.one('.' + BTN_PREV_CLASS + ' a')];
 this.itemsContainer = itemsNode = Y.Node.create('<div class="' + items_cn + '"></div>').append(items);
 this.stepUnit = unit = bdNode.get('region').width;
 bdNode.appendChild(itemsNode.setStyle('width', (unit * items.size() + 200) + 'px'));
},

bindUI: function(){
  this.after('currentIndexChange', this._afterCurrentIndexChange);
  this.switchButtons[0].on('click', Y.bind(this._handleNextClick, this));
  this.switchButtons[1].on('click', Y.bind(this._handlePrevClick, this));
  this.get('switchNode').delegate('click', Y.bind(this._handleDotClick, this), 'li a');

  var intervalTime = this.get('intervalTime');
  if(intervalTime){
	this.get('contentBox').on('mouseover', Y.bind(this._handleMouseOver, this));
	this.get('contentBox').on('mouseout', Y.bind(this._handleMouseOut, this));
	this.set('isLoop', true);
	this._timer = Y.later(intervalTime * 1000, this, function(){
		if(this._pause){
			return;
		}
		this._handleNextClick();
	}, null, true);
  }
},

syncUI: function(){
	this._updateSwitchDot();
	this._updateSwitchButton();
	this._show(this.get('currentIndex'));
},

_uiCreateSwitch: function(){
  var box = this.get('contentBox'), items = this.get('contentItems'), l = n = items.size(), lis = [], strings = this.get('strings'), switchNode, hd = box.one('.hd');
	items.addClass(_Cn('carousel', 'item'));
	if(this.get('switchNode')){
		return;
	}
	while(n--){
		lis.push('<li><a href="#">' + (l - n) + '</a></li>');
	}
  switchNode = Y.Node.create(Carousel.TEMPL_CONTROL.replace('{ITEMS}', lis.join('')).replace('{NEXT_TITLE}', strings.next).replace('{BACK_TITLE}', strings.back));
	this.set('switchNode', switchNode);
	if(!hd){
		box.prepend(Y.Node.create('<div class="hd"></div>').append(switchNode));
	}else{
    box.one('.hd').append(switchNode);
	}
	switchNode.one('li').addClass(CURRENT_CLASS);
},

_show: function(n){
	var dist = -1 * n * this.stepUnit + 'px';
	var anim = new Y.Anim({
      node: this.itemsContainer,
      to: {
		  left: dist 
	  },
	  easing: Y.Easing[this.get('effect')],
      duration: this.get('duration') 
	});
	anim.run();
},

_afterCurrentIndexChange: function(e){
	this._updateSwitchButton();
	this._updateSwitchDot();
	this._show(this.get('currentIndex'));
},

_updateSwitchButton: function(){
  Y.each(this.switchButtons, function(n){ 
	 n.removeClass(BTN_DISABLE_CLASS); 
  });

  if(this.get('isLoop')){
	return;
  }

  var currentIndex = this.get('currentIndex');
	if(currentIndex === 0){
		this.switchButtons[1].addClass(BTN_DISABLE_CLASS);
	}else if(currentIndex === this.get('contentItems').size() - 1){
		this.switchButtons[0].addClass(BTN_DISABLE_CLASS);
	}
},

_updateSwitchDot: function(){
  var dots = this.get('switchNode').all('li'), currentIndex = this.get('currentIndex');
	dots.removeClass(CURRENT_CLASS);
	dots.each(function(n, i){
			if(i === currentIndex){
			  n.addClass(CURRENT_CLASS);
			}
	});
},

_handleMouseOver: function(){
	this._pause = true;
},

_handleMouseOut: function(){
	this._pause = false;
},

_handleNextClick: function(e){
	Y.log(e);
	var currentIndex = this.get('currentIndex'), n = this.get('contentItems').size();
	if(e){
		e.preventDefault();
    }
	if(this.get('isLoop') && this.get('currentIndex') === (n - 1)){
		this.set('currentIndex', 0);
		return;
	}
	this.set('currentIndex', (currentIndex + 1 < n)? currentIndex + 1 : n - 1);
},

_handlePrevClick: function(e){
	var currentIndex = this.get('currentIndex');
	if(e){
		e.preventDefault();
    }
	if(this.get('isLoop') && this.get('currentIndex') === 0){
		this.set('currentIndex', this.get('contentItems').size() - 1);
		return;
	}
	this.set('currentIndex', (currentIndex - 1 < 0)? 0 : currentIndex - 1);
},

_handleDotClick: function(e){
	e.preventDefault();
	this.set('currentIndex', (e.currentTarget.get('innerHTML')|0) - 1);
}

});

Y.namespace("ui");
Y.ui.Carousel = Carousel;


},
'0.0.1',
{requires: ['db-ui-carousel-skin','widget','anim-base', 'anim-easing']}
);