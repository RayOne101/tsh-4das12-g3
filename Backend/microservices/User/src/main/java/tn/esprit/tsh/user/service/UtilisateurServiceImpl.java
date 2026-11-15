package tn.esprit.tsh.user.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.tsh.user.entity.RoleType;
import tn.esprit.tsh.user.entity.Utilisateur;
import tn.esprit.tsh.user.repository.UtilisateurRepository;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UtilisateurServiceImpl implements IUtilisateurService {

    private static final String OTP_PREFIX = "OTP:";
    private static final Duration OTP_TTL = Duration.ofMinutes(5);

    private final UtilisateurRepository utilisateurRepository;
    private final StringRedisTemplate redisTemplate;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository,
                                  StringRedisTemplate redisTemplate) {
        this.utilisateurRepository = utilisateurRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Utilisateur creerCompte(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé: " + utilisateur.getEmail());
        }
        if (utilisateurRepository.existsByTelephone(utilisateur.getTelephone())) {
            throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé: " + utilisateur.getTelephone());
        }

        if (utilisateur.getRole() == null) {
            utilisateur.setRole(RoleType.ROLE_USER);
        }
        if (utilisateur.getVerifie() == null) {
            utilisateur.setVerifie(false);
        }
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public List<Utilisateur> listerUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    @Override
    public Optional<Utilisateur> trouverParId(UUID id) {
        return utilisateurRepository.findById(id);
    }

    @Override
    public Optional<Utilisateur> trouverParTelephone(String telephone) {
        return utilisateurRepository.findByTelephone(telephone);
    }

    @Override
    public Optional<Utilisateur> trouverParEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    @Override
    public Utilisateur mettreAJourProfil(UUID id, Utilisateur modif) {
        return utilisateurRepository.findById(id).map(user -> {
            if (modif.getNom() != null) user.setNom(modif.getNom());
            if (modif.getEmail() != null) user.setEmail(modif.getEmail());
            if (modif.getTelephone() != null) user.setTelephone(modif.getTelephone());
            return utilisateurRepository.save(user);
        }).orElse(null);
    }

    @Override
    public Utilisateur changerStatut(UUID id, RoleType role, Boolean verifie) {
        return utilisateurRepository.findById(id).map(user -> {
            if (role != null) user.setRole(role);
            if (verifie != null) user.setVerifie(verifie);
            return utilisateurRepository.save(user);
        }).orElse(null);
    }

    @Override
    public void supprimerUtilisateur(UUID id) {
        utilisateurRepository.deleteById(id);
    }

    @Override
    public String envoyerOtp(String telephone) {
        // 1. Générer code OTP à 6 chiffres
        String code = String.format("%06d", new Random().nextInt(999999));

        // 2. Sauvegarder dans Redis avec TTL de 5 minutes
        redisTemplate.opsForValue().set(OTP_PREFIX + telephone, code, OTP_TTL);

        System.out.println("==================================================");
        System.out.println(" [REDIS OTP] Numéro: " + telephone + " | Code: " + code + " (TTL: 5 min)");
        System.out.println("==================================================");

        return code;
    }

    @Override
    public boolean verifierOtp(String telephone, String code) {
        String key = OTP_PREFIX + telephone;
        String cachedCode = redisTemplate.opsForValue().get(key);

        if (cachedCode != null && cachedCode.equals(code)) {
            // Supprimer le code de Redis après utilisation
            redisTemplate.delete(key);

            // Activer le compte utilisateur dans PostgreSQL
            utilisateurRepository.findByTelephone(telephone).ifPresent(user -> {
                user.setVerifie(true);
                utilisateurRepository.save(user);
            });

            return true;
        }

        return false;
    }
}
