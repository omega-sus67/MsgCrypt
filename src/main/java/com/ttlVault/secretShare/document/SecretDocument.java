package com.ttlVault.secretShare.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "secrets")
public class SecretDocument {
    @Id
    private String id;

    private String ciphertextBase64;
    private String ivBase64;

    @Indexed(expireAfter = "1h")
    private Instant createdAt;

    public SecretDocument(String ciphertextBase64, String ivBase64) {
        this.ciphertextBase64 = ciphertextBase64;
        this.ivBase64 = ivBase64;
        this.createdAt = Instant.now();
    }

    public String getId() {return id;}

    public String getCiphertextBase64() {return ciphertextBase64;}
     public String getIvBase64() {return ivBase64;}
}
