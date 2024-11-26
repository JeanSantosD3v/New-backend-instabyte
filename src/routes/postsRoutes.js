// Importa o Express para criar o servidor web
import express from "express";

// Importa o Multer para lidar com uploads de arquivos
import multer from "multer";
import cors from "cors";

const corsOptions = {
  origin:"http://localhost:8000", 
  optionsSuccessStatus: 200
}

// Importa funções para gerenciamento de posts do arquivo postsControllers.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsControllers.js";

// Configura o armazenamento para arquivos enviados pelo Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório onde os arquivos serão salvos
    cb(null, 'uploads/');  // Caminho relativo para a pasta 'uploads'
  },
  filename: function (req, file, cb) {
    // Mantém o nome original do arquivo enviado
    cb(null, file.originalname);
  }
});

// Cria uma instância do middleware Multer com o armazenamento configurado
const upload = multer({ storage });

// Função para definir rotas e associar middlewares
const routes = (app) => {
  // Permite que o Express processe requisições com corpo em JSON
  app.use(express.json());
  app.use(cors(corsOptions))
  // Rota para recuperar todos os posts (método GET)
  app.get("/posts", listarPosts);

  // Rota para criar um novo post (método POST)
  app.post("/posts", postarNovoPost);

  // Rota para upload de imagem e processamento (método POST)
  app.post("/upload", upload.single("imagem"), uploadImagem);
  app.put("/upload/:id", atualizarNovoPost)
};

// Exporta a função routes para uso na aplicação principal
export default routes;