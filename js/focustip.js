/*
 * FocusTip v1
 * http://pooyarm.github.io/FocusTip/
 *
 * Created by Pooya Rostam
 * http://1pooya.com/
 * https://github.com/pooyarm
 */
var FocusTip = function(opt){
	this.options = {
		color: '#008dbc',
		target: '',
		text: '',
		textColor: '#FFF',
		width: 100,
		height: 100,
		delay: 100,
		ok: 'Got it',
		callback: function(){}
	};
	this.el = false;
	this.close = false;
	this.uniqueClass = null;
	var $this = this;

	if(
		typeof opt == 'undefined'
		|| typeof opt.target != 'object'
		|| opt.target.length == 0
		|| typeof opt.text == 'undefined'
		)
		return false;

	$.extend(this.options, opt);

	this.init = function(){
		this.initElement();
		this.close.on('click',this.destroy);
		$(window).on('resize.focustip_'+this.uniqueClass,function(){
			$this.initPosition(true);
		});
	};

	this.initElement = function(){
		this.el = $("<div></div>").addClass('focusTip');
		this.uniqueClass = 'focusTip_' + Math.floor(Math.random() * 26) + Date.now();
		this.el.addClass(this.uniqueClass);
		this.el.html("<div><p>"+this.options.text+"</p><a href='javascript:void(0);' class='ok'>"+this.options.ok+"</a></div>");
		this.close = this.el.find("a.ok");
		$("body").addClass('focusTipfix');
		$.when(this.initScroll()).done(function(){
			$this.initPosition();
			$this.initColor();
			$("body").append($this.el);
			$this.el.delay($this.options.delay).fadeIn('fast');
		});
	};

	this.initPosition = function(animate){
		if(typeof animate == 'undefined') animate = false;
		var tPos 	= this.options.target.offset();
		var tHeight = this.options.target.outerHeight();
		var tWidth 	= this.options.target.outerWidth();

		var scrollTop = $(window).scrollTop();

		var eLeft 	= tPos.left + tWidth / 2 - this.options.width / 2;
		var eTop 	= (tPos.top + tHeight / 2 - this.options.height / 2) - scrollTop;

		if(animate)
			this.el.stop().animate({
				left: eLeft + 'px',
				top: eTop + 'px'
			}, 400);
		else
			this.el.css({
				left: eLeft + 'px',
				top: eTop + 'px'
			});

		var dWidth = $(document).width();
		var centerMargin = dWidth / 12;

		if(eLeft > (dWidth / 2) - centerMargin && eLeft < (dWidth / 2) + centerMargin && dWidth > 700)// center
		{
			this.el.removeClass('on-right').addClass('on-center');
			var maxWidth = dWidth / 3;
		}
		else if(eLeft > dWidth / 2) // on right
		{
			this.el.addClass('on-right').removeClass('on-center');
			var maxWidth = dWidth - (dWidth - eLeft - this.options.width) - 25;
		}
		else
		{
			this.el.removeClass('on-right').removeClass('on-center');
			var maxWidth = dWidth - eLeft - 25;
		}

		this.el.children('div').css('max-width', maxWidth + 'px');
	};

	this.initColor = function(){
		var color = this.hexToRgb(this.options.color);

		var style = document.createElement("style");
		document.head.appendChild(style);
		sheet = style.sheet
		sheet.insertRule('.focusTip.'+this.uniqueClass+':before{ border-color: rgba('+color.r+','+color.g+','+color.b+',0.8); }', 0);

		this.el.children('div').css('color',this.options.textColor);
	};

	this.initScroll = function(){
		var target = this.options.target.offset().top - 200;
		if(target < 0) target = 0;
		var $d = new $.Deferred();
		$(window).animate({
				scrollTop: target
			}, 200, 'swing', function(){
				$d.resolve();
			});
		return $d.promise();
	};

	this.destroy = function(e){
		e.preventDefault();
		$this.el.fadeOut('fast',function(){
			$this.el.remove();
			$('body').removeClass('focusTipfix');
			if(typeof $this.options.callback == 'function')
				$this.options.callback.call();
		});
		$(window).off('resize.focustip_'+$this.uniqueClass);
	};

	this.hexToRgb = function(hex) {
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	};

	this.init();
};