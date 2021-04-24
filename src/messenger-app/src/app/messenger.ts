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

    public beep = () => JSON.stringify(this);

    public toUserInfo(): UserInfo {
        return new UserInfo(
            this.username,
            this.pfpDataURL
        );
    }
}

export class UserKey {
    public static readonly keyGenAlgorithm = {
        name: 'AES-CBC', // aes in cipher block chaining mode
        length: 128 // 128 bit key
    };
    encryptionAlgorithm: any;
    cryptoKey: CryptoKey;

    public constructor(cryptoKey: CryptoKey, iv: BufferSource) {
        this.cryptoKey = cryptoKey;
        this.encryptionAlgorithm = {
            name: 'AES-CBC', // aes in cipher block chaining mode
            iv: iv // initialisation vector
        };
    }

    public async encrypt(user: User): Promise<ArrayBuffer> {
        const encoder = new TextEncoder();

        return await window.crypto.subtle.encrypt(this.encryptionAlgorithm, this.cryptoKey, encoder.encode(JSON.stringify(user)));
    }
    
    public async decrypt(buffer: ArrayBuffer): Promise<User> {
        const decoder = new TextDecoder();

        return User.fromJSON(decoder.decode(await window.crypto.subtle.decrypt(this.encryptionAlgorithm, this.cryptoKey, buffer)))
    }

    public static async generate(): Promise<UserKey> {
        return new UserKey(
            await window.crypto.subtle.generateKey(UserKey.keyGenAlgorithm, true, ["encrypt", "decrypt"]), // generate an extractable key
            window.crypto.getRandomValues(new Uint8Array(16)) // generate cryptographically random initialisation vector
        );
    }

    public static async fromJSON(jsonObject: any): Promise<UserKey> {
        return new UserKey(
            // import non-extractable key from json web key
            await window.crypto.subtle.importKey("jwk", jsonObject.cryptoKey, UserKey.keyGenAlgorithm, false, ["encrypt", "decrypt"]),
            jsonObject.iv
        );
    }

    public async toJSON(): Promise<string> {
        const jsonObject = {
            cryptoKey: await window.crypto.subtle.exportKey("jwk", this.cryptoKey), // export key as a json web key
            iv: this.encryptionAlgorithm.iv
        };

        return JSON.stringify(jsonObject);
    }

    public async toDataURL(): Promise<string> {
        const blob = new Blob([await this.toJSON()]); // create new blob from this as a JSON string
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

    public toJSON = () => JSON.stringify(this);
}

export class Route {
    public userInfo: UserInfo;

    public constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    public static fromJSON(jsonObject: any): Route {
        return new Route(
            UserInfo.fromJSON(jsonObject.userInfo)
        );
    }

    public toJSON = () => JSON.stringify(this);
}

export class Message {
    author: UserInfo;
    content: string;

    constructor(content: string, author: UserInfo) {
        this.content = content;
        this.author = author;
    }

    public static fromJSON(jsonObject: any): Message {
        return new Message(
            jsonObject.content,
            UserInfo.fromJSON(jsonObject.author)
        );
    }

    public toJSON = () => JSON.stringify(this);
}