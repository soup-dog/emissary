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
            await User.fromJSON(jsonObject.user),
            await AESCBCKey.fromJSON(jsonObject.key)
        );
    }

    public async toJSON(): Promise<any> {
        return {
            user: await this.user.toJSON(),
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
        this.populateRouteMessages();
    }

    public addMessage(message: Message): void {
        this.messages.push(message); // add message to messages
        const route = this.routes[message.routeIndex];
        route.messages.push(message); // add message to route message list
        route.userInfo = message.author; // update route userInfo
    }

    public populateRouteMessages(): void {
        for (let message of this.messages) {
            this.routes[message.routeIndex].messages.push(message);
        }
    }

    public static async fromJSON(jsonObject: any): Promise<User> {
        const routes: Route[] = new Array<Route>(jsonObject.routes.length);
        for (let i = 0; i < routes.length; i++) {
            routes[i] = await Route.fromJSON(jsonObject.routes[i]);
        }

        return new User(
            jsonObject.username,
            jsonObject.pfpDataURL,
            jsonObject.messages.map((message: any) => Message.fromJSON(message)),
            routes
        );
    }

    public async toJSON(): Promise<any> {
        const routes: any[] = new Array<any>(this.routes.length);
        for (let i = 0; i < this.routes.length; i++) {
            routes[i] = await this.routes[i].toJSON();
        }

        return {
            username: this.username,
            pfpDataURL: this.pfpDataURL,
            messages: this.messages,
            routes: routes
        };
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
        length: 128 // 128 bit key
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

    public async JSONEncrypt(jsonObject: any): Promise<ArrayBuffer> {
        return await this.encrypt(new TextEncoder().encode(JSON.stringify(jsonObject)));
    }
    
    public async decrypt(buffer: ArrayBuffer): Promise<ArrayBuffer> {
        return await window.crypto.subtle.decrypt(this.encryptionAlgorithm, this.cryptoKey, buffer);
    }

    public async JSONDecrypt(buffer: ArrayBuffer): Promise<any> {
        return JSON.parse(new TextDecoder().decode(await this.decrypt(buffer)));
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
        const rawKey = await window.crypto.subtle.exportKey("raw", this.cryptoKey);
        const temp = new Uint8Array(rawKey.byteLength + this.encryptionAlgorithm.iv.byteLength);
        temp.set(new Uint8Array(rawKey), 0);
        temp.set(new Uint8Array(this.encryptionAlgorithm.iv), rawKey.byteLength);
        return encodeToWords(new Uint32Array(temp.buffer));
    }

    public static async fromWords(words: string[]): Promise<AESCBCKey> {
        const fullKey = new Uint8Array(new Uint32Array(decodeFromWords(words)).buffer); // decode form words and convert to Uint8Array
        return new AESCBCKey(
            await window.crypto.subtle.importKey("raw", fullKey.slice(0, AESCBCKey.keyGenAlgorithm.length / 8), AESCBCKey.keyGenAlgorithm, true, ["encrypt", "decrypt"]),
            fullKey.slice(AESCBCKey.keyGenAlgorithm.length / 8, AESCBCKey.keyGenAlgorithm.length / 8 + AESCBCKey.IV_LENGTH)
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
    public messages: Message[];

    public constructor(userInfo: UserInfo, key: AESCBCKey, owned: boolean) {
        this.userInfo = userInfo;
        this.key = key;
        this.owned = owned;
        this.messages = [];
    }

    public static async generate(): Promise<Route> {
        return new Route(
            new UserInfo("<unknown>"),
            await AESCBCKey.generate(),
            true
        );
    }

    public static async fromJSON(jsonObject: any): Promise<Route> {
        return new Route(
            UserInfo.fromJSON(jsonObject.userInfo),
            await AESCBCKey.fromJSON(jsonObject.key),
            jsonObject.owned
        );
    }

    public async toJSON() {
        return {
            userInfo: this.userInfo,
            key: await this.key.toJSON(),
            owned: this.owned
        }
    }
}

export class Message {
    public author: UserInfo;
    public content: string;
    public sentByRouteOwner: boolean;
    public routeIndex: number;

    public constructor(content: string, author: UserInfo, sentByRouteOwner: boolean, routeIndex: number) {
        this.content = content;
        this.author = author;
        this.sentByRouteOwner = sentByRouteOwner;
        this.routeIndex = routeIndex;
    }

    public static fromJSON(jsonObject: any): Message {
        return new Message(
            jsonObject.content,
            UserInfo.fromJSON(jsonObject.author),
            jsonObject.sentByRouteOwner,
            jsonObject.routeIndex
        );
    }
}