package com.example.newsmania.controllers;

import com.example.newsmania.models.Article;
import com.example.newsmania.models.Category;
import com.example.newsmania.services.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://127.0.0.1:5500") // Live Server URL
public class AdminController {

    private final NewsService service;

    public AdminController(NewsService service) {
        this.service = service;
    }

    // === ARTICLES ===
    @GetMapping("/articles")
    public List<Article> getAllArticles() {
        return service.getAllArticles();
    }

    @PostMapping("/articles")
    public ResponseEntity<?> addArticle(@Valid @RequestBody Article article) {
        try {
            Article saved = service.saveArticle(article); // Sirf save, no image download
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error saving article: " + e.getMessage());
        }
    }

    @PutMapping("/articles/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @Valid @RequestBody Article article) {
        try {
            article.setId(id);
            Article updated = service.saveArticle(article);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error updating article: " + e.getMessage());
        }
    }

    @DeleteMapping("/articles/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            service.deleteArticle(id);
            return ResponseEntity.ok("Article deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error deleting article: " + e.getMessage());
        }
    }

    // === CATEGORIES ===
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return service.getAllCategories();
    }

    @PostMapping("/categories")
    public ResponseEntity<?> addCategory(@Valid @RequestBody Category category) {
        try {
            Category saved = service.saveCategory(category);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error saving category: " + e.getMessage());
        }
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody Category category) {
        try {
            category.setId(id);
            Category updated = service.saveCategory(category);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error updating category: " + e.getMessage());
        }
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            service.deleteCategory(id);
            return ResponseEntity.ok("Category deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error deleting category: " + e.getMessage());
        }
    }
}