package com.example.demo.controller;

import com.example.demo.model.Prodotto;
import com.example.demo.service.ProdottoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prodotti")
public class ProdottoController {

    private final ProdottoService service;

    public ProdottoController(ProdottoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Prodotto> getProdotti() {
        return service.getProdotti();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Prodotto creaProdotto(@RequestBody Prodotto prodotto) {
        return service.creaProdotto(prodotto);
    }
}
