SHELL = /bin/sh
LANDING_PATH = src/landing
APP_PATH = src/messenger-app

all:
# build landing project
	-cp $(LANDING_PATH)/* dist
	cp -r $(LANDING_PATH)/css dist
	cp -r $(LANDING_PATH)/img dist
	cd $(LANDING_PATH) && tsc
# build app
	cd $(APP_PATH) && ng build