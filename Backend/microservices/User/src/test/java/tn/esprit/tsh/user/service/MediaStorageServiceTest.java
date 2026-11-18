package tn.esprit.tsh.user.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MediaStorageServiceTest {

    @Mock
    private MinioClient minioClient;

    private MediaStorageService service;

    @BeforeEach
    void setUp() {
        service = new MediaStorageService(minioClient, "tsh-avatars", "http://localhost:9000");
    }

    @Test
    void uploadsImageAndReturnsPublicUrl() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png", new byte[]{1, 2, 3});

        String url = service.uploadAvatar("kc-user", file);

        assertThat(url).startsWith("http://localhost:9000/tsh-avatars/avatars/kc-user/");
        assertThat(url).endsWith(".png");
        verify(minioClient).putObject(any(PutObjectArgs.class));
    }

    @Test
    void rejectsNonImageContentType() {
        MockMultipartFile file = new MockMultipartFile("file", "notes.pdf", "application/pdf", new byte[]{1});

        assertThatThrownBy(() -> service.uploadAvatar("kc-user", file))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Format non supporte");
    }

    @Test
    void rejectsImageAboveTwoMegabytes() {
        byte[] tooLarge = new byte[2 * 1024 * 1024 + 1];
        MockMultipartFile file = new MockMultipartFile("file", "big.jpg", "image/jpeg", tooLarge);

        assertThatThrownBy(() -> service.uploadAvatar("kc-user", file))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("trop lourde");
    }
}
