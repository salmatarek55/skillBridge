import { users } from "../data/users";

// LOGIN
export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        reject({ message: "Invalid credentials" });
        return;
      }
       
         if (user.role === "provider" && !user.approved) {
        reject({ message: "Account pending admin approval" });
        return;
      }

      resolve({
        ...user,
        token: "fake-token-123"
      });
    }, 500);
  });
}


// REGISTER
export function registerUser(newUser) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = users.find((u) => u.email === newUser.email);

      if (exists) {
        reject({ message: "User already exists" });
        return;
      }


      const createdUser = {
        ...newUser,
        id: `u${users.length + 1}`,
        avatar: "https://i.pravatar.cc/150",
        approved: newUser.role === "provider" ? false : true
      };

      users.push(createdUser);

      resolve(createdUser);
    }, 500);
  });
}