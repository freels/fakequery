/*
 * jQuery @VERSION - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-05-24 11:09:21 -0700 (Sat, 24 May 2008) $
 * $Rev: 5683 $
 */

var jQuery = function( selector, context ) {
	// The jQuery object is actually just the init constructor 'enhanced'
	return new jQuery.fn.init( selector, context );
};

// A simple way to check for HTML strings or ID strings
// (both of which we optimize for)
var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,

// Is it a simple selector
	isSimple = /^.[^:#\[\.]*$/,

// Will speed up references to undefined, and allows munging its name.
	undefined;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		// Make sure that a selection was provided
		context = context || document.getRootElement();
		selector = selector || document.getRootElement();

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this[0] = selector;
			this.length = 1;
			return this;
		}
		// Handle HTML strings
		if ( typeof selector == "string" ) {
			// Are we dealing with HTML string or an ID?
			var match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] )
					selector = jQuery.clean( [ match[1] ], context );

				// HANDLE: $("#id")
				else {
					var elem = document.getElementById( match[3] );

					// Make sure an element was located
					if ( elem ){
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.getId() != match[3] )
							return jQuery().find( selector );

						// Otherwise, we inject the element directly into the jQuery object
						return jQuery( elem );
					}
					selector = [];
				}

			// HANDLE: $(expr, [context])
			// (which is just equivalent to: $(content).find(expr)
			} else
				return jQuery( context ).find( selector );

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) )
			return jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );

		return this.setArray(jQuery.makeArray(selector));
	},

	// The current version of jQuery being used
	jquery: "@VERSION",

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	// The number of elements contained in the matched element set
	length: 0,

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		this.length = elems.length;
		
		for (var i = 0; i < elems.length; i++) this[i] = elems[i]
		
		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		var ret = -1;

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem && elem.jquery ? elem[0] : elem
		, this );
	},
	
	attr: function( name, value, type ) {
		var options = name;

		// Look for the case where we're accessing a style value
		if ( typeof name == 'string' )
			if ( value === undefined )
				return this[0] && jQuery[ type || "attr" ]( this[0], name );

			else {
				options = {};
				options[ name ] = value;
			}

		// Check to see if we're setting style values
		return this.each(function(i){
			// Set all the styles
			for ( name in options )
			  if (type == "curCSS") {
			    this.setStyle(name, jQuery.prop( this, options[ name ], type, i, name ));
			  } else {
  				jQuery.attr( this, name, jQuery.prop( this, options[ name ], type, i, name ));
				}
		});
	},

	css: function( key, value ) {
		// ignore negative width and height values
		if ( (key == 'width' || key == 'height') && parseFloat(value) < 0 )
			value = undefined;
		return this.attr( key, value, "curCSS" );
	},

  text: function( text ) {
   if ( typeof text != "object" && text != null )
     return this.each(function() {
       this.setTextValue(text);
     });
  },

  wrapAll: function( html ) {
   if ( this[0] )
     // The elements to wrap the target around
     jQuery( html )
       .clone()
       .insertBefore( this[0] )
       .map(function(){
         var elem = this;
  
         while ( elem.getFirstChild() )
           elem = elem.getFirstChild();
  
         return elem;
       })
       .append(this);
  
   return this;
  },

  wrapInner: function( html ) {
    return this.each(function(){
      jQuery( this ).contents().wrapAll( html );
    });
  },

  wrap: function( html ) {
    return this.each(function(){
      jQuery( this ).wrapAll( html );
    });
  },

  append: function() {
    return this.domManip(arguments, true, false, function(elem){
      this.appendChild( elem );
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, true, function(elem){
      this.insertBefore( elem, this.getFirstChild() );
    });
  },

  before: function() {
    return this.domManip(arguments, false, false, function(elem){
      this.getParentNode().insertBefore( elem, this );
    });
  },

  after: function() {
    return this.domManip(arguments, false, true, function(elem){
      this.getParentNode().insertBefore( elem, this.getNextSibling() );
    });
  },
  
  end: function() {
   return this.prevObject || jQuery( [] );
  },
  
  find: function( selector ) {
   var elems = jQuery.map(this, function(elem){
     return jQuery.find( selector, elem );
   });
  
   return this.pushStack( /[^+>] [^+>]/.test( selector ) || selector.indexOf("..") > -1 ?
     jQuery.unique( elems ) :
     elems );
  },

  clone: function( events ) {
   // Do the clone
   var ret = this.map(function(){
     // if ( jQuery.browser.msie && !jQuery.isXMLDoc(this) ) {
     //   // IE copies events bound via attachEvent when
     //   // using cloneNode. Calling detachEvent on the
     //   // clone will also remove the events from the orignal
     //   // In order to get around this, we use innerHTML.
     //   // Unfortunately, this means some modifications to
     //   // attributes in IE that are actually only stored
     //   // as properties will not be copied (such as the
     //   // the name attribute on an input).
     //   var clone = this.cloneNode(true),
     //     container = document.createElement("div");
     //   container.appendChild(clone);
     //   return jQuery.clean([container.innerHTML])[0];
     // } else
       return this.cloneNode(true);
   });
  
   // Need to set the expando to null on the cloned set if it exists
   // removeData doesn't work here, IE removes it from the original as well
   // this is primarily for IE but the data expando shouldn't be copied over in any browser
   var clone = ret.find("*").andSelf().each(function(){
     if ( this[ expando ] != undefined )
       this[ expando ] = null;
   });
  
   // Copy the events from the original to the clone
   if ( events === true )
     this.find("*").andSelf().each(function(i){
       var events = jQuery.data( this, "events" );
  
       for ( var type in events )
         for ( var handler in events[ type ] )
           jQuery.event.add( clone[ i ], type, events[ type ][ handler ], events[ type ][ handler ].data );
     });
  
   // Return the cloned set
   return ret;
  },
  
  filter: function( selector ) {
   return this.pushStack(
     jQuery.isFunction( selector ) &&
     jQuery.grep(this, function(elem, i){
       return selector.call( elem, i );
     }) ||
  
     jQuery.multiFilter( selector, this ) );
  },
  
  not: function( selector ) {
   if ( selector.constructor == String )
     // test special case where just one selector is passed in
     if ( isSimple.test( selector ) )
       return this.pushStack( jQuery.multiFilter( selector, this, true ) );
     else
       selector = jQuery.multiFilter( selector, this );
  
   var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
   return this.filter(function() {
     return isArrayLike ? jQuery.inArray( this, selector ) < 0 : this != selector;
   });
  },
  
  add: function( selector ) {
   return this.pushStack( jQuery.unique( jQuery.merge(
     this.get(),
     typeof selector == 'string' ?
       jQuery( selector ) :
       jQuery.makeArray( selector )
   )));
  },
  
  is: function( selector ) {
   return !!selector && jQuery.multiFilter( selector, this ).length > 0;
  },
  
  hasClass: function( selector ) {
   return this.is( "." + selector );
  },

  val: function( value ) {
   if ( value == undefined ) {
  
     if ( this.length ) {
       var elem = this[0];
  
       // We need to handle select boxes special
       if ( jQuery.nodeName( elem, "select" ) ) {
         var index = elem.getSelectedIndex(),
           values = [],
           options = elem.getOptions(),
           one = elem.getType() == "select-one";
  
         // Nothing was selected
         if ( index < 0 )
           return null;
  
         // Loop through all the selected options
         for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
           var option = options[ i ];
  
           if ( option.getSelected() ) {
             // Get the specifc value for the option
             value = option.getValue();
  
             // We don't need an array for one selects
             if ( one )
               return value;
  
             // Multi-Selects return an array
             values.push( value );
           }
         }
  
         return values;
  
       // Everything else, we just grab the value
       } else
         return (this[0].value || "").replace(/\r/g, "");
  
     }
  
     return undefined;
   }
  
   if( typeof value == 'number' )
     value += '';
  
   return this.each(function(){  
     // test to see if value is an Array
     if ( typeof value != 'string' && value.slice && /radio|checkbox/.test( this.getType() ) )
       this.setChecked( (jQuery.inArray(this.getValue(), value) >= 0 ||
         jQuery.inArray(this.getName(), value) >= 0) );
  
     else if ( jQuery.nodeName( this, "select" ) ) {
       var values = jQuery.makeArray(value);
  
       jQuery( "option", this ).each(function(){
         this.setSelected( jQuery.inArray( this.getValue(), values ) >= 0 );
       });
  
       if ( !values.length )
         this.setSelectedIndex( -1 );
  
     } else
       this.setValue( value );
   });
  },
  
  html: function( value ) {
    return this.empty().append( value );
  },

  replaceWith: function( value ) {
    return this.after( value ).remove();
  },

  eq: function( i ) {
   return this.slice( i, i + 1 );
  },
  
  slice: function(start, end) {
   return this.pushStack( jQuery.makeArray(this).slice( start, end ) );
  },
  
  map: function( callback ) {
   return this.pushStack( jQuery.map(this, function(elem, i){
     return callback.call( elem, i, elem );
   }));
  },
  
  andSelf: function() {
   return this.add( this.prevObject );
  },

  data: function( key, value ){
   var parts = key.split(".");
   parts[1] = parts[1] ? "." + parts[1] : "";
  
   if ( value === undefined ) {
     var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
  
     if ( data === undefined && this.length )
       data = jQuery.data( this[0], key );
  
     return data === undefined && parts[1] ?
       this.data( parts[0] ) :
       data;
   } else
     return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
       jQuery.data( this, key, value );
     });
  },
  
  removeData: function( key ){
   return this.each(function(){
     jQuery.removeData( this, key );
   });
  },

  domManip: function( args, table, reverse, callback ) {
   var clone = this.length > 1, elems;
  
   return this.each(function() {
     if ( !elems ) {
       elems = jQuery.clean( args, document );
  
       if ( reverse ) elems.reverse();
     }
  
     var obj = this;
  
     if ( table && jQuery.nodeName( this, "table" ) && jQuery.nodeName( elems[0], "tr" ) )
       obj = jQuery(this).find("tbody")[0] || this.appendChild( document.createElement("tbody") );
    
     jQuery.each(elems, function() {
       var elem = clone ?
         jQuery( this ).clone( true )[0] :
         this;
    
       // Inject the elements into the document
       callback.call( obj, elem );
     });
   });
  }
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

