const express = require("express")
const fs= require("fs")
const app = express()
app.use(express.urlencoded({extended:true}))


app.set('view engine', 'ejs')
     
app.post('/home', function(req,res){
  const salvar = JSON.stringify(req.body)
  fs.writeFileSync(`${req.body.email}.json`, salvar, (err) =>{
   if(err){
        res.send({message: err})
   }else{
         res.send({message: 'ok'})  
   }
  } )
 
})
app.get('/lista', function(req, res) {
   fs.readdir(__dirname, (err,files)=>{
     var dados = files.filter(file => file.includes('@') && file.includes('.json'))
     res.send( {dados: dados})
   
   })
 })
app.get('/dados/:email', (req,res)=>{
   var dados = req.params
   var dadosfinais = JSON.parse(fs.readFileSync(dados.email))
   res.send({dados: dadosfinais})
})
app.get('/apagar/:email', (req,res)=>{
   var dados = req.params
   if (fs.existsSync(dados.email)){
        res.send({message: 'ok'})
       fs.rmSync(dados.email)
   }else{
        res.send({message: 'erro'})
   }
})


app.listen(8080, () =>{
   console.log("programa funcionando")
})