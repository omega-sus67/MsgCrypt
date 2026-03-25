package com.ttlVault.secretShare.Controllers;

import com.ttlVault.secretShare.Services.vaultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vault")
public class VaultController {

        private final vaultService vaultService;

        public VaultController(vaultService vaultService) {
            this.vaultService = vaultService;
        }

        public record SecretRequest(String secretText) {}

        @PostMapping("/seal")
        public ResponseEntity<vaultService.VaultCreationResponse> seal(@RequestBody SecretRequest request) {
            // We pass the raw text to the service. The service handles the encryption,
            // saves the ciphertext, and hands us back the ID and the raw key.
            vaultService.VaultCreationResponse response = vaultService.sealSecret(request.secretText());

            return ResponseEntity.ok(response);
        }
    @GetMapping("/{id}")
    public ResponseEntity<vaultService.VaultRetrievalResponse> retrieve(@PathVariable String id) {
        return ResponseEntity.ok(vaultService.retrieveAndBurn(id));
    }
}

