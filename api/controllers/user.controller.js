import prisma from "../lib/prisma.js"
import brcypt from "bcrypt"

export const getUsers = async (req,res) =>{
    console.log("it works all users data")
    try{
        //fetch data from database  with prisma

        const users = await prisma.user.findMany()
        res.status(200).json(users)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get Users"})
    }
}


export const getUser = async (req,res) =>{
    const id = req.params.id.trim();
    try{
        //fetch data from database  with prisma

        const oneUser = await prisma.user.findUnique({
            where: {id}
          })
        res.status(200).json(oneUser)

    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get Users"})
    }
}


export const updateUser = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const {password,avatar, ...inputs} = req.body;
     const body = req.body
  
    // console.log("Request ID:", id);
    // console.log("Token User ID:", tokenUserId);
    
    
    if (id !== tokenUserId) { 
      return res.status(403).json({ message: "Not authorized" });
    }
    
    //change password in hased form
     let updatedPassword = null

    try {

      if (password) {
         updatedPassword = await brcypt.hash(password,10)
       }

      

      const updatedUser = await prisma.user.update({
        where: { id },
         data: {...inputs, 
          ...(updatedPassword && {password:updatedPassword}),
           ...(avatar && {avatar})} // it means during updation , user can submit their password and avator without changing it
        
      });
      // console.log(updatedUser)
       res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to update user" });
    }
  };
  



export const deleteUser = async (req,res) =>{
  const id  = req.params.id
  const tokenUserId = req.userId

  if (id !== tokenUserId){
    return res.status(403).json({message:"Not Authorized"})
  }

    try{
      await prisma.user.delete({
        where: {id}
      })
      res.status(200).json({message:"User deleted"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get Users"})
    }
}