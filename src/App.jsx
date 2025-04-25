import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout y Providers
import Dashboard from "./layout/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { DisfracesProvider } from "./context/ProductosProvider";
import { EventosProvider } from "./context/EventosProvider";

// Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/login";
import Register from "./pages/register";
import Confirm from "./pages/Confirmar";
import ForgotPassword from "./pages/Forgot";
import ResetPassword from "./pages/Restablecer";
import Profile from "./pages/perfil";
import NotFound from "./pages/NotFound";
import Eventos from "./pages/Eventos";
import Searches from "./pages/Searches"; // Corregido el nombre del import
import Disfraces from "./pages/Disfraces";
import Administradores from "./pages/Administradores";
import Etiquetas from "./pages/Etiquetas"; // Agregado si faltaba

// Routes
import AuthLayout from "./layout/Auth";
import PrivateRoute from "./routes/PrivateRoutes";

function App() {
    return (
        <AuthProvider>
            <EventosProvider>
                <DisfracesProvider>
                    <Router>
                        <div className="app-container">
                            <div className="main-content">
                                <Routes>
                                    {/* 📌 Dashboard Layout */}
                                    <Route path="/" element={<Dashboard />}>
                                        <Route index element={<Home />} />
                                        <Route path="productos/:id" element={<ProductDetail />} />
                                        <Route path="searches" element={<Searches />} /> {/* Ruta corregida */}
                                        <Route
                                            path="perfil"
                                            element={
                                                <PrivateRoute allowedRoles={["admin", "usuario", "moderador"]}>
                                                    <Profile />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="eventos"
                                            element={
                                                <PrivateRoute allowedRoles={["admin", "moderador"]}>
                                                    <Eventos />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="disfraces"
                                            element={
                                                <PrivateRoute allowedRoles={["admin", "moderador"]}>
                                                    <Disfraces />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="etiquetas"
                                            element={
                                                <PrivateRoute allowedRoles={["admin", "moderador"]}>
                                                    <Etiquetas />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="administradores"
                                            element={
                                                <PrivateRoute allowedRoles={["admin"]}>
                                                    <Administradores />
                                                </PrivateRoute>
                                            }
                                        />
                                    </Route>

                                    {/* 📌 Authentication Routes */}
                                    <Route path="/login" element={<AuthLayout />}>
                                        <Route index element={<Login />} />
                                    </Route>
                                    <Route path="/register" element={<AuthLayout />}>
                                        <Route index element={<Register />} />
                                    </Route>
                                    <Route path="/confirm/:token" element={<Confirm />} />
                                    <Route path="/forgot/id" element={<ForgotPassword />} />
                                    <Route path="/recuperar-password/:token" element={<ResetPassword />} />

                                    {/* 📌 404 Page */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </DisfracesProvider>
            </EventosProvider>
        </AuthProvider>
    );
}

export default App;