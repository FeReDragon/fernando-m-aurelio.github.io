const cardData = [
    {
        title: "App Delivery Lancheria",
        image: "img/applancheria2.png",
        link: "https://github.com/FeReDragon/App-Lancheria-Angular",
        buttonText: "Acesse Repositorio Frontend"
    },
    {
        title: "Video APP Delivery",
        videoLink: "https://www.youtube.com/embed/CjW-nFlwaVA?si=6s93SmkX8oEFdyRs"
    },
    {
        title: "Lab School Manager",
        image: "img/layout-3.png",
        links: [
            {
                url: "https://github.com/FeReDragon/App-LabSchool-Manager",
                text: "Acesse Repositorio Frontend"
            },
            {
                url: "https://github.com/FeReDragon/LabSchool-Manager-API",
                text: "Acesse Repositorio Backend"
            }
        ]
    },
    {
        title: "Health Mais Saúde",
        image: "img/hms-portifolio.png",
        link: "https://github.com/FeReDragon/App-portal-mais-saude",
        buttonText: "Acesse o Repositorio Frontend"
    },
    {
        title: "Video Health Mais Saude",
        videoLink: "https://www.youtube.com/embed/k7Q7dnKbrD4?si=z_sUvu7kcqY_l9Gf"
    },
    {
        title: "Web Site Banda Para Festas",
        image: "img/BandaPAraFestas.png",
        link: "https://www.bandaparafestas.com.br",
        buttonText: "Visite o Site da Banda"
    },
    {
        title: "App Conecta Rio Vermelho",
        image: "img/conectaRV.png",
        buttonText: "Em Desenvolvimento!"
    },
    {
        title: "Acesse Os Repositorios no GitHub",
        image: "img/perfil-git.png",
        link: "https://github.com/FeReDragon",
        buttonText: "Acesse o Repositorio"
    }
];


function createCard(card) {
    let cardContent = '';
    if (card.image) {
        cardContent += `<img src="${card.image}" class="card-img-top" alt="${card.title}">`;
    } else if (card.videoLink) {
        cardContent += `<iframe width="100%" height="250" src="${card.videoLink}" frameborder="0" allowfullscreen></iframe>`;
    }

    let linksContent = '';
    if (card.link) {
        linksContent += `<a href="${card.link}" target="_blank" class="btn btn-custom btn-sm mt-2">${card.buttonText}</a>`;
    }
    if (card.links) {
        card.links.forEach(link => {
            linksContent += `<a href="${link.url}" target="_blank" class="btn btn-custom btn-sm mt-2">${link.text}</a>`;
        });
    }

    return `
        <div class="col-lg-4 col-md-6 mb-5">
            <div class="card1 h-100">
                ${cardContent}
                <div class="card-body">
                    <h3 class="card-title">${card.title}</h3>
                    ${linksContent}
                </div>
            </div>
        </div>`;
}



const cardsContainer = document.getElementById('cards-container'); 
cardData.forEach(card => {
    cardsContainer.innerHTML += createCard(card);
});
