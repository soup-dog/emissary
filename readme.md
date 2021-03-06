# Build from source
## Prerequisites
- [node.js](https://nodejs.org) + npm
- [TypeScript](https://www.typescriptlang.org)
- [Angular](https://angular.io)
- [make](https://en.wikipedia.org/wiki/Make_(software))

## Ubuntu/Debian
1. Clone the repository with `git clone github.com/soup-dog/local-messenger`
2. Update the package cache with `sudo apt update`.
3. Install node.js and npm with `sudo apt install nodejs`
4. Navigate to the repository root and run `npm install` to fetch the required node modules.
5. Navigate to the app root in the repository (`src/messenger-app`) and run `npm install` to fetch the required node modules.
6. Navigate to the landing root in the repository (`src/landing`) and run `npm install` to fetch the required node modules.
6. Navigate to the repository root and make a development build with `make` (use `make PROD="true"` for a production build).
7. Get your build output from `dist` and do what you want with it.

## Windows
1. Install [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and Ubuntu.
2. Follow the [Ubuntu/Debian](##Ubuntu/Debian) instructions in a WSL prompt.

You can also build the two projects individually with the following steps:
1. Navigate to the app project root at (`src/messenger-app`) and run `ng build`.
2. Navigate to the repository root and run `make app-static-fix`.
3. Run `make landing`.