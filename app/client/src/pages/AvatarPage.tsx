import AvatarPicker from "../components/auth/AvatarPicker"
import AuthCard from "../components/auth/AuthCard"

import {Button} from "@/components/ui/button"

import {useNavigate} from "react-router-dom"

export default function(){

const navigate=useNavigate()

return(

<div className="
min-h-screen
bg-black
flex
justify-center
items-center
">

<AuthCard>

<h2
className="
text-center
text-3xl
font-bold
mb-6
"
>

Choose Avatar

</h2>

<AvatarPicker/>

<Button
className="w-full mt-5"

onClick={()=>
navigate("/verify")
}
>

Continue

</Button>

</AuthCard>

</div>

)

}