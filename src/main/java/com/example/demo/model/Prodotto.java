package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "prodotto")
public class Prodotto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private Double prezzo;

    private Integer quantita;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "prodotto_categoria",
        joinColumns = @JoinColumn(name = "id_prodotto"),
        inverseJoinColumns = @JoinColumn(name = "id_categoria")
    )
    @JsonIgnore
    private Set<Categoria> categorie = new HashSet<>();

    public Prodotto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public Integer getQuantita() {
        return quantita;
    }

    public void setQuantita(Integer quantita) {
        this.quantita = quantita;
    }

    @JsonIgnore
    public Set<Categoria> getCategorieEntity() {
        return categorie;
    }

    @JsonIgnore
    public void setCategorieEntity(Set<Categoria> categorie) {
        this.categorie = categorie;
    }

    
    //Nuovo formato JSON:
    //"categoria_ids": [1, 2]
    
    @JsonProperty("categoria_ids")
    public Set<Integer> getCategoriaIds() {
        return categorie.stream()
                .map(Categoria::getId)
                .collect(Collectors.toSet());
    }

    @JsonProperty("categoria_ids")
    public void setCategoriaIds(Set<Integer> ids) {
        this.categorie = new HashSet<>();
        if (ids != null) {
            for (Integer id : ids) {
                Categoria c = new Categoria();
                c.setId(id);
                this.categorie.add(c);
            }
        }
    }

    @JsonProperty("categorie")
    public Set<String> getNomiCategorie() {
        return categorie.stream()
                .map(Categoria::getNome)
                .collect(Collectors.toSet());
    }
}
