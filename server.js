const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração MongoDB Atlas
const uri = 'mongodb+srv://gabrielinsaner2020:8AgTehZmeoPu7M3Y@cluster0.yyv87hs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let collection;

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
async function conectarMongo() {
  try {
    await client.connect();
    const db = client.db("kgrp"); // Nome do banco
    collection = db.collection("noticias"); // Nome da coleção
    console.log("✅ Conectado ao MongoDB Atlas");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
  }
}

// GET - Listar todas as notícias
app.get('/noticias', async (req, res) => {
  const noticias = await collection.find().sort({ _id: -1 }).toArray();
  res.json(noticias);
});

// GET - Obter notícia por ID
app.get('/noticias/:id', async (req, res) => {
  try {
    const noticia = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.json(noticia);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// POST - Criar nova notícia
app.post('/noticias', async (req, res) => {
  const { titulo, conteudo, imagem, data } = req.body;
  const nova = { titulo, conteudo, imagem, data: data || new Date().toLocaleDateString('pt-BR') };
  const resultado = await collection.insertOne(nova);
  res.json({ _id: resultado.insertedId, ...nova });
});

// PUT - Editar notícia
app.put('/noticias/:id', async (req, res) => {
  const { titulo, conteudo, imagem } = req.body;
  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { titulo, conteudo, imagem } },
      { returnDocument: 'after' }
    );
    res.json(result.value);
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// DELETE - Apagar notícia
app.delete('/noticias/:id', async (req, res) => {
  try {
    await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}/noticias`);
  conectarMongo(); // Conecta ao banco assim que o servidor inicia
});
