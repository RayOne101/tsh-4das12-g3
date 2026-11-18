package tn.esprit.tsh.user.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ProfilUpdateRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsBlankNameAndInvalidEmail() {
        var violations = validator.validate(new ProfilUpdateRequest(" ", "not-an-email", null));

        assertThat(violations)
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("nom", "email");
    }

    @Test
    void acceptsValidProfile() {
        var violations = validator.validate(
                new ProfilUpdateRequest("Etudiant Test", "etudiant@tsh.tn", "21622334455"));

        assertThat(violations).isEmpty();
    }
}
