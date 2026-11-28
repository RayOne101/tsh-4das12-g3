package tn.esprit.tsh.marketplace.service;

import tn.esprit.tsh.marketplace.dto.AnnonceRequest;
import tn.esprit.tsh.marketplace.dto.AnnonceResponse;

import java.util.List;
import java.util.UUID;

public interface IAnnonceMeubleService {
    AnnonceResponse creer(UUID vendeurId, String vendeurNom, AnnonceRequest dto);
    List<AnnonceResponse> lister();
    List<AnnonceResponse> listerMesAnnonces(UUID vendeurId);
    AnnonceResponse trouver(UUID id);
    AnnonceResponse modifier(UUID id, UUID userId, AnnonceRequest dto);
    void retirer(UUID id, UUID userId, boolean admin);
}
