## 🌸 Digibouquet — versão pra sua namorada

Vou recriar o site inteiro com a mesma estética aquarela e fluxo de uso, conectado ao **seu próprio Supabase** (não Lovable Cloud), com um arquivo SQL prontinho pra você colar.

---

### 🎨 Estilo visual (igual ao original)

- Fundo creme suave (`#fcfbf8`)
- Tipografia monoespaçada para textos e botões
- Logo "Digibouquet" cursivo + ilustrações de flores em aquarela (hotlink direto de `assets.pauwee.com`)
- Layout minimalista, centralizado, com bastante respiro

---

### 📄 Páginas e fluxo

**1. Home (`/`)**
- Logo + flor peônia no topo
- Texto "beautiful flowers / delivered digitally"
- Botões: **BUILD A BOUQUET** (modo cor) · **BUILD IT IN BLACK AND WHITE** (modo mono) · **VIEW GARDEN**

**2. Construtor de buquê (`/bouquet?mode=color|mono`)** — múltiplas etapas:
- **Etapa 1 — Flores:** grade com 12 flores em aquarela (orquídea, tulipa, dália, anêmona, cravo, zínia, ranúnculo, girassol, lírio, margarida, peônia, rosa). Pode escolher de 6 a 10, com clique repetido para adicionar a mesma flor mais de uma vez.
- **Etapa 2 — Folhagens (greens):** seleciona quais folhagens entram na composição (eucalipto, samambaia, etc.).
- **Etapa 3 — Vaso/bush:** escolhe entre as opções de bush de fundo.
- **Etapa 4 — Pré-visualização:** mostra o buquê montado (flores espalhadas em cima do bush escolhido, com data automática embaixo).
- **Etapa 5 — Salvar no garden:** botão "ADD TO GARDEN" salva no Supabase, ou "DOWNLOAD" pra baixar como imagem.

**3. Garden (`/garden`)**
- Título "OUR GARDEN" + subtítulo
- Galeria em grid 3 colunas (responsivo) com todos os buquês salvos
- Cada buquê é renderizado a partir dos dados (flores, folhagens, vaso, data) — não imagem estática
- Ordenado do mais recente pro mais antigo

**4. 404** — mantém a página padrão

---

### 🔧 Estrutura técnica

- **Sem login.** Qualquer pessoa com o link pode criar e ver buquês (você vai compartilhar só com ela). Como você pediu pra não ter campo de remetente, todos os buquês são anônimos — só com data.
- **Supabase próprio:** crio um arquivo `src/integrations/supabase/client.ts` lendo as keys de variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) — você cola num `.env` local ou na Vercel quando publicar.
- **Arquivo `SUPABASE_SCHEMA.sql`** na raiz do projeto, prontinho pra colar no SQL Editor do Supabase. Ele cria:
  - Tabela `bouquets` com colunas: `id`, `mode` (color/mono), `flowers` (jsonb com array das flores escolhidas), `greens` (jsonb), `bush`, `created_at`
  - Row Level Security ligado
  - Policy de SELECT pública (qualquer um lê)
  - Policy de INSERT pública (qualquer um cria)
  - Sem UPDATE/DELETE público (ninguém apaga buquês alheios)
- **Renderização do buquê:** componente React que posiciona as flores em cima da imagem do bush usando coordenadas calculadas (mistura de aleatoriedade controlada + posições fixas) pra ficar parecido com o original.
- **Modo mono:** troca as URLs de `/color/flowers/...` por `/mono/flowers/...` no mesmo CDN.
- **Download como imagem:** usa `html2canvas` pra exportar a pré-visualização como PNG.

---

### 📋 O que você vai precisar fazer

1. Criar projeto no Supabase (ou usar um existente)
2. Colar o conteúdo de `SUPABASE_SCHEMA.sql` no SQL Editor → Run
3. Pegar **Project URL** e **anon public key** em Settings → API
4. Colar num `.env` na raiz do projeto:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. Pronto — preview funciona; quando publicar na Vercel, adicionar essas mesmas variáveis lá

---

### ⚠️ Observação sobre as imagens

As ilustrações de flores são da autora original (@pau_wee_) hospedadas em `assets.pauwee.com` — vamos referenciá-las direto via URL como você pediu. Se um dia o servidor dela cair ou ela bloquear hotlink, as imagens deixam de aparecer; nesse caso a gente troca por novas geradas com IA. Pra um presente pessoal isso normalmente não dá problema.