import AuthCard from "../components/auth/AuthCard"

import {Mail} from "lucide-react"

export default function(){

return(

<div
className="
bg-black
min-h-screen
flex
justify-center
items-center
"
>

<AuthCard>

<div className="text-center">

<Mail
size={50}
className="
mx-auto
mb-4
"
/>

<h1
className="
text-3xl
font-bold
"
>

Verify Email

</h1>

<p
className="
text-zinc-400
mt-3
"
>

We sent a verification link to your email.

Please verify to continue.

</p>

</div>

</AuthCard>

</div>

)

}