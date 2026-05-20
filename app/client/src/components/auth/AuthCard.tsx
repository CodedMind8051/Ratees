import {Card} from "@/components/ui/card"

export default function AuthCard({
children
}:{
children:React.ReactNode
}){

return(

<Card

className="

w-[95%]
sm:w-[450px]

bg-zinc-900/70

backdrop-blur-xl

border-zinc-800

shadow-2xl

p-8

rounded-3xl

"

>

{children}

</Card>

)

}