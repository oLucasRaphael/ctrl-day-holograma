# Ctrl Day — Holograma 3D (Pepper's Ghost)

Aplicação web interativa desenvolvida em **HTML, CSS e JavaScript (Three.js)** para projeção em pirâmide holográfica invertida de 4 faces durante o evento **Ctrl Day** (Ctrl+Play Vilhena).

## Estrutura do Projeto

```text
ctrl-day-holograma/
├── assets/
│   ├── logo.png       # Logo Ctrl+Play com fundo transparente
│   └── mascote.png    # Mascote com fundo transparente
├── index.html         # Estrutura principal e HUD de controles
├── style.css          # Fundo preto absoluto (#000000) e mira central
└── main.js            # Cena 3D e 4 viewports sincronizadas
```

## Como Executar

Como o projeto carrega texturas no Canvas WebGL, abra através de um servidor local (não clique direto no `index.html` via `file:///`):

**Com Python:**
```bash
python -m http.server 8000
```
Acesse `http://localhost:8000` no navegador.

**Com VS Code (Live Server):**
Clique com o botão direito em `index.html` > **Open with Live Server**.

## Controles de Teclado (Operação ao Vivo)

| Tecla | Ação |
| :--- | :--- |
| **`1`** | Exibe o **Mascote Ctrl+Play** com anel holográfico |
| **`2`** | Exibe a **Logo Ctrl+Play** com moldura neon |
| **`3`** | Exibe o **Foguete 3D** nas cores da marca |
| **`4`** | Exibe o **Núcleo de Robótica & Código** |
| **`+` / `-`** | Afasta ou aproxima as 4 projeções do centro (calibração da pirâmide) |
| **`S`** | Alterna a escala (tamanho) do objeto 3D |
| **`M`** | Mostra/oculta a mira central de alinhamento |
| **`H`** | Mostra/oculta o menu de ajuda na tela |
| **`F`** | Ativa/desativa o modo Tela Cheia |

## Calibração Física no Monitor

1. Deite o monitor horizontalmente em uma superfície nivelada (deixando espaço livre atrás para os cabos).
2. Abra a aplicação e pressione **`F`** para entrar em tela cheia.
3. Posicione a base menor da pirâmide invertida exatamente sobre a **mira central**.
4. Ajuste a distância com **`+`** e **`-`** até o reflexo flutuar centralizado nas 4 faces.
5. Pressione **`M`** e **`H`** para deixar a tela 100% preta.