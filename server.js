const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const CAMINHO_JSON = 'noticias.json';

// [GET] Buscar notícias
app.get('/noticias', (req, res) => {
  fs.readFile(CAMINHO_JSON, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    res.json(JSON.parse(data));
  });
});

// [POST] Adicionar notícia
app.post('/noticias', (req, res) => {
  fs.readFile(CAMINHO_JSON, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo' });

    let noticias = JSON.parse(data);
    const nova = {
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      imagem: req.body.imagem,
      data: req.body.data || new Date().toLocaleDateString('pt-BR')
    };
    noticias.unshift(nova);

    fs.writeFile(CAMINHO_JSON, JSON.stringify(noticias, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Erro ao salvar notícia' });
      res.json(nova);
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
