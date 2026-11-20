package tn.esprit.tsh.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tsh.user.entity.Utilisateur;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByKeycloakId(String keycloakId);
    boolean existsByEmail(String email);
    boolean existsByTelephone(String telephone);
}
