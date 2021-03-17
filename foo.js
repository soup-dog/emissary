
async function main() {
    console.log("entered main")

    var encoder = new TextEncoder("utf-8");
    var decoder = new TextDecoder("utf-8");
    var clearDataArrayBufferView = encoder.encode("Hello world!");

    
    var aesAlgorithmEncrypt = {
        name: "AES-CBC",
        // AesCbcParams
        iv: window.crypto.getRandomValues(new Uint8Array(16))
    };

    aesKey = await window.crypto.subtle.generateKey(aesAlgorithmKeyGen, true, ["encrypt", "decrypt"]);
    
    console.log(await window.crypto.subtle.exportKey("raw", aesKey))

    cipherText = await window.crypto.subtle.encrypt(aesAlgorithmEncrypt, aesKey, clearDataArrayBufferView);

    console.log(decoder.decode(cipherText))

    plainText = await window.crypto.subtle.decrypt(aesAlgorithmEncrypt, aesKey, cipherText);

    console.log(decoder.decode(plainText));

    console.log("exiting main")
}

main()