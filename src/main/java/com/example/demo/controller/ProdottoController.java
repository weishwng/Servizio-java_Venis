package com.example.demo.controller;

import com.example.demo.model.Prodotto;
import com.example.demo.service.ProdottoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminaProdotto(@PathVariable Long id) {
        service.eliminaProdotto(id);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgumentException(
            IllegalArgumentException e
    ) {
        return Map.of("errore", e.getMessage());
    }
}
