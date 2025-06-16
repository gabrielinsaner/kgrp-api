const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const noticiasPath = path.join(__dirname, 'noticias.json');

app.use(cors());
app.use(express.json());

// GET - Retorna as notícias salvas
app.get('/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar as notícias' });
  }
});

// ✅ POST - Adiciona uma nova notícia
app.post('/noticias', (req, res) => {
  try {
    const { titulo, conteudo, imagem, data } = req.body;
    if (!titulo || !conteudo) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    const novaNoticia = {
      titulo,
      conteudo,
      imagem: imagem || '',
      data: data || new Date().toLocaleDateString('pt-BR')
    };

    let noticias = [];
    if (fs.existsSync(noticiasPath)) {
      const data = fs.readFileSync(noticiasPath, 'utf-8');
      noticias = JSON.parse(data);
    }

    noticias.unshift(novaNoticia); // Adiciona no topo
    fs.writeFileSync(noticiasPath, JSON.stringify(noticias, null, 2));

    res.status(201).json({ mensagem: '✅ Notícia adicionada com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar notícia:', err);
    res.status(500).json({ error: 'Erro ao salvar a notícia' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
