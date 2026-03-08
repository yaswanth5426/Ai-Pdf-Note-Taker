"use client"
import {Button} from "@/components/ui/button";
import {UserButton} from "@clerk/nextjs";
import Image from "next/image";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
export default function Home() {

  const {user} = useUser();
  const createUser = useMutation(api.user.createUser);
  
 useEffect(() => {
  user&& CheckUser();
 },[user])

  const CheckUser = async ()=>{
    const result = await createUser({
      email:user?.primaryEmailAddress?.emailAddress ,
     
      imageUrl : user?.imageUrl ,
       userName : user?.fullName 
    });
  }
  
  
  
  
  return (
    <div>
      <h2> Yaswanth</h2>
      <Button>Fuckoff</Button>
      <UserButton />
    </div>
  )
}