STYLES = $(wildcard styles/*.less)

build: index.js $(STYLES) template.js test/test.js
	@make install
	@lessc styles/sg-notify.less > styles/sg-notify.css
	@component build --dev
	@make package

template.js: template.html
	@component convert $<

package: build/build.js build/build.css
	@component build --out lib --name sg-notify --standalone sgNotify
	@lessc --yui-compress lib/sg-notify.css > lib/sg-notify.min.css
	@uglifyjs lib/sg-notify.js > lib/sg-notify.min.js
	@mv lib/sg-notify.min.css  lib/sg-notify.css
	@mv lib/sg-notify.min.js lib/sg-notify.js

install:
	@component install --dev

demo:
	@npm install
	@open "http://localhost:5000/demo.html"
	@node demo/server.js