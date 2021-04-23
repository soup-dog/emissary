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

    public static fromJSON(json: string): User {
        const jsonObject = JSON.parse(json);
        return new User(
            jsonObject.username,
            jsonObject.pfpDataURL,
            jsonObject.messages,
            jsonObject.routes
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
}

export class UserInfo {
    public username: string;
    public pfpDataURL: string;

    public constructor(username: string = "", pfpDataURL: string = "") {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
    }

    public static fromJSON(json: string): UserInfo {
        const jsonObject = JSON.parse(json);
        return new UserInfo(
            jsonObject.username,
            jsonObject.pfpDataURL
        );
    }
}

export class Route {
    public userInfo: UserInfo;

    public constructor(userInfo: UserInfo) {
        this.userInfo = userInfo;
    }

    public static fromJSON(json: string): Route {
        const jsonObject = JSON.parse(json);
        return new Route(
            UserInfo.fromJSON(jsonObject.userInfo)
        );
    }
}

export class Message {
    author: UserInfo;
    content: string;

    constructor(content: string, author: UserInfo) {
        this.content = content;
        this.author = author;
    }

    public static fromJSON(json: string): Message {
        const jsonObject = JSON.parse(json);
        return new Message(
            jsonObject.content,
            UserInfo.fromJSON(jsonObject.author)
        );
    }
}