const USER_STORE_STORAGE_KEY = "users";
const USER_SESSION_STORAGE_KEY = "user";

var aesAlgorithmKeyGen = {
    name: "AES-CBC",
    // AesKeyGenParams
    length: 256
};



class User {
    constructor(username) {
        this.username = username;
    }

    static async fromEncrypted(aesKey, iv, encryptedData) {
        let aesAlgorithmEncrypt = {
            name: "AES-CBC",
            // AesCbcParams
            iv: iv
        };

        
    }

    pack(userKey) {
        
    }
}

class MessengerSession {
    constructor(user) {
        this.user = user;
    }
}

export class UserKey {
    constructor(aesKey, iv) {
        this.aesKey = aesKey;
        this.iv = iv;
    }

    static loadFromArrayBuffer(arr) {
        return new UserKey(arr.subarray(0, 32), arr.subarray(0, 16));
    }
    
    export() {
        return [this.aesKey, this.iv];
    }

    async exportAsDataURL() {
        let blob = new Blob(this.export());

        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob); // read the key as a data url
        });
    }
}

export class MessengerApplication {
    static _instance = new MessengerApplication(USER_STORE_STORAGE_KEY, USER_SESSION_STORAGE_KEY);
    // error enums
    static loginError = {
        MISSING: 1
    };
    static registerError = {
        USERNAME_NOT_AVAILABLE: 1
    };

    constructor(userStoreLocation, sessionStoreLocation) {
        this.userStoreLocation = userStoreLocation;
        this.sessionStoreLocation = sessionStoreLocation;
    }

    static getInstance() {
        return MessengerApplication._instance;
    }

    login(aesKey, iv, username) {
        let user = null;

        if (this.userStore.hasOwnProperty(username)) { // if username is in the store
            user = User.fromEncrypted(aesKey, iv, this.userStore[username]); // try decrypting the associated encrypted data
        }

        if (user == null) { // lookup by username did not succeed
            let validUsers = this.userStore.values()
                .map((encrypted) => User.fromEncrypted(aesKey, iv, encrypted)) // try decrypt
                .filter((decryptionAttempt) => decryptionAttempt != null) // remove failed decryption attempts
                .filter((user) => user.username = username); // remove users without the correct username

            if (validUsers.length == 0) { // no valid user found
                throw MessengerApplication.loginError.MISSING;
            }

            user = validUsers[0]; // get first valid user
        }

        let session = new MessengerSession(user); // create session

        sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session)); // store session in session storage
    }

    logout(session) {
        sessionStorage.removeItem(USER_STORE_STORAGE_KEY); // remove session from session storage
        return true;
    }

    usernameAvailable(username) {
        return !( // not
            [null, undefined, ""].some(value => value == username) // invalid
            || Object.keys(this.userStore).some(key => key == username) // or unavailable
            );
    }

    async register(username) {
        // validate username is available
        if (!this.usernameAvailable(username)) { throw MessengerApplication.registerError.USERNAME_NOT_AVAILABLE; }

        let aesKey = await window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true, ["encrypt"]); // create an extractable AES key
        // produce cryptographically random initialisation vector
        let iv = window.crypto.getRandomValues(new Uint8Array(16));

        user = new User();

        this.userStore[username] = user;

        // create promise that returns an instance of UserKey containing the keys that were just created
        return window.crypto.subtle.exportKey("raw", aesKey).then(key => new UserKey(key, iv));
    }

    set userStore(value) {
        // convert value to json string and store it in the user store
        localStorage.setItem(this.userStoreLocation, JSON.stringify(value));
    }
    
    get userStore() {
        // get the user store from local storage or empty object if it does not exist
        return JSON.parse(localStorage.getItem(this.userStoreLocation)) ?? {};
    }
}

export let app = MessengerApplication.getInstance(); // export a reference to the instance of MessengerApplication

let user = new User("bob");
console.log(JSON.stringify(user));

//User.login(null, null, "foo");

function main() {

}

export default {MessengerApplication, app};
