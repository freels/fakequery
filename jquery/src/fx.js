jQuery.fn.extend({
	show: function(speed,callback){
		return speed ?
			this.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :

			this.filter(":hidden").each(function(){
				this.setStyle('display', this.oldblock || "");
				if ( jQuery.css(this,"display") == "none" ) {
					var elem = jQuery("<" + this.getTagName() + " />").appendTo("body");
					this.setStyle('display', elem.css("display"));
					// handle an edge condition where css is - div { display:none; } or similar
					if (this.getStyle('display') == "none")
						this.setStyle('display', "block");
					elem.remove();
				}
			}).end();
	},

	hide: function(speed,callback){
		return speed ?
			this.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :

			this.filter(":visible").each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				this.setStyle('display', "none");
			}).end();
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn ?
				this.animate({
					height: "toggle", width: "toggle", opacity: "toggle"
				}, fn, fn2) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
				});
	},

	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},

	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},

	slideToggle: function(speed, callback){
		return this.animate({height: "toggle"}, speed, callback);
	},

	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
	},

	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},

	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);
		
    // return this[ optall.queue === false ? "each" : "queue" ](function(){
		return this[ "each" ](function(){
		  
			var opt = jQuery.extend({}, optall), p,
				hidden = jQuery(this).is(":hidden"), self = this;
			
			opt.prev = {};
			    	
      // setup properties
      for ( p in prop ) {
			  if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden )
					return opt.complete.call(this);
					
        if ( p == "height" || p == "width" ) {
          // Store display property
          opt.display = jQuery.css(this, "display");

          // Make sure that nothing sneaks out
          opt.overflow = this.getStyle('overflow');
        }
			}

      // if ( opt.overflow != null )
      //  this.setStyle('overflow', "hidden");

      // create property animations
      // use facebook's Animation object instead of jQuery.fx
      
      var a = Animation(this);
      
      jQuery.each( prop, function(key, val){
        var from = undefined;
        
        if (val == "toggle")
          val = hidden ? "show" : "hide";

        // translate show and hide values
        if (val == 'show') {
          val = (key == 'opacity' ? 1 : 'auto');
          from = 0;
          
          a.show();

        } else if (val == 'hide') {
          val = 0;
          
          opt.prev[key] = /height|width/.test(key) ? 
            jQuery(self)[key]() : 
            self.getStyle(key) || (key == opacity ? 1 : 'auto');

          a.hide();
        }
        
        // relative animation   
        if (/\+?=/.test(val)) {
          a.by(key, val.replace(/\+?=/, ''));
          
        // absolute animation
        } else {            
          a.to(key, val);
          
          if (from !== undefined)
            a.from(from);
        }
      });
      
      // set the duration
      if ( opt.duration )
        a.duration( typeof opt.duration == 'string' ? jQuery.speeds[opt.duration] : opt.duration );
      else
        a.duration( jQuery.speeds['def'] );
      
      // set easing
      if ( opt.easing != 'linear' )
        a.ease( jQuery.easing[opt.easing] );
      
      // TODO: we should fire off the next function in the queue if it exists here...
      // if (opt.complete)
        a.checkpoint(1, function() {
          jQuery(self).css( opt.prev );
          return opt.complete.call( self );
        });
        
      a.go();
      
			// For JS strict compliance
			return true;
		});
	},

  // queue: function(type, fn){
  //  if ( jQuery.isFunction(type) || ( type && typeof type != 'string' && type.slice )) {
  //    fn = type;
  //    type = "fx";
  //  }
  // 
  //  if ( !type || (typeof type == "string" && !fn) )
  //    return queue( this[0], type );
  // 
  //  return this.each(function(){
  //    if ( fn.slice )
  //      queue(this, type, fn);
  //    else {
  //      queue(this, type).push( fn );
  // 
  //      if ( queue(this, type).length == 1 )
  //        fn.call(this);
  //    }
  //  });
  // },

  // stop: function(clearQueue, gotoEnd){
  //  var timers = jQuery.timers;
  // 
  //  if (clearQueue)
  //    this.queue([]);
  // 
  //  this.each(function(){
  //    // go in reverse order so anything added to the queue during the loop is ignored
  //    for ( var i = timers.length - 1; i >= 0; i-- )
  //      if ( timers[i].elem == this ) {
  //        if (gotoEnd)
  //          // force the next step to be the last
  //          timers[i](true);
  //        timers.splice(i, 1);
  //      }
  //  });
  // 
  //  // start the next in the queue if the last step wasn't forced
  //  if (!gotoEnd)
  //    this.dequeue();
  // 
  //  return this;
  // }

});

// var queue = function( elem, type, array ) {
//  if ( elem ){
// 
//    type = type || "fx";
// 
//    var q = jQuery.data( elem, type + "queue" );
// 
//    if ( !q || array )
//      q = jQuery.data( elem, type + "queue", jQuery.makeArray(array) );
// 
//  }
//  return q;
// };
// 
// jQuery.fn.dequeue = function(type){
//  type = type || "fx";
// 
//  return this.each(function(){
//    var q = queue(this, type);
// 
//    q.shift();
// 
//    if ( q.length )
//      q[0].call( this );
//  });
// };

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = speed && typeof speed == 'object' ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && typeof easing != 'function' && easing
		};

		opt.duration = (opt.duration && typeof opt.duration == 'number' ?
			opt.duration :
			jQuery.speeds[opt.duration]) || jQuery.speeds.def;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
		  // TODO: reenable this once queueing works again.
      // if ( opt.queue !== false )
      //  jQuery(this).dequeue();
			if ( jQuery.isFunction( opt.old ) )
				opt.old.call( this );
		};

		return opt;
	},
	
	speeds:{
    slow: 600,
    fast: 200,
    // Default speed
    def: 400
  },

	easing: {
		linear: null,
		swing: Animation.ease.both,
		begin: Animation.ease.begin,
		end: Animation.ease.end
	},

	timers: [],
	timerId: null,

  // fx: function( elem, options, prop ){
  //  this.options = options;
  //  this.elem = elem;
  //  this.prop = prop;
  // 
  //  if ( !options.orig )
  //    options.orig = {};
  // }

});

