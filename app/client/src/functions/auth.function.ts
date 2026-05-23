import { authClient } from '@/lib/auth-client'
import { toast } from "sonner"
import { CircleX } from "lucide-react"
import React from 'react'
import { FlowStep } from '@/pages/Signup'


type formSignUp = {
    username: string,
    email: string,
    password: string
}

type formSignIn = {
    email: string,
    password: string
}


const handelSignUpWithFiled = async (form: formSignUp, image: string, setCurrentStep: React.Dispatch<React.SetStateAction<FlowStep>>) => {

    const { data, error } = await authClient.signUp.email({
        image: image,
        email: form?.email,
        password: form?.password,
        name: form?.username,
        callbackURL: "http://localhost:5173",
    }, {
        onSuccess: async (context) => {
            window.location.href = "http://localhost:5173"
        },
        onError: async (error) => {
            toast.error(error.error.message, { icon: React.createElement(CircleX, { className: 'text-red-500' }), position: "top-center", duration: 10000 })
        },
    }

    );

}


const handelSignInWithFiled = async (form: formSignIn, setSuccess: React.Dispatch<React.SetStateAction<boolean>>) => {
    const { data, error } = await authClient.signIn.email({
        email: form?.email,
        password: form?.password,
        rememberMe: true,
        callbackURL: "http://localhost:5173",
    }, {
        onSuccess: async (context) => {
        },
        onError: async (error) => {
            toast.error(error.error.message, { icon: React.createElement(CircleX, { className: 'text-red-500' }), position: "top-center", duration: 10000 })
        },
    }

    );

}



const handelSignUpWithGoogle = async () => {
    console.log("Google Sign-In initiated");
    const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:5173"
    },
        {
            onError: async (error) => {
                toast.error(error.error.message, { icon: React.createElement(CircleX, { className: 'text-red-500' }), position: "top-center", duration: 10000 })
            }
        });


}


export { handelSignUpWithFiled, handelSignUpWithGoogle, handelSignInWithFiled }