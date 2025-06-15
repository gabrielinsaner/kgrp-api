const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const noticiasPath = path.join(__dirname, 'noticias.json');

app.use(cors());
app.use(express.json());

// Rota GET para retornar as notícias do arquivo
app.get('/noticias', (req, res) => {
  try {
    const data = fs.readFileSync(noticiasPath, 'utf-8');
    const noticias = JSON.parse(data);
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar as notícias' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
