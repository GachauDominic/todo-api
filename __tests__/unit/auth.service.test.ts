import {CreateUserService, userLoginService} from "../../src/auth/auth.service"
import db from "../../src/Drizzle/db"
import { TIUser } from "../../src/Drizzle/schema"


//mocking
jest.mock("../../src/Drizzle/db", () => ({
	insert: jest.fn(()=>({ //mocking the insert mehod from/with db
		values: jest.fn().mockReturnThis()
		
	})),

	query: { //mocking the query metshod from/with db
		UsersTable: {
			findFirst: jest.fn()
		},
	}
}))

describe ("Auth service", ()=>{
	afterEach( ()=>{
		jest.clearAllMocks()
	})

	// testing the creation of a user
	describe("CreateUserService", ()=>{
		it("should insert a user and return a success message", async()=>{
			const user = {
				firstName : "Test",
				lastName : "User",
				email : "test@gmail.com",
				password : "hashedpass"
			};
			
			const result = await CreateUserService(user)

			expect(db.insert).toHaveBeenCalled()
			expect(result).toBe("User created successfully !")
		})
	})


	// testing the login of a user
	describe("userLoginService", ()=>{
		it("login a user and retun the user's data", async ()=>{
			const mockuser = {
				id: 1,
				firstName: "Test",
				lastName: "User",
				email: "test@gmail.com",
				password: "hashedpass"
			};
			(db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(mockuser)

			const result = await userLoginService(mockuser.email as any)
			// const result = await userLoginService({email:"test@gmail.com" } as TIUser)

			expect(db.query.UsersTable.findFirst).toHaveBeenCalled()
			expect(result).toEqual(mockuser)
		})

		it("should return NULL if user is not found in the DB", async ()=>{
			(db.query.UsersTable.findFirst as jest.Mock).mockResolvedValueOnce(null)


			const result = await userLoginService({email: "fake-email.gmial.com"} as TIUser)
			expect(db.query.UsersTable.findFirst).toHaveBeenCalled()
			expect(result).toBeNull()
		})
	})
})

