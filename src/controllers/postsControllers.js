import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiServices.js"
// Importa as funções `getTodosPosts` e `criarPost` do módulo `postsModel` para interagir com o banco de dados.
// Importa o módulo `fs` para realizar operações no sistema de arquivos, como renomear arquivos.

export async function listarPosts (req, res) {
  // Assinatura da função: `listarPosts(req, res)`
  //   - `req`: Objeto de requisição HTTP, contendo informações sobre a requisição.
  //   - `res`: Objeto de resposta HTTP, usado para enviar a resposta ao cliente.

  // Chama a função `getTodosPosts` para buscar todos os posts do banco de dados.
  const posts = await getTodosPosts();

  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON.
  res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
  // Assinatura da função: `postarNovoPost(req, res)`
  //   - `req`: Objeto de requisição HTTP, contendo os dados do novo post no corpo da requisição.
  //   - `res`: Objeto de resposta HTTP, usado para enviar a resposta ao cliente.

  // Obtém os dados do novo post do corpo da requisição.
  const novoPost = req.body;

  // Bloco `try...catch` para lidar com possíveis erros durante a criação do post.
  try {
    // Chama a função `criarPost` para inserir o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);

    // Envia uma resposta HTTP com status 200 (OK) e o post criado no formato JSON.
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para fins de depuração.
    console.error(erro.message);

    // Envia uma resposta HTTP com status 500 (Erro interno do servidor) e uma mensagem de erro genérica.
    res.status(500).json({"Erro":"Falha na requisição"});
  }
}

export async function uploadImagem(req, res) {
  // Assinatura da função: `uploadImagem(req, res)`
  //   - `req`: Objeto de requisição HTTP, contendo o arquivo da imagem.
  //   - `res`: Objeto de resposta HTTP, usado para enviar a resposta ao cliente.

  // Cria um objeto com os dados do novo post, incluindo o nome original do arquivo da imagem.
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };

  // Bloco `try...catch` para lidar com possíveis erros durante a criação do post e o upload da imagem.
  try {
    // Chama a função `criarPost` para inserir o novo post no banco de dados.
    const postCriado = await criarPost(novoPost);

    // Gera um novo nome para o arquivo da imagem, usando o ID do post criado.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

    // Renomeia o arquivo da imagem para o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada);

    // Envia uma resposta HTTP com status 200 (OK) e o post criado no formato JSON.
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para fins de depuração.
    console.error(erro.message);

    // Envia uma resposta HTTP com status 500 (Erro interno do servidor) e uma mensagem de erro genérica.
    res.status(500).json({"Erro":"Falha na requisição"});
  }
}

export async function atualizarNovoPost(req, res){
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`

    try { 
      const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
      const descricao = await gerarDescricaoComGemini(imageBuffer)

      const post = {
        imgUrl: urlImagem,
        descricao: descricao,
        alt: req.body.alt
      }
    const postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição"});
  }
}
