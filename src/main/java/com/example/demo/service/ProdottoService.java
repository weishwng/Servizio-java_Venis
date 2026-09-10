package com.example.demo.service;

import com.example.demo.model.Categoria;
import com.example.demo.model.Prodotto;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.ProdottoRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProdottoService {

    private final ProdottoRepository repository;
    private final CategoriaRepository categoriaRepository;

    public ProdottoService(
            ProdottoRepository repository,
            CategoriaRepository categoriaRepository
    ) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Prodotto> getProdotti() {
        return repository.findAll();
    }

    public Prodotto creaProdotto(Prodotto prodotto) {

        if (prodotto.getNome() == null || prodotto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Il nome del prodotto è obbligatorio");
        }

        if (prodotto.getPrezzo() == null) {
            throw new IllegalArgumentException("Il prezzo è obbligatorio");
        }

        if (prodotto.getQuantita() == null) {
            throw new IllegalArgumentException("La quantità è obbligatoria");
        }

        Set<Categoria> categorieInput = prodotto.getCategorieEntity();

        if (categorieInput == null || categorieInput.isEmpty()) {
            throw new IllegalArgumentException("Almeno una categoria è obbligatoria");
        }

        Set<Categoria> categorieTrovate = new HashSet<>();

        for (Categoria c : categorieInput) {
            Categoria trovata = categoriaRepository
                    .findById(c.getId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Categoria non trovata: " + c.getId()
                            )
                    );
            categorieTrovate.add(trovata);
        }

        prodotto.setCategorieEntity(categorieTrovate);

        boolean esiste = repository
                .existsByNomeAndPrezzoAndQuantita(
                        prodotto.getNome(),
                        prodotto.getPrezzo(),
                        prodotto.getQuantita()
                );

        if (esiste) {
            throw new IllegalArgumentException("Prodotto già esistente");
        }

        return repository.save(prodotto);
    }

    public void eliminaProdotto(Long id) {

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Prodotto non trovato");
        }

        repository.deleteById(id);
    }
}
