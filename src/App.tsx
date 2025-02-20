import { BrowserRouter } from "react-router";
import AppRoutes from "./components/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL || "/"}>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
