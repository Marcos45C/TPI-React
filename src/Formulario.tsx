import { type ChangeEvent, type FC, type FormEvent, useState } from 'react'; 
export const Formulario:FC = () => {
     // Estados tipados 
  const [nombre, setNombre] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [mensaje, setMensaje] = useState<string>(''); 
  // Manejadores de cambio por input 
  const handleNombreChange = (e: 
ChangeEvent<HTMLInputElement>): void => { 
    setNombre(e.target.value); 
  }; 
  const handleEmailChange = (e: 
ChangeEvent<HTMLInputElement>): void => { 
    setEmail(e.target.value); 
  }; 
  const handleMensajeChange = (e: 
ChangeEvent<HTMLTextAreaElement>): void => { 
    setMensaje(e.target.value); 
  }; 
  // Manejador del envío del formulario 
  const handleSubmit = (e: FormEvent<HTMLFormElement>): 
void => { 
    e.preventDefault(); 
    console.log('📬 Enviando formulario:', { 
      nombre, 
      email, 
      mensaje, 
    }); 
    alert(`Gracias por tu mensaje, ${nombre}!`); 
    // Resetear el formulario 
    setNombre(''); 
    setEmail(''); 
    setMensaje(''); 
  }; 
  return ( 
    <form onSubmit={handleSubmit}> 
      <h2>📨 Contáctanos</h2> 
      <input 
        type="text" 
        placeholder="Tu nombre" 
        value={nombre} 
        onChange={handleNombreChange} 
      /> 
      <input 
        type="email" 
        placeholder="Tu correo" 
        value={email} 
        onChange={handleEmailChange} 
      /> 
      <textarea 
        placeholder="Escribe tu mensaje" 
        value={mensaje} 
        onChange={handleMensajeChange} 
      /> 
      <button type="submit">Enviar</button> 
    </form> 
  ); 
}; 