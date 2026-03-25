import bcrypt from "bcrypt";
import userService from "../services/user.service.js";
const {retrieveUser,createUser}=userService

const seedSuperAdmin = async () => {
  try {
    const existing = await retrieveUser({ role: "SUPERADMIN" });

    if (!existing) {
      const userObj = {
        name: "Super Admin",
        email: "admin@system.com",
        phoneNo: "9999999999",
        password: await bcrypt.hash("Admin@123", 10),
        role: "SUPERADMIN",
        isProfileComplete: true,
      }
    const created = await createUser(userObj);

      console.log("✅ Superadmin created");
    } else { 
      console.log("Superadmin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding superadmin:", error);
  }
};

export default seedSuperAdmin;