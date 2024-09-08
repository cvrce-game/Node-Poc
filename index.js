import express from 'express'

const PORT =3000;

const app = express();


app.get('/',(req, res)=> {
    res.send('This is Home Page..!!')
});

app.get('/about',(req, res)=> {
    res.send(`This is About Page..!!\n Hey ${req.query.name}. You are ${req.query.age} years old.`)
});

app.listen(PORT,()=> console.log(`Server Started ${PORT}`));