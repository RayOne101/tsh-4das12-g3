package tn.esprit.tsh.marketplace.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.tsh.marketplace.dto.AnnonceRequest;
import tn.esprit.tsh.marketplace.dto.AnnonceResponse;
import tn.esprit.tsh.marketplace.entity.AnnonceMeuble;
import tn.esprit.tsh.marketplace.entity.StatutMeuble;
import tn.esprit.tsh.marketplace.entity.TypeOffre;
import tn.esprit.tsh.marketplace.exception.ForbiddenException;
import tn.esprit.tsh.marketplace.exception.ResourceNotFoundException;
import tn.esprit.tsh.marketplace.mapper.AnnonceMapper;
import tn.esprit.tsh.marketplace.repository.AnnonceMeubleRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AnnonceMeubleServiceImpl implements IAnnonceMeubleService {

    private final AnnonceMeubleRepository repository;

    public AnnonceMeubleServiceImpl(AnnonceMeubleRepository repository) {
        this.repository = repository;
    }

    @Override
    public AnnonceResponse creer(UUID vendeurId, String vendeurNom, AnnonceRequest dto) {
        AnnonceMeuble annonce = AnnonceMeuble.builder()
                .vendeurId(vendeurId)
                .vendeurNom(vendeurNom)
                .statut(StatutMeuble.ACTIVE)
                .datePublication(LocalDateTime.now())
                .build();
        appliquer(annonce, dto);
        return AnnonceMapper.toResponse(repository.save(annonce));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnonceResponse> lister() {
        return repository.findByStatutOrderByDatePublicationDesc(StatutMeuble.ACTIVE).stream()
                .map(AnnonceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnnonceResponse> listerMesAnnonces(UUID vendeurId) {
        return repository.findByVendeurIdAndStatutNotOrderByDatePublicationDesc(vendeurId, StatutMeuble.RETIREE).stream()
                .map(AnnonceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AnnonceResponse trouver(UUID id) {
        return AnnonceMapper.toResponse(chercherNonRetiree(id));
    }

    @Override
    public AnnonceResponse modifier(UUID id, UUID userId, AnnonceRequest dto) {
        AnnonceMeuble annonce = chercherNonRetiree(id);
        if (!annonce.getVendeurId().equals(userId)) {
            throw new ForbiddenException("Vous ne pouvez modifier que vos propres annonces");
        }
        appliquer(annonce, dto);
        return AnnonceMapper.toResponse(repository.save(annonce));
    }

    /** Suppression logique : l'annonce passe a RETIREE (les demandes liees restent coherentes). */
    @Override
    public void retirer(UUID id, UUID userId, boolean admin) {
        AnnonceMeuble annonce = chercherNonRetiree(id);
        if (!admin && !annonce.getVendeurId().equals(userId)) {
            throw new ForbiddenException("Vous ne pouvez retirer que vos propres annonces");
        }
        annonce.setStatut(StatutMeuble.RETIREE);
        repository.save(annonce);
    }

    private AnnonceMeuble chercherNonRetiree(UUID id) {
        return repository.findById(id)
                .filter(a -> a.getStatut() != StatutMeuble.RETIREE)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce", id));
    }

    private void appliquer(AnnonceMeuble annonce, AnnonceRequest dto) {
        annonce.setTitre(dto.titre().trim());
        annonce.setDescription(dto.description());
        annonce.setCategorie(dto.categorie());
        annonce.setTypeOffre(dto.typeOffre());
        annonce.setEtat(dto.etat());
        annonce.setVille(dto.ville().trim());
        // Un don est gratuit par definition.
        annonce.setPrix(dto.typeOffre() == TypeOffre.DON ? BigDecimal.ZERO : dto.prix());
    }
}
