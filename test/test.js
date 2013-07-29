mocha.setup('bdd');

var notify = sgNotify

describe('sg-notify', function(){

	this.timeout(7000);
	this.slow(15000);

	it('should show a success message and then hide it', function(_done){

		assert($('body > .sg-notify').length == 0, 'wrapper should not be in the dom');

		notify.success('bam');

		assert($('body > .sg-notify > aside').length == 1, '1 message in the dom');
		assert($('body > .sg-notify').length == 1, 'wrapper should be in the dom');
		assert($('body > .sg-notify > aside').text() == 'bam', 'message should be "bam"');

		setTimeout(function(){

			assert($('body > .sg-notify > aside').length == 0, '0 messages in the dom');

			_done();

		}, 5000);

	});

	it('should show a success message and then hide it by clicking it', function(_done){

		this.timeout(5000);
		this.slow(5000);

		notify.success('bam');

		setTimeout(function(){

			$('body > .sg-notify > aside').trigger('click');

			setTimeout(function(){

				assert($('body > .sg-notify > aside').length == 0, '0 message in the dom');
				_done();
				
			}, 500);

		}, 500);

	});

	it('should show a sticky and a non sticky message', function(_done){

		this.timeout(15000);
		this.slow(15000);

		notify.success('non sticky', 1000);
		notify.success('sticky', true);

		setTimeout(function(){

			assert($('body > .sg-notify > aside').length == 1, '1 message in the dom');

			notify.hide();

			setTimeout(function(){

				assert($('body > .sg-notify > aside').length == 0, '0 message in the dom');
				_done();
				
			}, 500);

		}, 1500);

	});

	it('should show a disabled and a non disabled message', function(_done){

		this.timeout(15000);
		this.slow(15000);

		notify.success('non disabled');
		notify.success('disabled', false, true);

		setTimeout(function(){

			assert($('body > .sg-notify > aside').length == 2, '2 message in the dom');

			$('body > .sg-notify > aside').trigger('click');

			setTimeout(function(){

				assert($('body > .sg-notify > aside').length == 1, '1 message in the dom');
				notify.hide();

				setTimeout(function(){

					assert($('body > .sg-notify > aside').length == 0, '0 message in the dom');
					_done();
					
				}, 500)
				
			}, 500);

		}, 500);

	});

	it('should show 5 messages and then hide them all at once', function(_done){

		this.timeout(5000);
		this.slow(5000);

		notify.success('success');
		notify.error('error');
		notify.warn('warn');
		notify.info('info');
		notify.log('log');

		setTimeout(function(){

			assert($('body > .sg-notify > aside').length == 5, '5 message in the dom');
			notify.hide();

			setTimeout(function(){

				assert($('body > .sg-notify > aside').length == 0, '0 message in the dom');
				_done();
				
			}, 500);

		}, 500);

	});

});