import fs from 'fs';

// const write = fs.writeFileSync('./test.txt', 'Hey There!. File 1');
// console.log(write)

// fs.writeFile('./test.txt', '\nHey There!, File2',(error)=>{
//     console.log(error)
// });

// const read = fs.readFileSync('./test.txt', 'utf-8');
// console.log(read)

// fs.readFile('./test.txt', 'utf-8',(error,result)=> {
//     if(error){
//         console.log(error);
//     } else {
//         console.log(result);
//     }
// });

fs.appendFileSync('./test.txt', `Hey There\n`);

const read = fs.readFileSync('./test.txt', 'utf-8');
console.log(read)

const stat = fs.statSync('./test.txt');
console.log(stat);