// jQuery.fx.prototype = {
// 
//  // Simple function for setting a style value
//  update: function(){
//    if ( this.options.step )
//      this.options.step.call( this.elem, this.now, this );
// 
//    (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
// 
//    // Set display property to block for height/width animations
//    if ( this.prop == "height" || this.prop == "width" )
//      this.elem.setStyle('display', "block");
//  },
// 
//  // Get the current size
//  cur: function(force){
//    if ( jQuery.attr(this.elem, this.prop) != null && this.elem.getStyle(this.prop) == null )
//      return jQuery.attr(this.elem, this.prop);
// 
//    var r = parseFloat(jQuery.css(this.elem, this.prop, force));
//    return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
//  },
// 
//  // Start an animation from one number to another
//  custom: function(from, to, unit){
//    this.startTime = now();
//    this.start = from;
//    this.end = to;
//    this.unit = unit || this.unit || "px";
//    this.now = this.start;
//    this.pos = this.state = 0;
//    this.update();
// 
//    var self = this;
//    function t(gotoEnd){
//      return self.step(gotoEnd);
//    }
// 
//    t.elem = this.elem;
// 
//    jQuery.timers.push(t);
// 
//    if ( jQuery.timerId == null ) {
//      jQuery.timerId = setInterval(function(){
//        var timers = jQuery.timers;
// 
//        for ( var i = 0; i < timers.length; i++ )
//          if ( !timers[i]() )
//            timers.splice(i--, 1);
// 
//        if ( !timers.length ) {
//          clearInterval( jQuery.timerId );
//          jQuery.timerId = null;
//        }
//      }, 13);
//    }
//  },
// 
//  // Simple 'show' function
//  show: function(){
//    // Remember where we started, so that we can go back to it later
//    this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
//    this.options.show = true;
// 
//    // Begin the animation
//    this.custom(0, this.cur());
// 
//    // Make sure that we start at a small width/height to avoid any
//    // flash of content
//    if ( this.prop == "width" || this.prop == "height" )
//      this.elem.style[this.prop] = "1px";
// 
//    // Start by showing the element
//    jQuery(this.elem).show();
//  },
// 
//  // Simple 'hide' function
//  hide: function(){
//    // Remember where we started, so that we can go back to it later
//    this.options.orig[this.prop] = jQuery.attr( this.elem.style, this.prop );
//    this.options.hide = true;
// 
//    // Begin the animation
//    this.custom(this.cur(), 0);
//  },
// 
//  // Each step of an animation
//  step: function(gotoEnd){
//    var t = now();
// 
//    if ( gotoEnd || t > this.options.duration + this.startTime ) {
//      this.now = this.end;
//      this.pos = this.state = 1;
//      this.update();
// 
//      this.options.curAnim[ this.prop ] = true;
// 
//      var done = true;
//      for ( var i in this.options.curAnim )
//        if ( this.options.curAnim[i] !== true )
//          done = false;
// 
//      if ( done ) {
//        if ( this.options.display != null ) {
//          // Reset the overflow
//          this.elem.style.overflow = this.options.overflow;
// 
//          // Reset the display
//          this.elem.style.display = this.options.display;
//          if ( jQuery.css(this.elem, "display") == "none" )
//            this.elem.style.display = "block";
//        }
// 
//        // Hide the element if the "hide" operation was done
//        if ( this.options.hide )
//          this.elem.style.display = "none";
// 
//        // Reset the properties, if the item has been hidden or shown
//        if ( this.options.hide || this.options.show )
//          for ( var p in this.options.curAnim )
//            jQuery.attr(this.elem.style, p, this.options.orig[p]);
//      }
// 
//      if ( done )
//        // Execute the complete function
//        this.options.complete.call( this.elem );
// 
//      return false;
//    } else {
//      var n = t - this.startTime;
//      this.state = n / this.options.duration;
// 
//      // Perform the easing function, defaults to swing
//      this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
//      this.now = this.start + ((this.end - this.start) * this.pos);
// 
//      // Perform the next step of the animation
//      this.update();
//    }
// 
//    return true;
//  }
// 
// };
// 
// jQuery.extend( jQuery.fx, {
//  speeds:{
//    slow: 600,
//      fast: 200,
//      // Default speed
//      def: 400
//  },
//  step: {
//    scrollLeft: function(fx){
//      fx.elem.scrollLeft = fx.now;
//    },
// 
//    scrollTop: function(fx){
//      fx.elem.scrollTop = fx.now;
//    },
// 
//    opacity: function(fx){
//      jQuery.attr(fx.elem.style, "opacity", fx.now);
//    },
// 
//    _default: function(fx){
//      fx.elem.style[ fx.prop ] = fx.now + fx.unit;
//    }
//  }
// });
