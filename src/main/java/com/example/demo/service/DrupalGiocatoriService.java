package com.example.demo.service;

import com.example.demo.dto.DrupalGiocatoriResponse;
import com.example.demo.dto.GiocatoreDto;
import com.example.demo.dto.ModificaGiocatoreRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class DrupalGiocatoriService {

    private final RestClient restClient;
    private final String username;
    private final String password;

    public DrupalGiocatoriService(
            RestClient.Builder restClientBuilder,
            @Value("${drupal.base-url}") String baseUrl,
            @Value("${drupal.username}") String username,
            @Value("${drupal.password}") String password) {

        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .build();

        this.username = username;
        this.password = password;
    }

    public List<GiocatoreDto> getGiocatori() {

        DrupalGiocatoriResponse response = restClient
                .get()
                .uri("/jsonapi/node/giocatore")
                .retrieve()
                .body(DrupalGiocatoriResponse.class);

        return response.data().stream()
                .map(giocatore -> new GiocatoreDto(
                        giocatore.id(),
                        giocatore.attributes().field_nome(),
                        giocatore.attributes().field_cognome(),
                        giocatore.attributes().field_numero_maglia(),
                        giocatore.attributes().field_ruolo()
                ))
                .toList();
    }

    public void modificaGiocatore(
            String id,
            ModificaGiocatoreRequest richiesta) {

        Map<String, Object> body = Map.of(
                "data", Map.of(
                        "type", "node--giocatore",
                        "id", id,
                        "attributes", Map.of(
                                "field_nome", richiesta.nome(),
                                "field_cognome", richiesta.cognome(),
                                "field_numero_maglia", richiesta.numero(),
                                "field_ruolo", richiesta.ruolo()
                        )
                )
        );

        restClient
                .patch()
                .uri("/jsonapi/node/giocatore/{id}", id)
                .headers(headers -> {
                    headers.setBasicAuth(username, password);
                    headers.setAccept(List.of(
                            MediaType.valueOf("application/vnd.api+json")
                    ));
                    headers.setContentType(
                            MediaType.valueOf("application/vnd.api+json")
                    );
                })
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}