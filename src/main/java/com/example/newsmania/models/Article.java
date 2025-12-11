package com.example.newsmania.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Article {
    @Id
    @GeneratedValue
    private Long id;
    private String title;
    @NotBlank(message = "Description is required")
    @Column(length = 5000)  // YE LINE ADD KARO
    private String description;
    private String imageUrl;
    private String category;
    private boolean isMini;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isIsMini() { return isMini; }
    public void setIsMini(boolean isMini) { this.isMini = isMini; }
}