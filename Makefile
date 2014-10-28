build:
	@npm install
	@./node_modules/.bin/bower install
	@./node_modules/.bin/gulp

clean:
	@rm -rf bower_components node_modules dist

.PHONY: build