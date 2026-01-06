import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserContextProvider from "./context/Usercontext";
import ToastProvider from "./context/Toastcontext";
import Layout from "./components/Layout";
import { GameProvider } from "./context/GameContext";
import ConversationChat from "./pages/conversation/[id]";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GameProvider>
          <UserContextProvider>
            <Routes>
              <Route path="/" element={<Layout> <Index /> </Layout>} />
              <Route path="/conversation/:id" element={<Layout> <ConversationChat /> </Layout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserContextProvider>
        </GameProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
