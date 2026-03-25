/**
 * Utilities for client-side Zero-Knowledge decryption using the Web Crypto API.
 */

/**
 * Converts a Base64 string to a Uint8Array.
 */
export const base64ToUint8 = (base64) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

/**
 * Decrypts a ciphertext using the provided Base64 key and IV.
 * @param {string} base64Ciphertext 
 * @param {string} base64Iv 
 * @param {string} base64Key 
 * @returns {Promise<string>} Plaintext
 */
export const decryptPayload = async (base64Ciphertext, base64Iv, base64Key) => {
    try {
        const ciphertext = base64ToUint8(base64Ciphertext);
        const iv = base64ToUint8(base64Iv);
        const keyData = base64ToUint8(base64Key);

        // Import the raw key for AES-GCM
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
        );

        // Decrypt the payload
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
                tagLength: 128 // Standard for AES-GCM
            },
            cryptoKey,
            ciphertext
        );

        // Decode the buffer back to a string
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt payload. The key might be invalid or the data corrupted.");
    }
};
