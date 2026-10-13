const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ===== Skills =====
const skillGroups = [
    {
        id: 'data', label: 'Engenharia de Dados', icon: 'fa-diagram-project',
        desc: 'Meu ponto mais forte hoje: pipelines de dados em produção no Google Cloud.',
        items: [
            ['Google Cloud', 'BigQuery, Cloud Composer e Cloud Run'],
            ['Apache Airflow', 'DAGs em produção, TaskGroups e orquestração entre DAGs'],
            ['dbt', 'Modelos silver/gold, MERGE com chave duplicada e backfills'],
            ['Kafka', 'Pipelines de captura integrados ao Airflow'],
            ['Medallion', 'Arquitetura raw → silver → gold em data warehouse'],
            ['Python', 'Operadores, upserts e guard clauses em pipelines'],
            ['Pimcore', 'MDM e normalização de dados']
        ],
        tags: ['BigQuery', 'Airflow', 'dbt', 'Kafka', 'Python', 'Composer', 'Cloud Run', 'GCP', 'Medallion', 'Pimcore']
    },
    {
        id: 'db', label: 'Bancos de Dados', icon: 'fa-database',
        desc: 'Bancos analíticos e transacionais, do legado ao moderno.',
        items: [
            ['PostgreSQL', 'Camada analítica e transacional'],
            ['Oracle', 'SQL*Plus, views e integração com ERP'],
            ['SQL Server', 'Projetos .NET e integrações'],
            ['Supabase', 'OLTP e migração entre organizações'],
            ['SQL multidialeto', 'Conversão de SQL entre dialetos (BigQuery → Oracle)']
        ],
        tags: ['PostgreSQL', 'Oracle', 'SQL Server', 'Supabase', 'SQL']
    },
    {
        id: 'dev', label: 'Backend & Frontend', icon: 'fa-code',
        desc: 'Aplicações completas que entregam os dados para quem precisa deles.',
        items: [
            ['Spring Boot', 'APIs em Java, incluindo projetos JHipster'],
            ['Node.js', 'Serviços e automações'],
            ['.NET / C#', 'APIs REST com Entity Framework Core'],
            ['Angular', 'Aplicações com TypeScript, Reactive Forms e rotas'],
            ['React', 'Com TypeScript e TanStack Query'],
            ['Jinja', 'Templates de relatórios automáticos enviados por WhatsApp']
        ],
        tags: ['Java', 'Spring Boot', 'Node.js', 'C#', '.NET', 'Angular', 'React', 'TypeScript', 'JHipster', 'Jinja']
    },
    {
        id: 'bi', label: 'BI & Analytics', icon: 'fa-chart-pie',
        desc: 'Painéis embarcados e camadas semânticas com segurança por cliente.',
        items: [
            ['Power BI Embedded', 'Service Principal e Row-Level Security multi-tenant'],
            ['Cube.js', 'Camada semântica e otimização de pré-agregações'],
            ['DAX', 'Leitura e entendimento de regras de painel']
        ],
        tags: ['Power BI', 'Cube.js', 'DAX', 'RLS']
    },
    {
        id: 'ops', label: 'Infra & DevOps', icon: 'fa-server',
        desc: 'Infraestrutura como código, entrega contínua e segurança na web.',
        items: [
            ['Docker', 'Imagens e contêineres para desenvolvimento e deploy'],
            ['CI/CD', 'Pipelines de build e deploy'],
            ['Terraform', 'Repositório de IaC'],
            ['Linux / WSL', 'Ambiente de trabalho do dia a dia'],
            ['Segurança web', 'CSP, HSTS e cabeçalhos HTTP'],
            ['SendGrid', 'Configuração multiaplicação e entregabilidade']
        ],
        tags: ['Docker', 'Terraform', 'CI/CD', 'Linux', 'CSP', 'SendGrid', 'Git']
    },
    {
        id: 'ai', label: 'IA & Produtividade', icon: 'fa-robot',
        desc: 'IA como parte do fluxo de engenharia, com processo e especificação.',
        items: [
            ['Claude Code', 'CLAUDE.md, agentes e plugins de memória'],
            ['Spec-Driven Development', 'Especificação antes da implementação'],
            ['Vertex AI', 'Primeiros projetos', true]
        ],
        tags: ['Claude Code', 'Vertex AI', 'SDD']
    },
    {
        id: 'next', label: 'Explorando', icon: 'fa-compass',
        desc: 'O que estou aprendendo e começando a usar agora.',
        items: [
            ['n8n + Z-API', 'Automações e integrações com WhatsApp', true],
            ['Microsoft Entra ID', 'Identidade e acesso, em fase de definição', true],
            ['Vertex AI', 'Modelos e IA generativa no GCP', true],
            ['TanStack Query', 'Gerência de estado do servidor no React', true]
        ],
        tags: ['n8n', 'Z-API', 'Entra ID', 'TanStack']
    }
];

