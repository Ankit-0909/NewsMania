package com.example.newsmania.services;

import com.example.newsmania.models.Article;
import com.example.newsmania.models.Category;
import com.example.newsmania.repositories.ArticleRepository;
import com.example.newsmania.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {
    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;

    public NewsService(ArticleRepository articleRepository, CategoryRepository categoryRepository) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public List<Article> getArticlesByCategory(String category) {
        return articleRepository.findByCategory(category);
    }

    public List<Article> getArticlesByMini(boolean mini) {
        return articleRepository.findByIsMini(mini);
    }

    public Article saveArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}