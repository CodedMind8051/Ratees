import {Routes,Route} from "react-router-dom"
import Signup from "../pages/Signup"
import Login from "../pages/Login"
import Temp from "../pages/temp"


export default function AppRoutes(){

return(

<Routes>
<Route path="/" element={<Temp/>}/>
<Route path="/signup" element={<Signup/>}/>
<Route path="/login" element={<Login/>}/>


</Routes>

)

}