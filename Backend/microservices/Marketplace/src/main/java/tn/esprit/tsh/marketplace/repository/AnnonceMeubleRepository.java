package tn.esprit.tsh.marketplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.tsh.marketplace.entity.AnnonceMeuble;
import tn.esprit.tsh.marketplace.entity.StatutMeuble;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnonceMeubleRepository extends JpaRepository<AnnonceMeuble, UUID> {

    List<AnnonceMeuble> findByStatutOrderByDatePublicationDesc(StatutMeuble statut);

    List<AnnonceMeuble> findByVendeurIdAndStatutNotOrderByDatePublicationDesc(UUID vendeurId, StatutMeuble statut);
}
