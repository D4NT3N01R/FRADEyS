
// Importamos la imagen de los assets
import UvmLabImg from '../../assets/UVMLab.jpg'

const PageBackground = () => (
  <div
    className="fixed inset-0 z-[-1] bg-cover bg-center opacity-20"
    // Usamos la imagen importada
    style={{ backgroundImage: `url(${UvmLabImg})` }} 
  />
);

export default PageBackground;