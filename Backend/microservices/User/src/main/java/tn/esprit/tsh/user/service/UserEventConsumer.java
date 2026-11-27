package tn.esprit.tsh.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Service pour consommer les evenements Kafka.
 * Demontre la reception asynchrone des messages du bus d'evenements.
 */
@Service
public class UserEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(UserEventConsumer.class);

    @KafkaListener(topics = UserEventProducer.TOPIC, groupId = "${spring.kafka.consumer.group-id:user-service-group}")
    public void consommerEvenement(String message) {
        log.info("[KAFKA CONSUMER] Evenement recu du topic '{}' : {}", UserEventProducer.TOPIC, message);
    }
}
