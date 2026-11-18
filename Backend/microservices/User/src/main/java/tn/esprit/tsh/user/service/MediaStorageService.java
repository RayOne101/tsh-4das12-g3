package tn.esprit.tsh.user.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.util.Map;
import java.util.UUID;

/**
 * Stocke les images dans MinIO et renvoie leur URL publique.
 * Aucun binaire n'est conserve en base : seule l'URL est enregistree sur le profil.
 */
@Service
public class MediaStorageService {

    private static final long MAX_SIZE_BYTES = 2L * 1024 * 1024;
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp");

    private final MinioClient minioClient;
    private final String bucket;
    private final String publicUrl;

    public MediaStorageService(MinioClient minioClient,
                               @Value("${minio.bucket:tsh-avatars}") String bucket,
                               @Value("${minio.public-url:http://localhost:9000}") String publicUrl) {
        this.minioClient = minioClient;
        this.bucket = bucket;
        this.publicUrl = publicUrl;
    }

    /** Televerse une photo de profil et renvoie l'URL a enregistrer sur l'utilisateur. */
    public String uploadAvatar(String keycloakId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier image manquant");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image trop lourde (2 Mo maximum)");
        }
        String extension = ALLOWED_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Format non supporte (jpeg, png, webp)");
        }

        // Nom genere cote serveur : on ne fait jamais confiance au nom envoye par le client.
        String objectKey = "avatars/" + keycloakId + "/" + UUID.randomUUID() + "." + extension;

        try (InputStream content = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .stream(content, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Stockage des images indisponible", e);
        }

        return publicUrl + "/" + bucket + "/" + objectKey;
    }
}