function initSkills() {
    const tabs = document.getElementById('skill-tabs');
    const body = document.getElementById('skill-body');
    if (!tabs || !body) return;

    tabs.innerHTML = skillGroups.map((g, i) => `
        <button class="skill-tab" role="tab" data-id="${g.id}" aria-selected="${i === 0}">
            <i class="fas ${g.icon}"></i>${g.label}
        </button>`).join('');

    const select = id => {
        const group = skillGroups.find(g => g.id === id);
        tabs.querySelectorAll('.skill-tab').forEach(t => t.setAttribute('aria-selected', t.dataset.id === id));
        body.innerHTML = `
            <h3><i class="fas ${group.icon}"></i>${group.label}</h3>
            <p class="skill-desc">${group.desc}</p>
            <ul class="skill-list">
                ${group.items.map(([name, detail, isNew], i) => `
                    <li style="animation-delay:${i * 50}ms">
                        <strong>${name}${isNew ? '<span class="badge-new">novo</span>' : ''}</strong>
                        <span>${detail}</span>
                    </li>`).join('')}
            </ul>`;
        sphere?.highlight(group.tags);
    };

    tabs.addEventListener('click', e => {
        const tab = e.target.closest('.skill-tab');
        if (tab) select(tab.dataset.id);
    });

    const sphere = initTagSphere();
    select(skillGroups[0].id);
}

// Tag sphere: tags spread on a Fibonacci sphere, rotated with the pointer/drag.
function initTagSphere() {
    const el = document.getElementById('tag-sphere');
    if (!el) return null;

    const names = [...new Set(skillGroups.flatMap(g => g.tags))];
    const n = names.length;
    const tags = names.map((name, i) => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = name;
        el.appendChild(span);
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * Math.PI * (3 - Math.sqrt(5));
        return { el: span, name, x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
    });

    let vx = 0.003, vy = 0.004;
    let dragging = false, lastX = 0, lastY = 0, visible = false;

    el.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', e => {
        if (!dragging) return;
        vy = (e.clientX - lastX) * 0.0025;
        vx = -(e.clientY - lastY) * 0.0025;
        lastX = e.clientX; lastY = e.clientY;
    });
    el.addEventListener('pointerup', () => { dragging = false; });

    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(el);

    const palette = ['#42ff1c', '#40c9ff', '#eef2f7', '#a78bfa'];
    tags.forEach((t, i) => { t.el.style.color = palette[i % palette.length]; });

    const render = () => {
        const radius = el.clientWidth * 0.4;
        const cosX = Math.cos(vx), sinX = Math.sin(vx), cosY = Math.cos(vy), sinY = Math.sin(vy);
        for (const t of tags) {
            const y1 = t.y * cosX - t.z * sinX;
            const z1 = t.y * sinX + t.z * cosX;
            const x2 = t.x * cosY + z1 * sinY;
            const z2 = -t.x * sinY + z1 * cosY;
            t.x = x2; t.y = y1; t.z = z2;
            const scale = 0.6 + ((z2 + 1) / 2) * 0.4;
            t.el.style.transform = `translate(-50%, -50%) translate3d(${x2 * radius}px, ${y1 * radius}px, 0) scale(${scale})`;
            t.el.style.opacity = 0.25 + ((z2 + 1) / 2) * 0.75;
            t.el.style.zIndex = Math.round(z2 * 100) + 100;
            t.el.style.fontSize = `${Math.max(14, radius / 12)}px`;
        }
    };

    const tick = () => {
        if (!dragging) { vx += (0.002 - vx) * 0.02; vy += (0.003 - vy) * 0.02; }
        if (visible) render();
        requestAnimationFrame(tick);
    };
    if (reduceMotion) { vx = vy = 0; render(); } else { render(); tick(); }

    return {
        highlight(list) {
            el.classList.add('has-hl');
            tags.forEach(t => t.el.classList.toggle('hl', list.includes(t.name)));
        }
    };
}

