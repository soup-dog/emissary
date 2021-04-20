export class User {
    public username: string;
    public pfpDataURL: string;
    public messages: Message[];

    public constructor(username: string, pfpDataURL?: string, messages?: Message[]) {
        this.username = username;
        this.pfpDataURL = pfpDataURL ?? "";
        this.messages = messages ?? [];
    }

    public static loadFromJSON(json: string): User {
        const jsonUser = JSON.parse(json);
        return new User(
            jsonUser.username,
            jsonUser.pfpDataURL,
            jsonUser.messages
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