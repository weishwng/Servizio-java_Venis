package com.example.demo.service;

import com.example.demo.model.Prodotto;
import com.example.demo.repository.ProdottoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProdottoService {

    private final ProdottoRepository repository;

    public ProdottoService(ProdottoRepository repository) {
        this.repository = repository;
    }

    public List<Prodotto> getProdotti() {
        return repository.findAll();
    }

    public Prodotto creaProdotto(Prodotto prodotto) {

        boolean esiste = repository
                .existsByNomeAndCategoriaAndPrezzoAndQuantita(
                        prodotto.getNome(),
                        prodotto.getCategoria(),
                        prodotto.getPrezzo(),
                        prodotto.getQuantita()
                );

        if (esiste) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Prodotto già esistente"
            );
        }

        return repository.save(prodotto);
    }

    public void eliminaProdotto(Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Prodotto non trovato"
            );
        }

        repository.deleteById(id);
    }
}
