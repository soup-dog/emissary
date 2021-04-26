import { IvyParser } from "@angular/compiler";
import { decodeFromWords, encodeToWords } from "./word-encode";

export class Session {
    public user: User;
    public key: AESCBCKey;

    public constructor(user: User, key: AESCBCKey) {
        this.user = user;
        this.key = key;
    }

    public static async fromJSON(jsonObject: any): Promise<Session> {
        return new Session(
            User.fromJSON(jsonObject.user),
            await AESCBCKey.fromJSON(jsonObject.key)
        );
    }

    public async toJSON(): Promise<any> {
        return {
            user: this.user,
            key: await this.key.toJSON()
        };
    }
}

export class User {
    public username: string;
    public pfpDataURL: string;
    public messages: Message[];
    public routes: Route[];

    public constructor(username: string, pfpDataURL: string = "", messages: Message[] = [], routes: Route[] = []) {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
        this.messages = messages;
        this.routes = routes;
    }

    public static fromJSON(jsonObject: any): User {
        return new User(
            jsonObject.username,
            jsonObject.pfpDataURL,
            jsonObject.messages.map((message: any) => Message.fromJSON(message)),
            jsonObject.routes.map((route: any) => Route.fromJSON(route))
        );
    }

    public toUserInfo(): UserInfo {
        return new UserInfo(
            this.username,
            this.pfpDataURL
        );
    }
}

export class AESCBCKey {
    public static readonly keyGenAlgorithm = {
        name: 'AES-CBC', // aes in cipher block chaining mode
        length: 256 // 256 bit key
    };
    public static readonly IV_LENGTH = 16;
    encryptionAlgorithm: any;
    cryptoKey: CryptoKey;

    public constructor(cryptoKey: CryptoKey, iv: BufferSource) {
        this.cryptoKey = cryptoKey;
        this.encryptionAlgorithm = {
            name: 'AES-CBC', // aes in cipher block chaining mode
            iv: iv // initialisation vector
        };
    }

    public async encrypt(plain: ArrayBuffer): Promise<ArrayBuffer> {
        return await window.crypto.subtle.encrypt(this.encryptionAlgorithm, this.cryptoKey, plain);
    }
    
    public async decrypt(buffer: ArrayBuffer): Promise<ArrayBuffer> {
        return await window.crypto.subtle.decrypt(this.encryptionAlgorithm, this.cryptoKey, buffer);
    }

    public static async generate(): Promise<AESCBCKey> {
        return new AESCBCKey(
            await window.crypto.subtle.generateKey(AESCBCKey.keyGenAlgorithm, true, ["encrypt", "decrypt"]), // generate an extractable key
            window.crypto.getRandomValues(new Uint8Array(AESCBCKey.IV_LENGTH)) // generate cryptographically random initialisation vector
        );
    }

    public static async fromJSON(jsonObject: any): Promise<AESCBCKey> {
        return new AESCBCKey(
            // import extractable key from json web key (extractable because it needs to be stored in the session)
            await window.crypto.subtle.importKey("jwk", jsonObject.cryptoKey, AESCBCKey.keyGenAlgorithm, true, ["encrypt", "decrypt"]),
            new Uint8Array(jsonObject.iv)
        );
    }

    public async toJSON(): Promise<any> {
        return {
            cryptoKey: await window.crypto.subtle.exportKey("jwk", this.cryptoKey), // export key as a json web key
            iv: Array.from(this.encryptionAlgorithm.iv)
        };
    }

    public async toWords(): Promise<string[]> {
        return encodeToWords(await window.crypto.subtle.exportKey("raw", this.cryptoKey)
         + this.encryptionAlgorithm.iv);
    }

    public static async fromWords(words: string[]): Promise<AESCBCKey> {
        const fullKey = new Uint8Array(decodeFromWords(words));
        return new AESCBCKey(
            await window.crypto.subtle.importKey("raw", fullKey.slice(0, AESCBCKey.keyGenAlgorithm.length), AESCBCKey.keyGenAlgorithm, false, ["encrypt", "decrypt"]),
            fullKey.slice(AESCBCKey.keyGenAlgorithm.length, AESCBCKey.keyGenAlgorithm.length + AESCBCKey.IV_LENGTH)
        );
    }

    public async toDataURL(): Promise<string> {
        const blob = new Blob([JSON.stringify(await this.toJSON())]); // create new blob from this as a JSON string
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(<string>reader.result); // resolve promise with result when onloadend
            reader.readAsDataURL(blob); // read blob as data url
        });
    }
}

export class UserInfo {
    public username: string;
    public pfpDataURL: string;

    public constructor(username: string = "", pfpDataURL: string = "") {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
    }

    public static fromJSON(jsonObject: any): UserInfo {
        return new UserInfo(
            jsonObject.username,
            jsonObject.pfpDataURL
        );
    }
}

export class Route {
    public userInfo: UserInfo;
    public key: AESCBCKey;
    public owned: boolean;

    public constructor(userInfo: UserInfo, key: AESCBCKey, owned: boolean) {
        this.userInfo = userInfo;
        this.key = key;
        this.owned = owned;
    }

    public static async generate(): Promise<Route> {
        return new Route(
            new UserInfo(),
            await AESCBCKey.generate(),
            true
        );
    }

    public static async fromJSON(jsonObject: any): Promise<Route> {
        return new Route(
            UserInfo.fromJSON(jsonObject.userInfo),
            await AESCBCKey.fromJSON(jsonObject.key),
            jsonObject.routeOwned
        );
    }
}

export class Message {
    author: UserInfo;
    content: string;
    sentByRouteOwner: boolean;

    constructor(content: string, author: UserInfo, sentByRouteOwner: boolean) {
        this.content = content;
        this.author = author;
        this.sentByRouteOwner = sentByRouteOwner;
    }

    public static fromJSON(jsonObject: any): Message {
        return new Message(
            jsonObject.content,
            UserInfo.fromJSON(jsonObject.author),
            jsonObject.sentByRouteOwner
        );
    }
}