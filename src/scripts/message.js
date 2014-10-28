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