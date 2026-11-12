import { Route, Routes } from 'react-router-dom';
import AppShell from './AppShell.jsx';
import Today from './Today.jsx';
import Order from './Order.jsx';
import Customize from './Customize.jsx';
import Cart from './Cart.jsx';
import Status from './Status.jsx';
import Stamps from './Stamps.jsx';
import Reserve from './Reserve.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Today />} />
        <Route path="order" element={<Order />} />
        <Route path="order/:id" element={<Customize />} />
        <Route path="cart" element={<Cart />} />
        <Route path="status/:id" element={<Status />} />
        <Route path="stamps" element={<Stamps />} />
        <Route path="reserve" element={<Reserve />} />
      </Route>
    </Routes>
  );
}
