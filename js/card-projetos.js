const cardData = [
    {
        title: "LabSchool Manager",
        description: "Sistema de gestão educacional completo com Angular e .NET",
        image: "img/layout-3.png",
        category: "fullstack",
        technologies: ["Angular", "C#", ".NET", "SQL Server", "Bootstrap"],
        featured: true,
        links: [
            {
                url: "https://github.com/FeReDragon/App-LabSchool-Manager",
                text: "Frontend",
                icon: "fab fa-angular"
            },
            {
                url: "https://github.com/FeReDragon/LabSchool-Manager-API",
                text: "Backend",
                icon: "fas fa-code"
            }
        ]
    },
    {
        title: "Health Mais Saúde",
        description: "Plataforma de monitoramento de indicadores de saúde",
        image: "img/hms-portifolio.png",
        category: "fullstack",
        technologies: ["Angular", "C#", ".NET", "Chart.js", "JWT"],
        featured: true,
        link: "https://github.com/FeReDragon/App-portal-mais-saude",
        buttonText: "Ver Repositório"
    },
    {
        title: "App Delivery Lancheria",
        description: "Aplicativo completo de delivery com geolocalização",
        image: "img/applancheria2.png",
        category: "fullstack",
        technologies: ["Angular", "TypeScript", "Leaflet", "ViaCEP API"],
        featured: true,
        link: "https://github.com/FeReDragon/App-Lancheria-Angular",
        buttonText: "Ver Repositório"
    },
    {
        title: "Demo - App Delivery",
        description: "Demonstração do aplicativo de delivery em funcionamento",
        videoLink: "https://www.youtube.com/embed/CjW-nFlwaVA?si=6s93SmkX8oEFdyRs",
        category: "frontend",
        technologies: ["Angular", "Responsive Design"]
    },
    {
        title: "Demo - Health Mais Saúde",
        description: "Vídeo demonstrativo da plataforma de saúde",
        videoLink: "https://www.youtube.com/embed/k7Q7dnKbrD4?si=z_sUvu7kcqY_l9Gf",
        category: "frontend",
        technologies: ["Angular", "Chart.js", "Dashboard"]
    },
    {
        title: "Site Banda Para Festas",
        description: "Website corporativo responsivo para banda musical",
        image: "img/BandaPAraFestas.png",
        category: "frontend",
        technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
        link: "https://www.bandaparafestas.com.br",
        buttonText: "Visitar Site"
    },
    {
        title: "App Conecta Rio Vermelho",
        description: "Aplicação para conectar a comunidade local (em desenvolvimento)",
        image: "img/conectaRV.png",
        category: "fullstack",
        technologies: ["Angular", "Node.js", "MongoDB"],
        status: "Em Desenvolvimento",
        inDevelopment: true
    },
    {
        title: "Portfólio no GitHub",
        description: "Acesse todos os meus projetos e contribuições",
        image: "img/perfil-git.png",
        category: "backend",
        technologies: ["Git", "GitHub", "Open Source"],
        link: "https://github.com/FeReDragon",
        buttonText: "Ver GitHub"
    }
];


// Estado da aplicação
let currentFilter = 'all';
let projectsContainer = null;

// Função para criar badge de tecnologia
function createTechBadge(tech) {
    return `<span class="tech-badge">${tech}</span>`;
}

// Função para criar ícone de status
function createStatusBadge(card) {
    if (card.inDevelopment) {
        return `<span class="status-badge in-development">
            <i class="fas fa-code"></i> Em Desenvolvimento
        </span>`;
    }
    if (card.featured) {
        return `<span class="status-badge featured">
            <i class="fas fa-star"></i> Destaque
        </span>`;
    }
    return '';
}

// Função para criar card moderno
function createCard(card) {
    const techBadges = card.technologies ? 
        card.technologies.map(tech => createTechBadge(tech)).join('') : '';
    
    const statusBadge = createStatusBadge(card);
    
    let mediaContent = '';
    if (card.image) {
        mediaContent = `
            <div class="project-image">
                <img src="${card.image}" class="card-img-top" alt="${card.title}" loading="lazy">
                ${statusBadge}
            </div>`;
    } else if (card.videoLink) {
        mediaContent = `
            <div class="project-video">
                <iframe 
                    width="100%" 
                    height="250" 
                    src="${card.videoLink}" 
                    frameborder="0" 
                    allowfullscreen
                    loading="lazy">
                </iframe>
                ${statusBadge}
            </div>`;
    }

    let actionsContent = '';
    if (card.inDevelopment) {
        actionsContent = `
            <div class="project-actions">
                <span class="btn btn-outline-secondary disabled">
                    <i class="fas fa-clock me-2"></i>Em Desenvolvimento
                </span>
            </div>`;
    } else if (card.links) {
        const links = card.links.map(link => `
            <a href="${link.url}" target="_blank" class="btn btn-custom" 
               aria-label="${link.text} - ${card.title}">
                <i class="${link.icon} me-2"></i>${link.text}
            </a>
        `).join('');
        actionsContent = `<div class="project-actions">${links}</div>`;
    } else if (card.link) {
        actionsContent = `
            <div class="project-actions">
                <a href="${card.link}" target="_blank" class="btn btn-custom"
                   aria-label="${card.buttonText} - ${card.title}">
                    <i class="fas fa-external-link-alt me-2"></i>${card.buttonText}
                </a>
            </div>`;
    }

    return `
        <div class="col-lg-4 col-md-6 mb-4 project-item" data-category="${card.category}" data-aos="fade-up">
            <article class="project-card h-100">
                ${mediaContent}
                <div class="card-body">
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-description">${card.description || ''}</p>
                    <div class="tech-stack-container">
                        ${techBadges}
                    </div>
                    ${actionsContent}
                </div>
            </article>
        </div>`;
}

// Função para filtrar projetos
function filterProjects(category) {
    currentFilter = category;
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Atualizar botões ativos
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    // Filtrar e animar projetos
    projectItems.forEach((item, index) => {
        const itemCategory = item.dataset.category;
        const shouldShow = category === 'all' || itemCategory === category;
        
        if (shouldShow) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Função para inicializar os projetos
function initializeProjects() {
    projectsContainer = document.getElementById('cards-container');
    
    if (!projectsContainer) {
        console.error('Container de projetos não encontrado');
        return;
    }
    
    // Renderizar projetos
    const projectsHTML = cardData.map(card => createCard(card)).join('');
    projectsContainer.innerHTML = projectsHTML;
    
    // Configurar filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            filterProjects(category);
        });
    });
    
    // Configurar lazy loading para imagens
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    console.log(`✅ ${cardData.length} projetos carregados com sucesso`);
}

// Função para gerenciar o scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
    setupSmoothScroll();
});

// Exportar funções para uso global se necessário
window.portfolioProjects = {
    filterProjects,
    initializeProjects,
    cardData
};
