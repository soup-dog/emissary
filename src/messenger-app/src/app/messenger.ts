export class User {
    public username: string;
    public pfpDataURL: string;
    public messages: Message[];

    public constructor(username: string, pfpDataURL: string = "", messages: Message[] = []) {
        this.username = username;
        this.pfpDataURL = pfpDataURL;
        this.messages = messages;
    }

    public static fromJSON(json: string): User {
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
            jsonObject.userInfo
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