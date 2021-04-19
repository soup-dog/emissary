export class User {
    username: string;
    profilePicture: ArrayBuffer;

    constructor(username: string, profilePicture: ArrayBuffer) {
        this.username = username;
        this.profilePicture = profilePicture;
    }

    async getPfpDataURL(): Promise<string> {
        let blob = new Blob([this.profilePicture]);

        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onloadend = () => resolve(<string>reader.result); // cast result to string (because it is a data url) and resolve promise
            reader.readAsDataURL(blob); // read the key as a data url
        });
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