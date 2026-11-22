package tn.esprit.tsh.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Service simple pour publier des événements Kafka.
 * Permet aux autres microservices (Communication, Notification, etc.) d'être informés
 * de manière asynchrone sans bloquer l'utilisateur.
 */
@Service
public class UserEventProducer {

    private static final Logger log = LoggerFactory.getLogger(UserEventProducer.class);
    public static final String TOPIC = "user-events";

    private final KafkaTemplate<String, String> kafkaTemplate;

    public UserEventProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Envoie un événement de profil utilisateur dans le topic Kafka.
     * Exemple de message : "USER_CREATED:etudiant@tsh.tn"
     */
    public void publierEvenement(String typeEvenement, String email) {
        String message = typeEvenement + ":" + email;
        try {
            kafkaTemplate.send(TOPIC, email, message);
            log.info("Événement Kafka publié sur le topic '{}' : {}", TOPIC, message);
        } catch (Exception e) {
            log.warn("Impossible d'envoyer l'événement Kafka (broker injoignable) : {}", e.getMessage());
        }
    }
}
