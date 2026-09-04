package com.example.demo.controller;

import com.example.demo.dto.GiocatoreDto;
import com.example.demo.dto.ModificaGiocatoreRequest;
import com.example.demo.service.DrupalGiocatoriService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/giocatori")
public class GiocatoreController {

    private final DrupalGiocatoriService giocatoriService;

    public GiocatoreController(DrupalGiocatoriService giocatoriService) {
        this.giocatoriService = giocatoriService;
    }

    @GetMapping
    public List<GiocatoreDto> getGiocatori() {
        return giocatoriService.getGiocatori();
    }

    @PostMapping("/{id}")
    public ModificaGiocatoreRequest modificaGiocatore(
            @PathVariable String id,
            @RequestBody ModificaGiocatoreRequest richiesta) {

        UUID.fromString(id);

        System.out.println("POST ricevuto per giocatore: " + id);
        System.out.println("Nuovo nome: " + richiesta.nome());
        System.out.println("Nuovo cognome: " + richiesta.cognome());
        System.out.println("Nuovo numero: " + richiesta.numero());
        System.out.println("Nuovo ruolo: " + richiesta.ruolo());

        return richiesta;
    }
}