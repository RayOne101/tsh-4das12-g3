package tn.esprit.tsh.user.service;

import org.springframework.beans.factory.annotation.Autowired;
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
    private final UserEventProducer userEventProducer;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this(utilisateurRepository, null);
    }

    @Autowired
    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository,
                                  @Autowired(required = false) UserEventProducer userEventProducer) {
        this.utilisateurRepository = utilisateurRepository;
        this.userEventProducer = userEventProducer;
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
                .or(() -> {
                    Utilisateur nouvelUtilisateur = utilisateurRepository.save(Utilisateur.builder()
                            .keycloakId(keycloakId)
                            .email(email)
                            .nom(nom != null && !nom.isBlank() ? nom : email)
                            .role(role)
                            .verifie(true)
                            .build());
                    if (userEventProducer != null) {
                        userEventProducer.publierEvenement("USER_CREATED", email);
                    }
                    return Optional.of(nouvelUtilisateur);
                });
    }

    @Override
    public UtilisateurResponse mettreAJourPhoto(UUID id, String photoUrl) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        user.setPhotoUrl(photoUrl);
        return UtilisateurMapper.toResponse(utilisateurRepository.save(user));
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
            // Chaine vide = l'utilisateur a efface son numero ; null = champ non fourni.
            user.setTelephone(dto.telephone().isBlank() ? null : dto.telephone());
        }

        Utilisateur maj = utilisateurRepository.save(user);
        if (userEventProducer != null) {
            userEventProducer.publierEvenement("USER_UPDATED", maj.getEmail());
        }
        return UtilisateurMapper.toResponse(maj);
    }
}
