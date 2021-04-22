export class User {
    public username: string;
    public pfpDataURL: string;
    public messages: Message[];

    public constructor(username: string, pfpDataURL: string = "", messages: Message[] = []) {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
        this.messages = messages;
    }

    public static loadFromJSON(json: string): User {
        const jsonObject = JSON.parse(json);
        return new User(
            jsonObject.username,
            jsonObject.pfpDataURL,
            jsonObject.messages
        );
    }
}

export class UserInfo {
    public username: string;
    public pfpDataURL: string;

    public constructor(username: string = "", pfpDataURL: string = "") {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
    }

    public static fromJSON(json: string): User {
        const jsonObject = JSON.parse(json);
        return new User(
            jsonObject.username,
            jsonObject.pfpDataURL
        );
    }
}

export class Message {
    author: User;
    content: string;

    constructor(content: string, author: User) {
        this.content = content;
        this.author = author;
    }
}