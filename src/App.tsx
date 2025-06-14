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
import MapViewPage from "./pages/MapView";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/Auth";
import RoleSelectionPage from "./pages/RoleSelection";
import ProfilePage from "./pages/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/role-selection" element={
              <ProtectedRoute>
                <RoleSelectionPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/browse-tasks" element={
              <ProtectedRoute requiredPermission="canViewTasks">
                <TaskBrowserPage />
              </ProtectedRoute>
            } />
            <Route path="/create-task" element={
              <ProtectedRoute requiredPermission="canCreateTasks">
                <TaskCreatePage />
              </ProtectedRoute>
            } />
            <Route path="/complete-tasks" element={
              <ProtectedRoute requiredPermission="canViewTasks">
                <TaskCompletionPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/tasks" element={
              <ProtectedRoute requiredPermission="canAccessAdmin">
                <AdminTaskQueuePage />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute requiredPermission="canViewTasks">
                <MapViewPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
