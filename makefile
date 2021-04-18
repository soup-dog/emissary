SHELL = /bin/sh
LANDING_DIR = src/landing
LANDING_DIR_SRC = $(LANDING_DIR)/src
APP_DIR = src/messenger-app
OUTPUT_DIR = dist
APP_OUTPUT_DIR = $(OUTPUT_DIR)/app
APP_ROUTES = "app" "profile"

ifdef PROD
	APP_BUILD_ARGS = --prod
else
	APP_BUILD_ARGS = 
endif

.PHONY: all
all: landing app

.PHONY: clean
clean:
	$(RM) -r $(OUTPUT_DIR)
	mkdir $(OUTPUT_DIR)

landing:
	-cp $(LANDING_DIR_SRC)/* dist
	cp -r $(LANDING_DIR_SRC)/css dist
	cp -r $(LANDING_DIR_SRC)/img dist
	cd $(LANDING_DIR) && tsc

app:
	cd $(APP_DIR) && ng build $(APP_BUILD_ARGS)
# hack to fix problem with hosting angular app on GitHub Pages
	for route in $(APP_ROUTES); do cp "$(APP_OUTPUT_DIR)/index.html" "$(APP_OUTPUT_DIR)/$$route.html"; done