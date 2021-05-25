import { userInfo } from "os"
import { Contractor } from "../models/contractor"


test("Devia funcionar", () => {
    const contractor = new Contractor()

    contractor.email = "Teste@gmail.com"

    expect(contractor.email).toEqual("Teste@gmail.com")
})