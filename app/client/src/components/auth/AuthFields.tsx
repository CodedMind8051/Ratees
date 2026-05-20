import {Input}
from "@/components/ui/input"

export default function AuthFields({
signup=false
}){

return(

<div className="space-y-4">

{signup && (

<Input
placeholder="Username"
/>

)}

<Input
placeholder={
signup
? "Email"
:"Username or Email"
}
/>

<Input
type="password"
placeholder="Password"
/>

</div>

)

}