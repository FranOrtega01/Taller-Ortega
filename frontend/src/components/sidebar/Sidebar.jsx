import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside style={{ width: '150px', background: '#eee', padding: '1rem' }}>
      <h3>Menú</h3>
      <ul>
        <li><Link to="/presupuestos">Presupuestos</Link></li>
        <li><Link to="/trabajos">Trabajos</Link></li>
        <li><Link to="/siniestros">Siniestros</Link></li>
        <li><Link to="/facturacion">Facturacion</Link></li>
        <li><Link to="/proveedores">Proveedores</Link></li>
        <li><Link to="/compras">Compras</Link></li>
        <li><Link to="/companias">Companias</Link></li>
        <li><Link to="/clientes">Clientes</Link></li>
        <li><Link to="/vehiculos">Vehiculos</Link></li>
      </ul>
    </aside>
  )
}

export default Sidebar
