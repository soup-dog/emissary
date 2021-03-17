// import download from "download.js"

import { download } from "./download.js";

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
}

class MessengerSession {
    constructor(user) {
        this.user = user;
    }
}

export class MessengerApplication {
    static login(aesKey, iv, username) {
        let userStore = MessengerApplication.getUserStore(); // get user store from local storage
        if (userStore == null) { // if user store does not exist
            localStorage.setItem(userStore_STORAGE_KEY, {}); // create a new empty one
            return false;
        }

        console.log(userStore); // DEBUG, remove for release

        let user = null;

        if (userStore.hasOwnProperty(username)) { // if username is in the store
            user = User.fromEncrypted(aesKey, iv, userStore[username]); // try decrypting the associated encrypted data
        }

        if (user == null) { // lookup by username did not succeed
            let validUsers = userStore.values()
                .map((encrypted) => User.fromEncrypted(aesKey, iv, encrypted)) // try decrypt
                .filter((decryptionAttempt) => decryptionAttempt != null) // remove failed decryption attempts
                .filter((user) => user.username = username); // remove users without the correct username

            if (validUsers.length == 0) { // no valid user found
                return false;
            }

            user = validUsers[0]; // get first valid user
        }

        let session = new MessengerSession(user); // create session

        sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session)); // store session in sessin storage
        return true;
    }

    static logout(session) {
        sessionStorage.removeItem(USER_STORE_STORAGE_KEY); // remove session from session storage
        return true;
    }

    static usernameAvailable(username) {
        let userStore = MessengerApplication.getUserStore();

        return userStore == undefined || userStore == null || !userStore.keys.contains(username); // user store doesn't exist or username is not in the user store
    }

    static async register(username) {
        if (!MessengerApplication.usernameAvailable(username)) { return null; }

        // get user store from local storage or empty object if it does not exist
        let userStore = localStorage.getItem(USER_STORE_STORAGE_KEY) ?? {};

        let aesKey = await window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true, ["encrypt"]); // create an extractable AES key

        let completeKey = aesKey;

        MessengerApplication.setUserStore(userStore); // store changes in local storage

        return completeKey;
    }

    static setUserStore(store) {
        localStorage.setItem(USER_STORE_STORAGE_KEY, JSON.stringify(store));
    }
    
    static getUserStore() {
        console.log()
        return JSON.parse(localStorage.getItem(USER_STORE_STORAGE_KEY));
    }
}

let user = new User("bob");
console.log(JSON.stringify(user));

//User.login(null, null, "foo");

function main() {

}

export default {MessengerApplication};
