import { AuthProvider } from "../features/authentication/context/AuthContext";
import AppRouter from "./router";

function AppProviders() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default AppProviders;
