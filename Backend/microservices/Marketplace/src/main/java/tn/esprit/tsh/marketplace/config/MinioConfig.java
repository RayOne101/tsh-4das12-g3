package tn.esprit.tsh.marketplace.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Client MinIO (stockage S3-compatible des images). */
@Configuration
public class MinioConfig {

    @Bean
    public MinioClient minioClient(@Value("${minio.url:http://localhost:9000}") String url,
                                   @Value("${minio.access-key:minioadmin}") String accessKey,
                                   @Value("${minio.secret-key:minioadmin}") String secretKey) {
        return MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();
    }
}
