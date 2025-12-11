// frontend/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Date and Time
    function updateDateTime() {
        const now = new Date();
        document.getElementById('date-time').innerText = 
            now.toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + 
            ' | ' + 
            now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Hamburger Menu Toggle
    // Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const closeMenu = document.createElement('div'); // Close X button
closeMenu.innerHTML = '&times;';
closeMenu.classList.add('close-menu');
navbar.appendChild(closeMenu); // Add X inside navbar

if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburger.classList.toggle('open');
        document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : 'auto';
    });

    closeMenu.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.classList.remove('open');
        document.body.style.overflow = 'auto';
    });

    // Close on link click
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            hamburger.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });
}

    // Fetch breaking news for ticker
    fetch('http://localhost:8080/api/news/articles')
        .then(res => res.json())
        .then(data => {
            const ticker = document.getElementById('ticker');
            if (ticker && data.length > 0) {
                ticker.innerHTML = data.slice(0, 5).map(a => `<span>${a.title}</span>`).join(' • ');
            }
        })
        .catch(err => console.error('Ticker fetch error:', err));

    // Scroll to top button
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            scrollTop.style.display = window.scrollY > 200 ? 'block' : 'none';
        });
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Home Page Logic
    if (typeof CATEGORY === 'undefined') {
        // Mini News
        fetch('http://localhost:8080/api/news/articles?mini=true')
            .then(res => res.json())
            .then(data => {
                const miniContainer = document.getElementById('mini-news');
                if (miniContainer) {
                    miniContainer.innerHTML = data.map(a => `
                        <div class="mini-item">
                            <h4>${a.title}</h4>
                            <p>${a.category}</p>
                        </div>
                    `).join('');
                }
            })
            .catch(err => console.error('Mini news error:', err));

        // Headline
        fetch('http://localhost:8080/api/news/articles')
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const art = data[0];
                    const headline = document.getElementById('headline');
                    if (headline) {
                        headline.innerHTML = `
                            <img src="${art.imageUrl}" alt="${art.title}" onerror="this.src='https://via.placeholder.com/800x400?text=Headline'">
                            <div class="headline-text">
                                <h1>${art.title}</h1>
                                <p>${art.description}</p>
                            </div>
                        `;
                    }
                }
            })
            .catch(err => console.error('Headline error:', err));

        // Category Articles
        const categories = ['India', 'World', 'Business', 'Tech', 'Sports', 'Entertainment', 'Education', 'Life & Style'];
        categories.forEach(cat => {
            const id = cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
            fetch(`http://localhost:8080/api/news/articles?category=${cat}`)
                .then(res => res.json())
                .then(data => {
                    const container = document.getElementById(`${id}-articles`);
                    if (container) {
                        container.innerHTML = data.slice(0, 4).map(a => `
                            <div class="article">
                                <img src="${a.imageUrl}" alt="${a.title}" onerror="this.src='https://via.placeholder.com/300x200?text=News'">
                                <h3>${a.title}</h3>
                                <p>${a.description.substring(0, 100)}...</p>
                            </div>
                        `).join('');
                    }
                })
                .catch(err => console.error(`Category ${cat} error:`, err));
        });

        // Load More Buttons
        document.querySelectorAll('.load-more').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category;
                const id = cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
                fetch(`http://localhost:8080/api/news/articles?category=${cat}`)
                    .then(res => res.json())
                    .then(data => {
                        const container = document.getElementById(`${id}-articles`);
                        const start = container.children.length;
                        const newArticles = data.slice(start, start + 4).map(a => `
                            <div class="article">
                                <img src="${a.imageUrl}" alt="${a.title}" onerror="this.src='https://via.placeholder.com/300x200'">
                                <h3>${a.title}</h3>
                                <p>${a.description.substring(0, 100)}...</p>
                            </div>
                        `).join('');
                        container.innerHTML += newArticles;
                    });
            });
        });
    } 
    // Category Page Logic
    else {
        fetch(`http://localhost:8080/api/news/articles?category=${CATEGORY}`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('category-articles');
                if (container) {
                    container.innerHTML = data.map(a => `
                        <div class="article">
                            <img src="${a.imageUrl}" alt="${a.title}" onerror="this.src='https://via.placeholder.com/400x250'">
                            <h3>${a.title}</h3>
                            <p>${a.description}</p>
                        </div>
                    `).join('');
                }
            })
            .catch(err => console.error('Category page error:', err));

        // Load more on category page
        const loadMoreBtn = document.querySelector('.load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Simulate loading more (or fetch with pagination)
                alert('Loading more articles...');
            });
        }
    }
});