// function evalScript( i, elem ) {
//  if ( elem.src )
//    jQuery.ajax({
//      url: elem.src,
//      async: false,
//      dataType: "script"
//    });
// 
//  else
//    jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
// 
//  if ( elem.parentNode )
//    elem.parentNode.removeChild( elem );
// }

function now(){
	return +new Date;
}

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( typeof target == 'boolean' ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target != "object" && typeof target != "function" )
		target = {};

	// extend jQuery itself if only one argument is passed
	if ( length == i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy )
					continue;

				// Recurse if we're merging object values
				if ( deep && copy && typeof copy == "object" && !copy.nodeType )
					target[ name ] = jQuery.extend( deep, 
						// Never move original objects, clone them
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	// Return the modified object
	return target;
};

var expando = "fakequery" + now(), uuid = 0, windowData = {},
 // exclude the following css properties to add px
 exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
 // cache defaultView
 defaultView = {};

// helpers for element uuids and identity. we store the uuid as a class.

var uuidMatch = new RegExp('\\b' + expando + ':(\\d+)\\b');

jQuery.extend({
  uid: function(elem) {
    var m = uuidMatch.exec(elem.getClassName());
        
    if (m) {
      return parseInt(m[1]);
    } else {
      var id = ++uuid;
      jQuery.className.add(elem, expando + ':' + id)
      return id;
    }
  },
  
  removeUid: function(elem) {
    var m = uuidMatch.exec(elem.getClassName().toString());
    
    if (m)
      jQuery.className.remove(elem, m[0]);
  },
  
  same: function(elem1, elem2) {
    return jQuery.uid(elem1) == jQuery.uid(elem2);
  }
})

