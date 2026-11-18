package tn.esprit.tsh.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "keycloak_id", unique = true)
    private String keycloakId;

    @Column(unique = true)
    private String telephone;

    @Column(name = "photo_url", length = 512)
    private String photoUrl;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Builder.Default
    private Boolean verifie = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RoleType role = RoleType.ROLE_USER;
}
