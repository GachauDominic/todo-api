import jwt, { decode }  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

// middleware to check if a user is loggedin

// export const isAuthenticated = (req: Request, res: Response, next: NextFunction)=>{
//   const authHeader = req.headers.authorization

  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   res.status(401).json({message: "Unauthorized"});
  //   return;
  // }

//   const token = authHeader.split(" ")[1]

//   try {
//     const decode = jwt.verify(token, process.env.JWT_SECRET as string);
//     // attaching user info with request
//     (req as any).user = decode;
//     next();

//   } catch (error) {
//     res.status(401).json({ message: "Invalid Token" });
//     return;
//   }
// }

//export default isAuthenticated;


// check for the roles
export const checkRole = (requiredRole: "admin" | "user" | "both")=>{
  return (req: Request, res: Response, next: NextFunction):void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      (req as any).user = decoded

      //check for roles
      if (
        typeof decoded === "object" &&  //ensure decoded is an object
        decoded !== null && // ensure decoded is not null
        "role" in decoded //ensure the decoded token has a role property
      ) {
        // const role = (decoded as jwt.JwtPayload).role;
        if(requiredRole === "both"){
          // allowing any
          if(decoded.role === "admin" || decoded.role === "user"){
            next()
            return;
          }//if both then they can access 
        } else if (decoded.role === requiredRole){
          next();
           return;
          }
          res.status(401).json({message:"Unauthorized"})
          return;
      } else {
          res.status(401).json({message:"Invalid token payload"})
          return;
      }

      
    } catch (error) {
      res.status(500).json({message: "Invalid token"})
      return;
    }
  }
}

export const adminRoleAuth = checkRole("admin")
export const userRoleAuth = checkRole("user")
export const bothRoleAuth = checkRole("both")