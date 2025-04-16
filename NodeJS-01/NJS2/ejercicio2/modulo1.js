import fs from 'fs';

//creamos y exportamos la funcion crear
export function crear(){
fs.appendFile('archivo.html', '<html><body><h1>My Header</h1><p>My paragraph.</p></body></html>', function (err) {
  if (err) throw err;
  console.log('Saved!');
});
}