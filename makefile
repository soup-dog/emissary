SHELL = /bin/sh
landing_dir = src/landing
landing_dir_src = $(landing_dir)/src
app_dir = src/messenger-app
output_dir = dist
app_output_dir = $(output_dir)/app
app_routes = "app" "register" "account" "login"

app_build_args = 

ifdef PROD
	app_build_args += --prod
endif

ifdef BASE_HREF
	app_build_args += --base-href="$(BASE_HREF)"
endif


.PHONY: all
all: landing app

.PHONY: clean
clean:
	$(RM) -r $(output_dir)
	$(RM) -r docs
	mkdir $(output_dir)

.PHONY: landing
landing:
	-cp $(landing_dir_src)/* $(output_dir)
	cp -r $(landing_dir_src)/css $(output_dir)
	cp -r $(landing_dir_src)/img $(output_dir)
#	cd $(landing_dir) && tsc

.PHONY: app
app: app-static-fix
	cd $(app_dir) && ng build$(app_build_args)
	make app-static-fix

.PHONY: app-static-fix
app-static-fix:
# hack to fix problem with hosting angular app statically
	for route in $(app_routes); do cp "$(app_output_dir)/index.html" "$(app_output_dir)/$$route.html"; done

.PHONY: gh-pages
gh-pages:
	$(RM) -r docs
	cp -r $(output_dir) docs