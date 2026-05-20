import {Routes,Route} from "react-router-dom"

import Login from "../pages/Login"
import Signup from "../pages/Signup"
import AvatarPage from "../pages/AvatarPage"
import VerifyEmail from "../pages/VerifyEmail"

export default function AppRoutes(){

return(

<Routes>

<Route path="/" element={<Login/>}/>

<Route path="/signup" element={<Signup/>}/>

<Route path="/avatar" element={<AvatarPage/>}/>

<Route path="/verify" element={<VerifyEmail/>}/>

</Routes>

)

}