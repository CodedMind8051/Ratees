import { authClient } from './lib/auth-client'
import './App.css'
// import { useNavigate } from "react-router-dom";

function App() {
 

  const signIn = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173",

    });
    console.log(data, error);
  };

  const handelSignup = async () => {
    const { data, error } = await authClient.signUp.email({
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
      email: "shahadean296@gmail.com", // Fixed .com.com typo
      password: "password123",        // Extended length to satisfy standard validators
      name: "Tesser",
      callbackURL: "http://localhost:5173",
    });

    console.log(data, error);
  };

  return (
    <>
      <button onClick={handelSignup}>Sign Up</button>
      <button onClick={signIn}>Sign In with Google</button>
    </>
  );
}

export default App;
