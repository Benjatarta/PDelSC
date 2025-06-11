document.getElementById('formArchivo').addEventListener('submit', async (e) => {
  e.preventDefault();
  //creo constantes
  const archivo = document.getElementById('archivo').files[0];
  const formData = new FormData();
  //añadimos el archivo al formdata
  formData.append('archivo', archivo);

  //envia el archivo al servidor
  const res = await fetch('/api/subir', {
    method: 'POST',
    body: formData
  });
  //creo constantes
  const data = await res.json();
  const contenedor = document.getElementById('resultado');

  //creo el html con sus respectivos resultados
  contenedor.innerHTML = `
    <p>Válidos: ${data.totalValidos}</p>
    <p>Inválidos: ${data.totalInvalidos}</p>
    <p>Porcentaje válidos: ${data.porcentaje}%</p>
    <p>Números válidos ordenados:</p>
    <pre>${data.validos.join('\n')}</pre>
  `;
});
