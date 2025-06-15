const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Conexão com MongoDB Atlas (corrigida)
mongoose.connect('mongodb+srv://gabrielinsaner2020:8AgTehZmeoPu7M3Y@cluster0.yyv87hs.mongodb.net/kgrp?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB Atlas'))
.catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Modelo de Notícia
const noticiaSchema = new mongoose.Schema({
  titulo: String,
  conteudo: String,
  imagem: String,
  data: String
});
const Noticia = mongoose.model('Noticia', noticiaSchema);

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.get('/noticias', async (req, res) => {
  const noticias = await Noticia.find().sort({ _id: -1 });
  res.json(noticias);
});

app.get('/noticias/:id', async (req, res) => {
  const noticia = await Noticia.findById(req.params.id);
  if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
  res.json(noticia);
});

app.post('/noticias', async (req, res) => {
  const nova = new Noticia({
    titulo: req.body.titulo,
    conteudo: req.body.conteudo,
    imagem: req.body.imagem,
    data: req.body.data || new Date().toLocaleDateString('pt-BR')
  });
  await nova.save();
  res.json(nova);
});

app.put('/noticias/:id', async (req, res) => {
  const noticia = await Noticia.findByIdAndUpdate(
    req.params.id,
    {
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      imagem: req.body.imagem
    },
    { new: true }
  );
  if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
  res.json(noticia);
});

app.delete('/noticias/:id', async (req, res) => {
  const resultado = await Noticia.findByIdAndDelete(req.params.id);
  if (!resultado) return res.status(404).json({ error: 'Notícia não encontrada' });
  res.json({ success: true });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
});