jQuery.extend({
  // noConflict: function( deep ) {
  //  window.$ = _$;
  // 
  //  if ( deep )
  //    window.jQuery = _jQuery;
  // 
  //  return jQuery;
  // },

	// See test/unit/core.js for details concerning this function.
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.getTagName && /^[\s[]?function/.test( fn + "" );
	},

	// check if an element is in a (or is an) XML document
	// false, we're in facebook
  isXMLDoc: function( elem ) {
   return false;
  },

	// Evalulates a script in a global context
  // globalEval: function( data ) {
  //  data = jQuery.trim( data );
  // 
  //  if ( data ) {
  //    // Inspired by code by Andrea Giammarchi
  //    // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
  //    var head = document.getElementsByTagName("head")[0] || document.documentElement,
  //      script = document.createElement("script");
  // 
  //    script.type = "text/javascript";
  //    if ( jQuery.browser.msie )
  //      script.text = data;
  //    else
  //      script.appendChild( document.createTextNode( data ) );
  // 
  //    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
  //    // This arises when a base node is used (#2709).
  //    head.insertBefore( script, head.firstChild );
  //    head.removeChild( script );
  //  }
  // },

  nodeName: function( elem, name ) {
   return elem.getTagName && elem.getTagName().toUpperCase() == name.toUpperCase();
  },

	cache: {},

  data: function( elem, name, data ) {
   // elem = elem == window ?
   //   windowData :
   //   elem;
  
   var id = jQuery.uid(elem);
    
   // Only generate the data cache if we're
   // trying to access or manipulate it
   if ( name && !jQuery.cache[ id ] )
     jQuery.cache[ id ] = {};
  
   // Prevent overriding the named cache with undefined values
   if ( data !== undefined )
     jQuery.cache[ id ][ name ] = data;
  
   // Return the named cache data, or the ID for the element
   return name ?
     jQuery.cache[ id ][ name ] :
     id;
  },

  removeData: function( elem, name ) {
   // elem = elem == window ?
   //   windowData :
   //   elem;
  
   var id = jQuery.uid(elem);
  
   // If we want to remove a specific section of the element's data
   if ( name ) {
     if ( jQuery.cache[ id ] ) {
       // Remove the section of cache data
       delete jQuery.cache[ id ][ name ];
  
       // If we've removed all the data, remove the element's cache
       name = "";
  
       for ( name in jQuery.cache[ id ] )
         break;
  
       if ( !name )
         jQuery.removeData( elem );
     }
  
   // Otherwise, we want to remove all of the element's data
   } else {  
     // Completely remove the data cache
     delete jQuery.cache[ id ];
   }
  },

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0, length = object.length;

		if ( args ) {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.apply( object[ name ], args ) === false )
						break;
			} else
				for ( ; i < length; )
					if ( callback.apply( object[ i++ ], args ) === false )
						break;

		// A special, fast, case for the most common use of each
		} else {
			if ( length == undefined ) {
				for ( name in object )
					if ( callback.call( object[ name ], name, object[ name ] ) === false )
						break;
			} else
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ){}
		}

		return object;
	},

  prop: function( elem, value, type, i, name ) {
   // Handle executable functions
   if ( jQuery.isFunction( value ) )
     value = value.call( elem, i );
  
   // Handle passing in a number to a CSS property
   return value && typeof value == 'number' && type == "curCSS" && !exclude.test( name ) ?
     value + "px" :
     value;
  },

	className: {
		// internal only, use addClass("class")
		add: function( elem, classNames ) {
		  if (typeof classNames == 'string') 
		    classNames = classNames.split(/\s+/g);

      elem.setClassName(elem.getClassName().split(/\s+/g).concat(classNames).join(' '));
		},

		// internal only, use removeClass("class")
		remove: function( elem, classNames ) {
				elem.setClassName(classNames != undefined ?
					jQuery.grep(elem.getClassName().split(/\s+/), function(className){
						return !jQuery.inArray( className, classNames );
					}).join(" ") :
					"");
		},

		// internal only, use hasClass("class")
		has: function( elem, className ) {
			return jQuery.inArray( className, (elem.getClassName()).toString().split(/\s+/) ) > -1;
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback ) {
   var old = {};
   // Remember the old values, and insert the new ones
   for ( var name in options ) {
     old[ name ] = elem.getStyle( name );
     elem.setStyle( name, options[ name ] );
   }
  
   callback.call( elem );
  
   // Revert the old values
   for ( var name in options )
     elem.setStyle( name, old[ name ] );
  },

  css: function( elem, name, force ) {
   if ( name == "width" || name == "height" ) {
     var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name == "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];
  
     function getWH() {
       val = name == "width" ? elem.getOffsetWidth() : elem.getOffsetHeight();
       var padding = 0, border = 0;
       jQuery.each( which, function() {
         padding += parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
         border += parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
       });
       val -= Math.round(padding + border);
     }
  
     if ( jQuery(elem).is(":visible") )
       getWH();
     else
       jQuery.swap( elem, props, getWH );
  
     return Math.max(0, val);
   }
  
   return jQuery.curCSS( elem, name, force );
  },
  
  curCSS: function( elem, name ) {
    return elem.getStyle(name);
  },

  clean: function( elems, context ) {
   var ret = [];
   context = document; //TODO: remove this...
  
   jQuery.each(elems, function(i, elem){
     if ( !elem )
       return;
  
     if ( typeof elem == 'number' )
       elem += '';
  
     // Convert html string into DOM nodes
     if ( typeof elem == "string" ) {
       // Fix "XHTML"-style tags in all browsers
       elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag){
         return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ?
           all :
           front + "></" + tag + ">";
       });
  
       // Trim whitespace, otherwise indexOf won't work as expected
       var tags = jQuery.trim( elem ).toLowerCase(), div = document.createElement("div");
  
       var wrap =
         // option or optgroup
         !tags.indexOf("<opt") &&
         [ 1, "<select multiple='multiple'>", "</select>" ] ||
  
         !tags.indexOf("<leg") &&
         [ 1, "<fieldset>", "</fieldset>" ] ||
  
         tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
         [ 1, "<table>", "</table>" ] ||
  
         !tags.indexOf("<tr") &&
         [ 2, "<table><tbody>", "</tbody></table>" ] ||
  
         // <thead> matched above
         (!tags.indexOf("<td") || !tags.indexOf("<th")) &&
         [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||
  
         !tags.indexOf("<col") &&
         [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||
  
         // // IE can't serialize <link> and <script> tags normally
         // jQuery.browser.msie &&
         // [ 1, "div<div>", "</div>" ] ||
  
         [ 0, "", "" ];
  
       // Go to html and back, then peel off extra wrappers
       div.setInnerXHTML(wrap[1] + elem + wrap[2]);
  
       // Move to the right depth
       while ( wrap[0]-- )
         div = div.getLastChild();
  
       // // Remove IE's autoinserted <tbody> from table fragments
       // if ( jQuery.browser.msie ) {
       //   
       //   // String was a <table>, *may* have spurious <tbody>
       //   var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ?
       //     div.firstChild && div.firstChild.childNodes :
       //   
       //     // String was a bare <thead> or <tfoot>
       //     wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ?
       //       div.childNodes :
       //       [];
       //   
       //   for ( var j = tbody.length - 1; j >= 0 ; --j )
       //     if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length )
       //       tbody[ j ].parentNode.removeChild( tbody[ j ] );
       //   
       //   // IE completely kills leading whitespace when innerHTML is used
       //   if ( /^\s/.test( elem ) )
       //     div.insertBefore( context.createTextNode( elem.match(/^\s*/)[0] ), div.firstChild );
       //   
       // }
  
       elem = jQuery.makeArray( div.getChildNodes() );
     }
  
     if ( elem.length === 0 && (!jQuery.nodeName( elem, "form" ) && !jQuery.nodeName( elem, "select" )) )
       return;
  
     if ( elem[0] == undefined || jQuery.nodeName( elem, "form" ) || (elem.getOptions && elem.getOptions()) )
       ret.push( elem );
  
     else
       ret = jQuery.merge( ret, elem );
  
   });
  
   return ret;
  },
  
  attr: function( elem, name, value ) {
    name = name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase();
    
    if ( !elem['get' + name] )
      return undefined;
    
    if ( value !== undefined )
      elem['set' + name](value);
    
    return elem['get' + name]();
  },

	trim: function( text ) {
		return (text || "").replace( /^\s+|\s+$/g, "" );
	},

	makeArray: function( array ) {
		var ret = [];

		if( array != null ){
			var i = array.length;
			//the window, strings and functions also have 'length'
			if( i == null || array.split || array.setInterval || array.call )
				ret[0] = array;
			else
				while( i )
					ret[--i] = array[i];
		}

		return ret;
	},

	inArray: function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
		// Use === because on IE, window == document
			if ( array[ i ] === elem )
				return i;

		return -1;
	},

  merge: function( first, second ) {
   var i = 0, elem, pos = first.length;

   while ( elem = second[ i++ ] )
     first[ pos++ ] = elem;
  
   return first;
  },

	unique: function( array ) {
		var ret = [], done = {};

		try {

			for ( var i = 0, length = array.length; i < length; i++ ) {
				var id = jQuery.data( array[ i ] );

				if ( !done[ id ] ) {
					done[ id ] = true;
					ret.push( array[ i ] );
				}
			}

		} catch( e ) {
			ret = array;
		}

		return ret;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ )
			if ( !inv != !callback( elems[ i ], i ) )
				ret.push( elems[ i ] );

		return ret;
	},

	map: function( elems, callback ) {
		var ret = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			var value = callback( elems[ i ], i );

			if ( value != null )
				ret[ ret.length ] = value;
		}

		return ret.concat.apply( [], ret );
	}
});

