package com.example.demo.dto;

public record ModificaGiocatoreRequest(
        String nome,
        String cognome,
        Integer numero,
        String ruolo
) {
}