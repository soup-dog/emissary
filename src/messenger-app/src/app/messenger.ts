export class User {
    public username: string;
    public pfpDataURL: string;

    public constructor(username: string, pfpDataURL?: string) {
        this.username = username;
        this.pfpDataURL = pfpDataURL ?? "";
    }

    public static loadFromJSON(json: string): User {
        const jsonUser = JSON.parse(json);
        return new User(
            jsonUser.username, jsonUser.pfpDataURL
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