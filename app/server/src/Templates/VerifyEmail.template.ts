export const VERIFY_EMAIL_SUBJECT =
  "Verify your email • Ratees";

export const VerifyEmailTemplate = (url:string):string => {

return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<style>

body{
margin:0;
padding:0;
background:#09090b;
font-family:
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif;
}

.wrapper{
padding:60px 20px;
background:
radial-gradient(
circle at top,
rgba(220,38,38,.15),
transparent 30%
),
#09090b;
}

.container{

max-width:620px;
margin:auto;

background:
linear-gradient(
180deg,
#111111 0%,
#0d0d0d 100%
);

border:1px solid rgba(255,255,255,.06);

border-radius:32px;

overflow:hidden;

box-shadow:

0 0 50px
rgba(255,0,80,.06),

0 20px 80px
rgba(0,0,0,.65);

}

.hero{

padding:70px 45px;
text-align:center;
position:relative;

}

.hero:after{

content:"";

position:absolute;

width:260px;
height:260px;

background:

radial-gradient(
circle,
rgba(220,38,38,.35),
transparent
);

filter:blur(80px);

top:-120px;
left:50%;
transform:translateX(-50%);

}

.logo{

position:relative;
z-index:2;

width:70px;
height:70px;

margin:auto;

border-radius:22px;

background:

linear-gradient(
135deg,
#dc2626,
#7f1d1d
);

box-shadow:

0 10px 40px
rgba(220,38,38,.35);

}

.logo:before{

content:"▶";

font-size:24px;

color:white;

display:block;

line-height:70px;

padding-left:4px;

}

.brand{

margin-top:22px;

font-size:30px;

font-weight:700;

color:white;

letter-spacing:-1px;

}

.tag{

margin-top:10px;

font-size:14px;

color:#71717a;

letter-spacing:2px;

text-transform:uppercase;

}

.content{

padding:0 45px 50px;

}

.title{

font-size:36px;

font-weight:800;

line-height:1.1;

color:white;

margin-bottom:18px;

letter-spacing:-1.5px;

}

.desc{

font-size:16px;

line-height:1.9;

color:#a1a1aa;

margin-bottom:35px;

}

.cta{

text-align:center;

margin:45px 0;

}

.button{

display:inline-block;

padding:

18px 46px;

border-radius:18px;

text-decoration:none;

font-size:15px;

font-weight:700;

background:

linear-gradient(
135deg,
#dc2626,
#991b1b
);

color:white !important;

box-shadow:

0 10px 35px
rgba(220,38,38,.35);

}

.card{

background:

rgba(255,255,255,.03);

border:

1px solid
rgba(255,255,255,.05);

border-radius:20px;

padding:24px;

margin-top:40px;

}

.card-title{

color:white;

font-weight:700;

font-size:15px;

margin-bottom:10px;

}

.card-text{

font-size:14px;

line-height:1.8;

color:#a1a1aa;

}

.footer{

padding:35px;

border-top:

1px solid
rgba(255,255,255,.05);

text-align:center;

}

.footer p{

color:#71717a;

font-size:13px;

line-height:1.8;

}

.footer a{

color:white;
text-decoration:none;

}

@media(max-width:600px){

.hero{
padding:50px 25px;
}

.content{
padding:0 25px 40px;
}

.title{
font-size:30px;
}

}

</style>
</head>

<body>

<div class="wrapper">

<div class="container">

<div class="hero">

<div class="logo"></div>

<div class="brand">
Ratees
</div>

<div class="tag">
Movies • Community • Stories
</div>

</div>


<div class="content">

<div class="title">
Verify your email and enter Ratees
</div>

<div class="desc">

You're one click away from joining a space built for movie lovers, ratings, discussions and discovering stories that matter.

</div>


<div class="cta">

<a href="${url}" class="button">

Verify Email

</a>

</div>


<div class="card">

<div class="card-title">

Account Security

</div>

<div class="card-text">

This verification link expires in 24 hours and can only be used once. Never share it with anyone.

</div>

</div>

</div>

<div class="footer">

<p>

Need help?
<a href="https://yourdomain.com/support">

Contact support

</a>

</p>

<p>

© 2026 Ratees

</p>

</div>

</div>

</div>

</body>

</html>
`
}