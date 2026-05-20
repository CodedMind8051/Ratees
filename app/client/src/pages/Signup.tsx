import AuthCard from "../components/auth/AuthCard"
import GlowBackground from "../components/auth/GlowBackground"
import ThemeToggle from "../components/auth/ThemeToggle"
import GoogleButton from "../components/auth/GoogleButton"

import {Input} from "@/components/ui/input"

import {Button} from "@/components/ui/button"

import {useNavigate} from "react-router-dom"

export default function Signup(){

const navigate=useNavigate()

return(

<div
className="
min-h-screen
flex
items-center
justify-center
relative
bg-black
px-5
"
>

<GlowBackground/>

<ThemeToggle/>

<AuthCard>

<h1 className="text-4xl font-bold text-center">

Ratees

</h1>

<p className="text-zinc-400 text-center mb-7">

Create account

</p>


<GoogleButton/>


<div className="my-5 text-center text-zinc-500">

OR

</div>

<div className="space-y-4">

<Input
placeholder="Username"
/>

<Input
placeholder="Email"
/>

<Input
type="password"
placeholder="Password"
/>

<Button
onClick={()=>navigate("/avatar")}
className="
w-full
bg-white
text-black
hover:bg-zinc-300
"
>

Sign Up

</Button>

</div>

</AuthCard>

</div>

)

}