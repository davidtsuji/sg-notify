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