SHELL = /bin/sh
LANDING_DIR = src/landing
APP_DIR = src/messenger-app
OUTPUT_DIR = dist
APP_OUTPUT_DIR = $(OUTPUT_DIR)/app
APP_ROUTES = "app" "profile"

clean:
	$(RM) -r $(OUTPUT_DIR)
	mkdir $(OUTPUT_DIR)

landing:
	-cp $(LANDING_DIR)/* dist
	cp -r $(LANDING_DIR)/css dist
	cp -r $(LANDING_DIR)/img dist
	cd $(LANDING_DIR) && tsc

app:
	cd $(APP_DIR) && ng build
# hack to fix problem with hosting angular app on GitHub Pages
	for route in $(APP_ROUTES); do cp "$(APP_OUTPUT_DIR)/index.html" "$(APP_OUTPUT_DIR)/$$route.html"; done