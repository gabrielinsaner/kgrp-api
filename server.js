const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './noticias.json';

function lerNoticias() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function salvarNoticias(noticias) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(noticias, null, 2));
}

// GET - Listar todas as notícias
app.get('/noticias', (req, res) => {
  const noticias = lerNoticias();
  res.json(noticias);
});

// GET - Pegar uma notícia por ID
app.get('/noticias/:id', (req, res) => {
  const noticias = lerNoticias();
  const noticia = noticias.find(n => n.id == req.params.id);
  if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
  res.json(noticia);
});

// POST - Criar nova notícia
app.post('/noticias', (req, res) => {
  const noticias = lerNoticias();
  const novaNoticia = {
    id: Date.now(),
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
    imagem: req.body.imagem,
    data: req.body.data || new Date().toLocaleDateString('pt-BR')
  };
  noticias.unshift(novaNoticia);
  salvarNoticias(noticias);
  res.json(novaNoticia);
});

// PUT - Editar notícia
app.put('/noticias/:id', (req, res) => {
  const noticias = lerNoticias();
  const index = noticias.findIndex(n => n.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Notícia não encontrada' });

  noticias[index] = {
    ...noticias[index],
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
    imagem: req.body.imagem || noticias[index].imagem
  };

  salvarNoticias(noticias);
  res.json(noticias[index]);
});

// DELETE - Apagar notícia
app.delete('/noticias/:id', (req, res) => {
  const noticias = lerNoticias();
  const novasNoticias = noticias.filter(n => n.id != req.params.id);
  salvarNoticias(novasNoticias);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
