
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TaskCreatePage from "./pages/TaskCreate";
import TaskBrowserPage from "./pages/TaskBrowser";
import TaskCompletionPage from "./pages/TaskCompletion";
import AdminTaskQueuePage from "./pages/AdminTaskQueue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse-tasks" element={<TaskBrowserPage />} />
          <Route path="/create-task" element={<TaskCreatePage />} />
          <Route path="/complete-tasks" element={<TaskCompletionPage />} />
          <Route path="/admin/tasks" element={<AdminTaskQueuePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
