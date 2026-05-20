export default function GlowBackground(){

return(

<div className="fixed inset-0 overflow-hidden">

<div
className="
absolute
bottom-0
left-0
w-[350px]
h-[350px]
bg-purple-700
blur-[130px]
opacity-50
rounded-full
"
/>

<div
className="
absolute
top-20
right-10
w-[300px]
h-[300px]
bg-pink-500
blur-[140px]
opacity-30
rounded-full
"
/>

</div>

)

}