const express = require('express');
const app = express();
const handlebars = require('ejs')

//config template engine
//app.engine('handlebars', handlebars.engine({deafultLayout: 'main'}))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/login', function(req,res){
    res.render('login_page.ejs')
})

app.get('/home', function(req,res){
    res.render('home.ejs')
})

app.post('/signup', function(req,res){
    res.send('Formulário foi recebido')
})

app.listen(8080, ()=>{
    console.log('server está rodando na porta 8080')
})