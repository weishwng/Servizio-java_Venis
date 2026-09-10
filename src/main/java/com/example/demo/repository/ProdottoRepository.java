package com.example.demo.repository;

import com.example.demo.model.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdottoRepository extends JpaRepository<Prodotto, Long> {

    boolean existsByNomeAndPrezzoAndQuantita(
            String nome,
            Double prezzo,
            Integer quantita
    );
}
