import {Routes,Route} from "react-router-dom"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import HomePage from "@/pages/home-page/Homepage"
import WatchlistPage from "@/pages/watchlist-page/WatchlistPage"
import PlaylistsPage from "@/pages/playlists-page/PlaylistsPage"
import FriendsPage from "@/pages/friends-page/FriendsPage"

export default function AppRoutes(){

return(

<Routes>
<Route path="/" element={<HomePage/>}/>
<Route path="/watchlist" element={<WatchlistPage/>}/>
<Route path="/playlists" element={<PlaylistsPage/>}/>
<Route path="/friends" element={<FriendsPage/>}/>
<Route path="/signup" element={<Signup/>}/>
<Route path="/login" element={<Login/>}/>
</Routes>

)

}