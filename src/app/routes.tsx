import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layouts/RootLayout";
import { AdminLayout } from "./components/layouts/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute"; 
import { ThemeProvider } from "./contexts/ThemeProvider"; // Standardized Provider

// Pages Imports
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { SelectionPage } from "./pages/SelectionPage";
import { PapersPage } from "./pages/PapersPage";
import { AnalysisDashboard } from "./pages/AnalysisDashboard";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFound } from "./pages/NotFound";

// Admin Pages Imports
import { AdminAuthPage } from "./pages/admin/AdminAuthPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUploadPage } from "./pages/admin/AdminUploadPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "auth", Component: AuthPage },
      { path: "how-it-works", Component: HowItWorksPage },
      { path: "selection", Component: SelectionPage },
      { path: "papers", Component: PapersPage },
      { path: "dashboard", Component: AnalysisDashboard },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
    ],
  },
  {
    path: "/admin",
    // Yaha se AdminLayout hata diya hai kyunki niche index (login) ke liye layout nahi chahiye hoga
    children: [
      { index: true, Component: AdminAuthPage }, // /admin par login page
      {
        // Ab ProtectedRoute ke andar Theme aur Layout dono ko wrap kiya hai
        element: (
          <ProtectedRoute>
            <ThemeProvider>
              <AdminLayout />
            </ThemeProvider>
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", Component: AdminDashboard },
          { path: "upload", Component: AdminUploadPage },
          { path: "reports", Component: AdminReportsPage },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);