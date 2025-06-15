const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const noticiasPath = path.join(__dirname, 'noticias.json');

app.use(cors());
app.use(express.json());

// Carrega as notícias do arquivo JSON
function carregarNoticias() {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Salva as notícias no arquivo JSON
function salvarNoticias(noticias) {
  fs.writeFileSync(noticiasPath, JSON.stringify(noticias, null, 2));
}

// GET: Lista todas as notícias
app.get('/noticias', (req, res) => {
  const noticias = carregarNoticias();
  res.json(noticias);
});

// GET: Uma notícia específica (por índice no array)
app.get('/noticias/:id', (req, res) => {
  const noticias = carregarNoticias();
  const noticia = noticias[req.params.id];
  if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
  res.json(noticia);
});

// POST: Adiciona uma nova notícia
app.post('/noticias', (req, res) => {
  const noticias = carregarNoticias();
  const nova = {
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
    imagem: req.body.imagem || '',
    data: req.body.data || new Date().toLocaleDateString('pt-BR')
  };
  noticias.unshift(nova);
  salvarNoticias(noticias);
  res.json(nova);
});

// DELETE: Remove notícia por índice
app.delete('/noticias/:id', (req, res) => {
  const noticias = carregarNoticias();
  const index = parseInt(req.params.id);
  if (isNaN(index) || index < 0 || index >= noticias.length) {
    return res.status(404).json({ error: 'Notícia não encontrada' });
  }
  const removida = noticias.splice(index, 1);
  salvarNoticias(noticias);
  res.json({ success: true, removida });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
