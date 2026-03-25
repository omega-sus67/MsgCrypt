package com.ttlVault.secretShare.Services;


import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class cryptoUtil {
    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int AES_KEY_SIZE = 256;// bits
    private static final int GCM_IV_LENGTH = 12;//bytes
    private static final int GCM_TAG_LENGTH = 128;//bits

    private static final SecureRandom secureRandom = new SecureRandom();

    public record EncryptedPayLoad (byte[] iv, byte[] cipherText){}

    public static SecretKey generateEphemeralKey(){
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(AES_KEY_SIZE, secureRandom);
            return keyGen.generateKey();
        }
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("critical : AES algorithm no on the JVM",e);
        }
    }

    public static EncryptedPayLoad encrypt(String plainText, SecretKey key){
        try {
            // generates an iv for each specific encryption
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            // initialize the cipher
            Cipher cipher = Cipher.getInstance(ALGORITHM);

            //configure the gcm specifications
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);

            //Arm the cipher in ENCRYPT_MODE
            cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);

            //execute the encryption
            byte[] ciphertext = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            return new EncryptedPayLoad(iv, ciphertext);
        }
        catch (Exception e) {
            throw new RuntimeException("Encryption Failed",e);
        }
    }
}
