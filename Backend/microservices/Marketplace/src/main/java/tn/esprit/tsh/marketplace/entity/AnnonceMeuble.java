package tn.esprit.tsh.marketplace.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "annonces_meuble")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnonceMeuble {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /** Identifiant Keycloak (claim "sub" du JWT) du vendeur. */
    @Column(name = "vendeur_id", nullable = false)
    private UUID vendeurId;

    @Column(name = "vendeur_nom", nullable = false)
    private String vendeurNom;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieMeuble categorie;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_offre", nullable = false)
    private TypeOffre typeOffre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatMeuble etat;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    @Column(nullable = false, length = 100)
    private String ville;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutMeuble statut = StatutMeuble.ACTIVE;

    @Column(name = "date_publication", nullable = false)
    private LocalDateTime datePublication;
}
