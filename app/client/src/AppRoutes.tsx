import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import HomePage from "@/pages/home-page/Homepage";
import WatchlistPage from "@/pages/watchlist-page/WatchlistPage";
import PlaylistsPage from "@/pages/playlists-page/PlaylistsPage";
import FriendsPage from "@/pages/friends-page/FriendsPage";
import ProfilePage from "@/pages/profile-page/ProfilePage";
import ProtectedRoute from "@/components/ui/common/ProtectedRoute";
import AuthRoute from "@/components/ui/common/AuthRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <WatchlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <PlaylistsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/profile/:userid" element={<ProfilePage />} />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
    </Routes>
  );
}
