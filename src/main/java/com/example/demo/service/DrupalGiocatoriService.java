package com.example.demo.service;

import com.example.demo.dto.DrupalGiocatoriResponse;
import com.example.demo.dto.GiocatoreDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class DrupalGiocatoriService {

    private final RestClient restClient;

    public DrupalGiocatoriService(
            RestClient.Builder restClientBuilder,
            @Value("${drupal.base-url}") String baseUrl) {

        this.restClient = restClientBuilder
                .baseUrl(baseUrl)
                .build();
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
}