// ===== Experience durations =====
function monthsSince(iso) {
    const start = new Date(iso + 'T00:00:00');
    const now = new Date();
    return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
}

function initDurations() {
    document.querySelectorAll('[data-duration-since]').forEach(el => {
        const m = monthsSince(el.dataset.durationSince);
        const y = Math.floor(m / 12), r = m % 12;
        const parts = [];
        if (y) parts.push(`${y} ano${y > 1 ? 's' : ''}`);
        if (r) parts.push(`${r} ${r > 1 ? 'meses' : 'mês'}`);
        el.textContent = parts.join(' e ');
    });
    document.querySelectorAll('[data-years-since]').forEach(el => {
        el.textContent = `${Math.floor(monthsSince(el.dataset.yearsSince) / 12)}+`;
    });
    document.getElementById('year').textContent = new Date().getFullYear();
}

// ===== Typed roles =====
function initTyped() {
    const el = document.getElementById('typed');
    if (!el || reduceMotion) return;
    const roles = ['Engenheiro de Dados', 'Desenvolvedor Full Stack', 'Airflow · dbt · BigQuery', 'Spring Boot · Angular', 'Google Cloud'];
    let role = 0, chars = roles[0].length, deleting = true;
    const step = () => {
        const text = roles[role];
        chars += deleting ? -1 : 1;
        el.textContent = text.slice(0, chars);
        let delay = deleting ? 35 : 70;
        if (!deleting && chars === text.length) { deleting = true; delay = 2200; }
        else if (deleting && chars === 0) { deleting = false; role = (role + 1) % roles.length; delay = 300; }
        setTimeout(step, delay);
    };
    setTimeout(step, 2600);
}

// ===== Nav, progress, reveal =====
function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const progress = document.querySelector('.scroll-progress');

    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', open);
        links.classList.toggle('open', open);
    });
    links.addEventListener('click', e => {
        if (e.target.closest('a')) {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('open');
        }
    });

    const navMap = new Map([...links.querySelectorAll('a')].map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navMap.forEach(a => a.classList.remove('active'));
            navMap.get(entry.target.id)?.classList.add('active');
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
}

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
            entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 6) * 80}ms`;
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => io.observe(el));
}

// ===== Pointer effects: tilt, card spotlight, cursor glow =====
function initPointerFx() {
    document.addEventListener('pointermove', e => {
        const card = e.target.closest?.('.glass-card');
        if (card) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }
    }, { passive: true });

    if (!finePointer || reduceMotion) return;

    const glow = document.querySelector('.cursor-glow');
    let gx = 0, gy = 0, tx = 0, ty = 0;
    document.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; }, { passive: true });
    const follow = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate3d(${gx - 210}px, ${gy - 210}px, 0)`;
        requestAnimationFrame(follow);
    };
    follow();

    document.addEventListener('pointerover', e => {
        const card = e.target.closest?.('.tilt');
        if (!card || card.dataset.tiltBound) return;
        card.dataset.tiltBound = '1';
        card.addEventListener('pointermove', ev => {
            const r = card.getBoundingClientRect();
            const px = (ev.clientX - r.left) / r.width - 0.5;
            const py = (ev.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateY(-4px)`;
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
}

// ===== Pipeline packets =====
function initPipeline() {
    const flow = document.getElementById('pipeline-flow');
    if (!flow || reduceMotion) return;
    for (let i = 0; i < 3; i++) {
        const p = document.createElement('span');
        p.className = 'packet';
        p.style.animationDelay = `${i * -1.66}s`;
        flow.appendChild(p);
    }
}

// ===== Contact (mailto) =====
function initContact() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        form.querySelectorAll('[required]').forEach(input => {
            const valid = input.value.trim() !== '';
            input.closest('.field').classList.toggle('invalid', !valid);
            if (!valid) ok = false;
        });
        if (!ok) return;
        const { name, subject, message } = Object.fromEntries(new FormData(form));
        const body = `${message}\n\n— ${name}`;
        window.location.href = `mailto:f3030ma@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

// If the 3D module never finishes (blocked script, no WebGL, slow network), show the photo instead.
setTimeout(() => {
    const stage = document.getElementById('avatar-stage');
    if (stage && !stage.classList.contains('loaded')) {
        (window.__3dErrors ??= []).push('timeout: o avatar não carregou em 12s');
        stage.classList.add('no-webgl');
    }
}, 12000);

initNav();
initDurations();
initTyped();
initSkills();
initPipeline();
initContact();
initPointerFx();
initReveal();
