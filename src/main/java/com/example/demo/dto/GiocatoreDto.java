package com.example.demo.dto;

public record GiocatoreDto(
        String id,
        String nome,
        String cognome,
        Integer numero,
        String ruolo
) {
}