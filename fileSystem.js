
const fs = require('fs')

// fs.writeFile('./demo.txt', '111', ()=>(
//   console.log('ok')
// ))

// fs.readFile('./demo1.txt', (error, data) => {
//   if (error) 
//     console.log(error);
//   else
//     console.log(data.toString());
// });

fs.mkdir('./cv', (error)=>{
  if(error)
    console.log(error)
  else
   console.log("OK")

})

// fs.unlink('./demo.txt', (error)=>{
//   if(error)
//     console.log(error)
//   else

//     console.log('sucessce delete')
// })