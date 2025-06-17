const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const noticiasPath = path.join(__dirname, 'noticias.json');

app.use(cors());
app.use(express.json());

// Rota GET: retorna todas as notícias
app.get('/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar as notícias' });
  }
});

// Rota POST: adiciona nova notícia
app.post('/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    const nova = {
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      imagem: req.body.imagem,
      data: req.body.data || new Date().toLocaleDateString('pt-BR')
    };
    noticias.unshift(nova); // adiciona no início
    fs.writeFileSync(noticiasPath, JSON.stringify(noticias, null, 2));
    res.json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar a notícia' });
  }
});

// Rota PUT: editar notícia pelo índice
app.put('/noticias/:index', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    const index = parseInt(req.params.index);
    if (!noticias[index]) return res.status(404).json({ error: 'Notícia não encontrada' });

    noticias[index] = {
      ...noticias[index],
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      imagem: req.body.imagem
    };

    fs.writeFileSync(noticiasPath, JSON.stringify(noticias, null, 2));
    res.json(noticias[index]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao editar a notícia' });
  }
});

// Rota DELETE: deletar notícia pelo índice
app.delete('/noticias/:index', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    const index = parseInt(req.params.index);
    if (!noticias[index]) return res.status(404).json({ error: 'Notícia não encontrada' });

    const deletada = noticias.splice(index, 1);
    fs.writeFileSync(noticiasPath, JSON.stringify(noticias, null, 2));
    res.json({ success: true, deletada });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar a notícia' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
