# fernando-m-aurelio.github.io

Portfólio pessoal de Fernando Montanari Aurélio: Engenheiro de Dados & Desenvolvedor Full Stack.

Site estático (HTML, CSS e JavaScript), sem etapa de build, publicado no GitHub Pages.
O 3D usa [Three.js](https://threejs.org) r160, incluído em `js/vendor/three/` e empacotado com esbuild (sem depender de CDN), com o avatar em `img/659f472fd054fa34a8fc9713.glb`.

## Rodar localmente

Basta abrir o `index.html` no navegador (funciona também via `file://`), ou servir a pasta:

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

## Estrutura

- `index.html`: conteúdo de todas as seções
- `css/style.css`: estilos (tokens no `:root`)
- `js/main.js`: interações, skills (dados em `skillGroups`), animações de scroll
- `js/card-projetos.js`: lista de projetos (`cardData`)
- `js/scene3d.js`: fonte do fundo de partículas e do avatar 3D
- `js/scene3d.bundle.js`: versão gerada de `scene3d.js` + Three.js, que é a que o site carrega
- `js/avatar-data.js`: o avatar `.glb` em base64, para carregar também via `file://`

## Editando o 3D

Depois de alterar `js/scene3d.js`, gere o bundle de novo:

```bash
npx esbuild@0.24.0 js/scene3d.js --bundle --format=iife --minify \
  --alias:three=./js/vendor/three/three.module.min.js --outfile=js/scene3d.bundle.js
```

Se trocar o avatar (`img/*.glb`), gere `js/avatar-data.js` de novo:

```bash
python3 -c "import base64; d=open('img/659f472fd054fa34a8fc9713.glb','rb').read(); open('js/avatar-data.js','w').write(\"window.__AVATAR_GLB = '\" + base64.b64encode(d).decode() + \"';\\n\")"
```
