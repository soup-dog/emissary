LANDING_PATH = src/landing
APP_PATH = src/messenger-app

all:
# compile landing project
	-cp $(LANDING_PATH)/* dist
	cp -r $(LANDING_PATH)/css dist
	cp -r $(LANDING_PATH)/img dist
	cd $(LANDING_PATH) && tsc
# compile app
	cd $(APP_PATH) && ng build