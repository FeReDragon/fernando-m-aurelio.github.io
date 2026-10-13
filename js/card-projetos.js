const cardData = [
    {
        title: "LabSchool Manager",
        description: "Sistema de gestão educacional completo, com dashboard de cards dinâmicos e gráficos.",
        image: "img/layout-3.png",
        category: "fullstack",
        technologies: ["Angular", "C#", ".NET", "SQL Server", "Bootstrap"],
        featured: true,
        links: [
            { url: "https://github.com/FeReDragon/App-LabSchool-Manager", text: "Frontend", icon: "fab fa-angular" },
            { url: "https://github.com/FeReDragon/LabSchool-Manager-API", text: "Backend", icon: "fas fa-server" }
        ]
    },
    {
        title: "Health Mais Saúde",
        description: "Plataforma de monitoramento de indicadores de saúde com gráficos e autenticação.",
        image: "img/hms-portifolio.png",
        category: "fullstack",
        technologies: ["Angular", "C#", ".NET", "Chart.js", "JWT"],
        featured: true,
        links: [
            { url: "https://github.com/FeReDragon/App-portal-mais-saude", text: "Repositório", icon: "fab fa-github" }
        ]
    },
    {
        title: "App Delivery Lancheria",
        description: "Aplicativo de delivery com geolocalização e busca de endereço por CEP.",
        image: "img/applancheria2.png",
        category: "frontend",
        technologies: ["Angular", "TypeScript", "Leaflet", "ViaCEP API"],
        featured: true,
        links: [
            { url: "https://github.com/FeReDragon/App-Lancheria-Angular", text: "Repositório", icon: "fab fa-github" }
        ]
    },
    {
        title: "Site Banda Para Festas",
        description: "Site institucional responsivo para uma banda de eventos, em produção.",
        image: "img/BandaPAraFestas.png",
        category: "frontend",
        technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
        links: [
            { url: "https://www.bandaparafestas.com.br", text: "Visitar site", icon: "fas fa-arrow-up-right-from-square" }
        ]
    },
    {
        title: "App Conecta Rio Vermelho",
        description: "Aplicação para conectar a comunidade local.",
        image: "img/conectaRV.png",
        category: "fullstack",
        technologies: ["Angular", "Node.js", "MongoDB"],
        inDevelopment: true
    },
    {
        title: "Demo: App Delivery",
        description: "Vídeo do aplicativo de delivery em funcionamento.",
        videoLink: "https://www.youtube-nocookie.com/embed/CjW-nFlwaVA",
        category: "video",
        technologies: ["Angular", "Responsive Design"]
    },
    {
        title: "Demo: Health Mais Saúde",
        description: "Vídeo demonstrativo da plataforma de saúde.",
        videoLink: "https://www.youtube-nocookie.com/embed/k7Q7dnKbrD4",
        category: "video",
        technologies: ["Angular", "Chart.js", "Dashboard"]
    },
    {
        title: "Todos os repositórios",
        description: "Outros projetos, estudos e contribuições no GitHub.",
        image: "img/perfil-git.png",
        category: "github",
        technologies: ["Git", "GitHub", "Open Source"],
        links: [
            { url: "https://github.com/FeReDragon", text: "Ver GitHub", icon: "fab fa-github" }
        ]
    }
];

function createCard(card) {
    const status = card.inDevelopment
        ? '<span class="status dev"><i class="fas fa-code"></i> Em desenvolvimento</span>'
        : card.featured ? '<span class="status featured"><i class="fas fa-star"></i> Destaque</span>' : '';

    const media = card.image
        ? `<div class="project-media"><img src="${card.image}" alt="${card.title}" loading="lazy">${status}</div>`
        : `<div class="project-media"><iframe src="${card.videoLink}" title="${card.title}" loading="lazy" allowfullscreen></iframe></div>`;

    const actions = card.inDevelopment
        ? '<span class="link-btn disabled"><i class="fas fa-clock"></i>Em breve</span>'
        : (card.links || []).map(link => `
            <a href="${link.url}" target="_blank" rel="noopener" class="link-btn" aria-label="${link.text} - ${card.title}">
                <i class="${link.icon}"></i>${link.text}
            </a>`).join('');

    return `
        <article class="glass-card project-card tilt reveal" data-category="${card.category}">
            ${media}
            <div class="project-body">
                <h3>${card.title}</h3>
                <p>${card.description}</p>
                <div class="chips">${card.technologies.map(t => `<span>${t}</span>`).join('')}</div>
                ${actions ? `<div class="project-actions">${actions}</div>` : ''}
            </div>
        </article>`;
}

function filterProjects(category) {
    document.querySelectorAll('#project-filters .filter').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    document.querySelectorAll('.project-card').forEach(item => {
        const show = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hidden', !show);
    });
}

function initializeProjects() {
    const container = document.getElementById('cards-container');
    if (!container) return;
    container.innerHTML = cardData.map(createCard).join('');
    document.querySelectorAll('#project-filters .filter').forEach(btn => {
        btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
    });
}

initializeProjects();
