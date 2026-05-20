const avatars=[

"https://api.dicebear.com/7.x/adventurer/svg?seed=1",

"https://api.dicebear.com/7.x/adventurer/svg?seed=2",

"https://api.dicebear.com/7.x/adventurer/svg?seed=3",

"https://api.dicebear.com/7.x/adventurer/svg?seed=4"

]

export default function AvatarPicker(){

return(

<div className="grid grid-cols-2 gap-5">

{

avatars.map((avatar)=>(

<img
key={avatar}
src={avatar}

className="
bg-zinc-900
rounded-full
cursor-pointer
hover:scale-110
duration-300
"
/>

))

}

</div>

)

}