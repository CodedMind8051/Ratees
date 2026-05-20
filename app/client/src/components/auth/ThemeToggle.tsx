import {Moon,Sun} from "lucide-react"
import {useTheme} from "next-themes"

export default function ThemeToggle(){

const {theme,setTheme}=useTheme()

return(

<button
onClick={()=>setTheme(
theme==="dark"
?
"light"
:
"dark"
)}

className="
absolute
top-6
right-6
bg-zinc-900
border
border-zinc-800
p-2
rounded-full
"
>

{
theme==="dark"
?

<Sun size={18}/>

:

<Moon size={18}/>

}

</button>

)

}