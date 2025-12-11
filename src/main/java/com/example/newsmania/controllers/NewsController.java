package com.example.newsmania.controllers;

import com.example.newsmania.models.Article;
import com.example.newsmania.services.NewsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService service;

    public NewsController(NewsService service) {
        this.service = service;
    }

    @GetMapping("/articles")
    public List<Article> getArticles(@RequestParam(required = false) String category, @RequestParam(required = false) Boolean mini) {
        if (category != null) {
            return service.getArticlesByCategory(category);
        } else if (mini != null) {
            return service.getArticlesByMini(mini);
        }
        return service.getAllArticles();
    }
}