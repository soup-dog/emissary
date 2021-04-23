SHELL = /bin/sh
landing_dir = src/landing
landing_dir_src = $(landing_dir)/src
app_dir = src/messenger-app
output_dir = dist
app_output_dir = $(output_dir)/app
app_routes = "app" "register" "account" "login"

ifdef PROD
	app_build_args = --prod
else
	app_build_args = 
endif

.PHONY: all
all: landing app

.PHONY: clean
clean:
	$(RM) -r $(output_dir)
	mkdir $(output_dir)

landing:
	-cp $(landing_dir_src)/* dist
	cp -r $(landing_dir_src)/css dist
	cp -r $(landing_dir_src)/img dist
	cd $(landing_dir) && tsc

app:
	cd $(app_dir) && ng build $(app_build_args)
	make app-static-fix

app-static-fix:
# hack to fix problem with hosting angular app statically
	for route in $(app_routes); do cp "$(app_output_dir)/index.html" "$(app_output_dir)/$$route.html"; done