// var userAgent = navigator.userAgent.toLowerCase();
// 
// // Figure out what browser is being used
// jQuery.browser = {
//  version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
//  safari: /webkit/.test( userAgent ),
//  opera: /opera/.test( userAgent ),
//  msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
//  mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
// };
// 
// var styleFloat = jQuery.browser.msie ?
//  "styleFloat" :
//  "cssFloat";

jQuery.extend({
  // boxModel should always be true in facebook.
  boxModel: true,
  
  props: {
		"for": "htmlFor",
		"class": "className",
		"float": "cssFloat",
		cssFloat: "cssFloat",
		styleFloat: "cssFloat",
		readonly: "readOnly",
		maxlength: "maxLength",
		cellspacing: "cellSpacing"
	}
})

jQuery.each({
	parent: function(elem){return elem.getParentNode();},
	parents: function(elem){return jQuery.dir(elem,"getParentNode");},
	next: function(elem){return elem.getNextSibling();},
	prev: function(elem){return elem.getPreviousSibling();},
	nextAll: function(elem){return jQuery.dir(elem,"getNextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"getPreviousSibling");},
	siblings: function(elem){return jQuery.fqSibling(elem);},
	children: function(elem){return elem.childNodes();},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.getChildNodes());}
}, function(name, fn){
	jQuery.fn[ name ] = function( selector ) {
		var ret = jQuery.map( this, fn );

		if ( selector && typeof selector == "string" )
			ret = jQuery.multiFilter( selector, ret );

		return this.pushStack( jQuery.unique( ret ) );
	};
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function() {
		var args = arguments;

		return this.each(function(){
			for ( var i = 0, length = args.length; i < length; i++ )
				jQuery( args[ i ] )[ original ]( this );
		});
	};
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, null );
	},

	addClass: function( classNames ) {
		jQuery.className.add( this, classNames );
	},

	removeClass: function( classNames ) {
		jQuery.className.remove( this, classNames );
	},

	toggleClass: function( classNames ) {
		jQuery.className[ jQuery.className.has( this, classNames ) ? "remove" : "add" ]( this, classNames );
	},

	remove: function( selector ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).r.length ) {
			// Prevent memory leaks
			jQuery( "*", this ).add(this).each(function(){
				jQuery.event.remove(this);
				jQuery.removeData(this);
			});
			if (this.getParentNode())
				this.getParentNode().removeChild( this );
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		jQuery( ">*", this ).remove();

		// Remove any remaining nodes
		while ( this.getFirstChild() )
			this.removeChild( this.getFirstChild() );
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.each([ "Height", "Width" ], function(i, name){
	var type = name.toLowerCase();

	jQuery.fn[ type ] = function( size ) {
		// Get or set width or height on the element
		if (size == undefined) {
		  return this.length ? jQuery.css( this[0], type ) : null;
		} else {
		  return this.css( type, (typeof size == 'string') ? size : size + "px" );
		}
	};
});

// Helper function used by the dimensions and offset modules
function num(elem, prop) {
	return elem[0] && parseInt( jQuery.curCSS(elem[0], prop, true), 10 ) || 0;
}