package tn.esprit.tsh.user.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " introuvable: " + id);
    }
}
