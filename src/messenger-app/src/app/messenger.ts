export class User {
    public username: string;
    public profilePicture: ArrayBuffer;

    public constructor(username: string, profilePicture?: ArrayBuffer) {
        this.username = username;
        this.profilePicture = profilePicture ?? new ArrayBuffer(0);
    }

    public async getPfpDataURL(): Promise<string> {
        const blob = new Blob([this.profilePicture]);

        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(<string>reader.result); // cast result to string (because it is a data url) and resolve promise
            reader.readAsDataURL(blob); // read the key as a data url
        });
    }

    public static loadFromJSON(json: string): User {
        const jsonUser = JSON.parse(json);
        return new User(
            jsonUser.username, jsonUser.profilePicture
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