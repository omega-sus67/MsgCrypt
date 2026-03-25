package com.ttlVault.secretShare.Services;


import com.ttlVault.secretShare.Repositories.mongoRepo;
import com.ttlVault.secretShare.document.SecretDocument;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;

@Service
public class vaultService {
    private final mongoRepo mongoRepo;
    public vaultService(mongoRepo mongoRepo) {
        this.mongoRepo = mongoRepo;
    }

    public record VaultCreationResponse(String id, String secret) {}
    public VaultCreationResponse sealSecret(String plaintext) {
        //1. Generate the highly volatile AES-256 key
        SecretKey ephemeralKey = cryptoUtil.generateEphemeralKey();

        //2. Encrypt the plaintext (CryptoUtil handles the IV generation)
        cryptoUtil.EncryptedPayLoad payLoad = cryptoUtil.encrypt(plaintext, ephemeralKey);

        // 3. Encode binary arrays to Base64 strings for storage and transmission
        String base64Ciphertext = Base64.getEncoder().encodeToString(payLoad.cipherText());
        String base64Iv = Base64.getEncoder().encodeToString(payLoad.iv());
        String base64Key = Base64.getEncoder().encodeToString(ephemeralKey.getEncoded());

        //4. Save the encrypted data and iv to mongodb
        SecretDocument secretDocument = new SecretDocument(base64Ciphertext, base64Iv);
        secretDocument = mongoRepo.save(secretDocument);

        //5. return  the document id ,and encryptionkey to the controller
        return new VaultCreationResponse(secretDocument.getId(),  base64Key);
    }

    public record VaultRetrievalResponse(String base64Ciphertext, String base64Iv) {}
    public VaultRetrievalResponse retrieveAndBurn(String id) {
        // Fetch the document. If its missing, it either expired via TTL or was already read.
        SecretDocument document = mongoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Secret completely vaporized, obliterated to oblivion or never existed. prolly teehee"));

        // The core burn mechanic. Once it is fetched, destroy it in the database.
        mongoRepo.delete(document);

        return new VaultRetrievalResponse(document.getCiphertextBase64(), document.getIvBase64());
    }

}
