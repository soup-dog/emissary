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
5. Navigate to the app root in the repository (`src/app`) and run `npm install` to fetch the required node modules.
6. Navigate to the repository root and build the project with `make`.
7. Get your build output from `dist` and do what you want with it.

## Windows
1. Install [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and Ubuntu.
2. Follow the [Ubuntu/Debian](##Ubuntu/Debian) instructions in a WSL prompt.