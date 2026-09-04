package com.example.demo.dto;

import java.util.List;

public record DrupalGiocatoriResponse(
        List<DrupalGiocatore> data
) {
}