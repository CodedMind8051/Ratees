import {Routes,Route} from "react-router-dom"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import HomePage from "@/app/page"
import WatchlistPage from "@/pages/watchlist-page/page"
import PlaylistsPage from "@/pages/playlists-page/page"
import FriendsPage from "@/pages/friends-page/page"

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