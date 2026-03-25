package com.ttlVault.secretShare.Repositories;

import com.ttlVault.secretShare.document.SecretDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface mongoRepo extends MongoRepository<SecretDocument, String> {
}
