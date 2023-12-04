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


const modelodeUsuario = mongoose.model('contas', new mongoose.Schema({
    email: String,
    password: String
}))


const modeloResenha = mongoose.model('resenhas', new mongoose.Schema({
    idUsu: {type: mongoose.Schema.Types.ObjectId, ref: 'contas'},
    resenha: String,
    totalEstrelas: Number,
    quantAva: Number,

}))

mongoose.connect('mongodb://127.0.0.1:27017/leticia')
 .then(()=>{

app.post('/get/', async (req,res)=>{
    const usuarioEncontrado = await modelodeUsuario.findOne({email: req.body.email, password: req.body.password})
    if(usuarioEncontrado === null){
       return res.send("Conta não existente")
    }
    console.log(usuarioEncontrado);
    res.send(usuarioEncontrado)
})
 
app.post('/createuser',async (req,res) =>{
    const usuarioCriado = await modelodeUsuario.create({email: req.body.email, password: req.body.password})
    res.send(usuarioCriado)
})


app.post('/createresenha',async (req,res) =>{
    let iduser = await modelodeUsuario.findOne({email: req.body.email})
    iduser = JSON.stringify(iduser._id) 
    var regex = iduser.split('"')

    const usuarioCriado = await modeloResenha.create( {idUsu: regex[1],
        resenha: req.body.resenha,
        totalEstrelas: 0,
        quantAva: 0}
    )
    res.send({ message: usuarioCriado })
})


app.post('/getresenha',async (req,res) =>{
    const resenha = await modelodeUsuario.findOne({_id:req.body.id})
    res.send(resenha)
})

app.get('/getresenhas',async (req,res) =>{
    const resenhas = await modeloResenha.find()
    res.send(resenhas)
})

app.put('/updateuser', async (req,res)=>{
    const usuarioAtualizado = await modelodeUsuario.findOneAndUpdate({email: req.body.email, password: req.body.password}, {email: req.body.newemail, password: req.body.newpassword})
    res.send({ message: "Dados atualizados com sucesso!" })
})
 
app.delete('/deleteuser', async (req,res)=>{
    const usuarioDeletado = await modelodeUsuario.deleteOne({email: req.body.email, password: req.body.password})
    res.send(usuarioDeletado)
})  

app.use((req,res)=>{
    res.send('Não foi possível encontrar sua rota')
})

app.listen(2800, ()=>console.log(`O servidor esta rodando nessa porta: ${2800}`))

})