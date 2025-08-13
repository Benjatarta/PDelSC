import Holamundo from './components/hola';
import './App.css';
import Tarjeta from './components/tarjeta';
import Contador from './components/contador';
import Lista from './components/lista';
import Formulario from './components/formulario';

function App() {
  return <>
  <Holamundo></Holamundo> 
  <Tarjeta Nombre="Vegito" Apellido="Gogeta" Profesion="Guerrero Z" Imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6gfLLuBMX8lvm5LvQbimZ3Ao0Uj12Ner6kBI-tKfB9N1t1qs&s"
  />
  <Contador></Contador>
  <Lista></Lista>
  <Formulario></Formulario>
  </>
}
export default App;
