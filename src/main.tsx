import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { cargarExtrasScanbar } from './lib/scanbar';

// Los componentes agregados desde Scan-bar se suman al catálogo antes del primer render (sin Scan-bar, al instante).
cargarExtrasScanbar().finally(() => createRoot(document.getElementById('root')!).render(<App />));
