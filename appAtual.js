const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

const dotenv=require('dotenv')


if(process.env.OMG === "DEV"){
    dotenv.config({path:'./config/.env.dev'})
}
if(process.env.OMG === "PROD"){
    dotenv.config({path:'./config/.env.prod'})
}


const modeloUsuario = mongoose.model('Contas', new mongoose.Schema({
    email: String,
    password: String
}))

const modeloFilme = mongoose.model('Resenhas dos filmes', new mongoose.Schema({
    texto: String
}))

mongoose.connect('mongodb://127.0.0.1:27017/hehe')
 .then(()=>{
app.post('/get/', async (req,res)=>{
    const usuarioEncontrado = await modeloUsuario.findOne({email: req.body.email, password: req.body.password})
    if(usuarioEncontrado === null){
       return res.send("Essa conta é inexistente!")
    }
    console.log(usuarioEncontrado);
    res.send(usuarioEncontrado)
})
  
app.post('/post',async (req,res) =>{
    const usuarioCriado = await modeloUsuario.create({email: req.body.email, password: req.body.password})
    res.send(usuarioCriado)
})

app.put('/put', async (req,res)=>{
    const usuarioAtualizado = await modeloUsuario.findOneAndUpdate({email: req.body.email, password: req.body.password}, {email: req.body.newemail, password: req.body.newpassword})
    res.send({ message: "Seus dados foram atualizados" })
})
  
app.delete('/delete', async (req,res)=>{
    const usuarioDeletado = await modelodeUsuario.deleteOne({email: req.body.email, password: req.body.password})
    res.send(usuarioDeletado)
})  

app.post('/getFilmes/', async (req,res)=>{
    const resenhaEncontrada = await modeloFilme.findOne({texto: req.body.texto})
    if(resenhaEncontrada === null){
       return res.send("O filme que você procura não está disponível :(")
    }
    res.send(resenhaEncontrada)
})
  
app.post('/postFilmes',async (req,res) =>{
    const resenhaCriada = await modeloFilme.create({texto: req.body.texto})
    res.send(resenhaCriada)
})

app.put('/putFilmes', async (req,res)=>{
    const resenhaAtualizada = await modeloFilme.findOneAndUpdate({texto: req.body.texto}, {resenha: req.body.newResenha})
    res.send({ message: "Veja os resultados para a resenha que você quer:" })
})
  
app.delete('/deleteResenhas', async (req,res)=>{
    const resenhaDeletada = await modeloFilme.deleteOne({texto: req.body.texto})
    res.send(resenhaDeletada)
})  

app.use((req,res)=>{
    res.send('Rota não encontrada')
})

app.listen(2800, ()=>console.log(`Servidor rodando nessa porta: ${2800}`))

})