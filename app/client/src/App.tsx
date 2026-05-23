import { authClient } from './lib/auth-client'
import './App.css'
import AppRoutes from "./routes/AppRoutes"


function App() {

  const signInEmail = async () => {
    const { data, error } = await authClient.signIn.email({
      email: "shahzadekhan296@gmail.com",
      password: "password1234",
      rememberMe: true,
      callbackURL: "http://localhost:5173",
    });

    console.log(data, error);
  }


  const signInSocial = async () => {
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173",

    });
    console.log(data, error);
  };

  const handelSignup = async () => {
    const { data, error } = await authClient.signUp.email({
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
      email: "shahzadekhan296@gmail.com",
      password: "passrd123",
      name: "king",
      callbackURL: "http://localhost:5173",
    }, {
      onSuccess: async (context) => {
        await authClient.sendVerificationEmail({
          email: context.data.user.email,
          callbackURL: "http://localhost:5173"
        },

        )
      },
    }
    );
    console.log(data, error);
  };

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
