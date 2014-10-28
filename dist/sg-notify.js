!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.sgNotify=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var type = require( "./ises/type" ),
  is = {
    a: {},
    an: {},
    not: {
      a: {},
      an: {}
    }
  };

var ises = {
  "arguments": [ "arguments", type( "arguments" ) ],
  "array": [ "array", type( "array" ) ],
  "boolean": [ "boolean", type( "boolean" ) ],
  "date": [ "date", type( "date" ) ],
  "function": [ "function", "func", "fn", type( "function" ) ],
  "null": [ "null", type( "null" ) ],
  "number": [ "number", "integer", "int", type( "number" ) ],
  "object": [ "object", type( "object" ) ],
  "regexp": [ "regexp", type( "regexp" ) ],
  "string": [ "string", type( "string" ) ],
  "undefined": [ "undefined", type( "undefined" ) ],
  "empty": [ "empty", require( "./ises/empty" ) ],
  "nullorundefined": [ "nullOrUndefined", "nullorundefined", require( "./ises/nullorundefined" ) ],
  "guid": [ "guid", require( "./ises/guid" ) ]
}

Object.keys( ises ).forEach( function ( key ) {

  var methods = ises[ key ].slice( 0, ises[ key ].length - 1 ),
    fn = ises[ key ][ ises[ key ].length - 1 ];

  methods.forEach( function ( methodKey ) {
    is[ methodKey ] = is.a[ methodKey ] = is.an[ methodKey ] = fn;
    is.not[ methodKey ] = is.not.a[ methodKey ] = is.not.an[ methodKey ] = function () {
      return fn.apply( this, arguments ) ? false : true;
    }
  } );

} );

exports = module.exports = is;
exports.type = type;
},{"./ises/empty":2,"./ises/guid":3,"./ises/nullorundefined":4,"./ises/type":5}],2:[function(require,module,exports){
var type = require("../type");

module.exports = function ( value ) {
  var empty = false;

  if ( type( value ) === "null" || type( value ) === "undefined" ) {
    empty = true;
  } else if ( type( value ) === "object" ) {
    empty = Object.keys( value ).length === 0;
  } else if ( type( value ) === "boolean" ) {
    empty = value === false;
  } else if ( type( value ) === "number" ) {
    empty = value === 0 || value === -1;
  } else if ( type( value ) === "array" || type( value ) === "string" ) {
    empty = value.length === 0;
  }

  return empty;

};
},{"../type":7}],3:[function(require,module,exports){
var guid = require( "sc-guid" );

module.exports = function ( value ) {
  return guid.isValid( value );
};
},{"sc-guid":6}],4:[function(require,module,exports){
module.exports = function ( value ) {
	return value === null || value === undefined || value === void 0;
};
},{}],5:[function(require,module,exports){
var type = require( "../type" );

module.exports = function ( _type ) {
  return function ( _value ) {
    return type( _value ) === _type;
  }
}
},{"../type":7}],6:[function(require,module,exports){
var guidRx = "{?[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}}?";

exports.generate = function () {
  var d = new Date().getTime();
  var guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
    var r = ( d + Math.random() * 16 ) % 16 | 0;
    d = Math.floor( d / 16 );
    return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
  } );
  return guid;
};

exports.match = function ( string ) {
  var rx = new RegExp( guidRx, "g" ),
    matches = ( typeof string === "string" ? string : "" ).match( rx );
  return Array.isArray( matches ) ? matches : [];
};

exports.isValid = function ( guid ) {
  var rx = new RegExp( guidRx );
  return rx.test( guid );
};
},{}],7:[function(require,module,exports){
var toString = Object.prototype.toString;

module.exports = function ( val ) {
  switch ( toString.call( val ) ) {
  case '[object Function]':
    return 'function';
  case '[object Date]':
    return 'date';
  case '[object RegExp]':
    return 'regexp';
  case '[object Arguments]':
    return 'arguments';
  case '[object Array]':
    return 'array';
  }

  if ( val === null ) return 'null';
  if ( val === undefined ) return 'undefined';
  if ( val === Object( val ) ) return 'object';

  return typeof val;
};
},{}],8:[function(require,module,exports){
var is = require( 'sc-is' ),
	Message = require( './message' ),
	template = require( './template' );

var Notify = function () {
	this.messages = [];
};

Notify.prototype.show = function ( _type, _message, _sticky, _disabled ) {
	var self = this,
		sticky = is.a.boolean( _sticky ) && _sticky ? 0 : ( is.a.number( _sticky ) ? _sticky : self.defaults.selfDestructTime ),
		message = new Message( _type, _message, sticky, _disabled );

	if ( !self.$template ) {
		self.$template = $( template );
		$( 'body' ).append( self.$template );
		self.wrapper = self.$template;
	}

	self.wrapper.append( message.el );
	message.el.addClass( 'bounceInUp' );

	self.messages.push( message );

	return message;
};

Notify.prototype.hide = function () {
	var self = this;

	while ( self.messages.length > 0 ) {
		var message = self.messages.shift();

		if ( is.an.object( message ) && message[ 'message' ] ) {
			message.destroy();
		}
	}
};

Notify.prototype.success = function ( _message, _sticky, _disabled ) {
	return this.show( 'success', _message, _sticky, _disabled );
};

Notify.prototype.warn = function ( _message, _sticky, _disabled ) {
	return this.show( 'warn', _message, _sticky, _disabled );
};

Notify.prototype.error = function ( _message, _sticky, _disabled ) {
	return this.show( 'error', _message, _sticky, _disabled );
};

Notify.prototype.info = function ( _message, _sticky, _disabled ) {
	return this.show( 'info', _message, _sticky, _disabled );
};

Notify.prototype.log = function ( _message, _sticky, _disabled ) {
	return this.show( 'log', _message, _sticky, _disabled );
};

Notify.prototype.defaults = {
	selfDestructTime: 4000
};

module.exports = new Notify();
},{"./message":9,"./template":10,"sc-is":1}],9:[function(require,module,exports){
var Message = function ( _type, _message, _sticky, _disabled ) {
	var self = this,
		span = $( '<span>' ),
		destroyTimeout;

	self.message = {
		type: _type,
		message: _message,
		sticky: _sticky,
		disabled: _disabled
	};

	self.el = $( '<aside class="animated message">' );
	self.el.attr( 'title', _message );
	self.el.append( span );
	span.html( _message );
	self.el.addClass( _type );

	self.destroy = function () {
		self.el.off( 'click', self.destroy );
		self.el.removeClass( 'bounceInUp' );
		self.el.addClass( 'bounceOutDown' );

		clearTimeout( destroyTimeout );

		setTimeout( function () {
			self.el.remove();
		}, 600 );
	};

	_disabled ? self.el.addClass( 'disabled' ) : self.el.on( 'click', self.destroy );

	if ( _sticky > 0 ) {
		destroyTimeout = setTimeout( function () {

			self.destroy();

		}, _sticky );
	}

	return this;
};

module.exports = Message;
},{}],10:[function(require,module,exports){
module.exports = '<div class="sg-notify"></div>';
},{}]},{},[8])(8)
});