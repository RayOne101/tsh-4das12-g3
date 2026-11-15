package tn.esprit.tsh.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.tsh.user.dto.ProfilUpdateRequest;
import tn.esprit.tsh.user.dto.UtilisateurResponse;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.exception.ConflictException;
import tn.esprit.tsh.user.exception.ResourceNotFoundException;
import tn.esprit.tsh.user.mapper.UtilisateurMapper;
import tn.esprit.tsh.user.repository.UtilisateurRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UtilisateurServiceImpl implements IUtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UtilisateurResponse> listerUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(UtilisateurMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Utilisateur> trouverParId(UUID id) {
        return utilisateurRepository.findById(id);
    }

    /**
     * Keycloak gere l'inscription et l'authentification.
     * - ligne pre-existante (ex: admin insere en base) : on la relie par email au premier login ;
     * - nouvel utilisateur auto-enregistre : on cree sa ligne de profil depuis le JWT.
     */
    @Override
    public Optional<Utilisateur> trouverOuCreerParKeycloakId(String keycloakId, String email, String nom, RoleType role) {
        Optional<Utilisateur> existant = utilisateurRepository.findByKeycloakId(keycloakId);
        if (existant.isPresent()) {
            return existant;
        }
        if (email == null) {
            return Optional.empty();
        }
        return utilisateurRepository.findByEmail(email)
                .map(user -> {
                    user.setKeycloakId(keycloakId);
                    return utilisateurRepository.save(user);
                })
                .or(() -> Optional.of(utilisateurRepository.save(Utilisateur.builder()
                        .keycloakId(keycloakId)
                        .email(email)
                        .nom(nom != null && !nom.isBlank() ? nom : email)
                        .role(role)
                        .verifie(true)
                        .build())));
    }

    @Override
    public UtilisateurResponse mettreAJourProfil(UUID id, ProfilUpdateRequest dto) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));

        if (dto.email() != null && !dto.email().equalsIgnoreCase(user.getEmail())
                && utilisateurRepository.existsByEmail(dto.email())) {
            throw new ConflictException("Adresse email deja utilisee");
        }
        if (dto.telephone() != null && !dto.telephone().equals(user.getTelephone())
                && utilisateurRepository.existsByTelephone(dto.telephone())) {
            throw new ConflictException("Numero de telephone deja utilise");
        }

        if (dto.nom() != null) {
            user.setNom(dto.nom());
        }
        if (dto.email() != null) {
            user.setEmail(dto.email());
        }
        if (dto.telephone() != null) {
            user.setTelephone(dto.telephone());
        }
        return UtilisateurMapper.toResponse(utilisateurRepository.save(user));
    }

    @Override
    public UtilisateurResponse changerStatut(UUID id, RoleType role, Boolean verifie) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));

        if (role != null) {
            user.setRole(role);
        }
        if (verifie != null) {
            user.setVerifie(verifie);
        }
        return UtilisateurMapper.toResponse(utilisateurRepository.save(user));
    }
}
