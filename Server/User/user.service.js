const userController = require("./user.controller")
const bcrypt = require('bcryptjs');

async function addUser(newUser) {
  let newUserEmail = (newUser.email || '').toString().trim().toLowerCase();
  const filter = { email: newUserEmail };

  let userExists = await userController.readOne(filter);

  if (!userExists) {
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    newUser.email = newUserEmail;
    return await userController.create(newUser);
  } else {
    return { success: false, message: "User is already registered" };
  }
}

async function updateUser(email, updateData) {
  const filter = { email: (email || '').toString().trim().toLowerCase() };
  let userExists = await userController.readOne(filter);

  if (userExists) {
    return await userController.updateByEmail(filter, updateData);
  } else {
    return { success: false, message: "User not found" };
  }
}

// Gets the user by Email
async function getUserByEmail(email) {
  const filter = { email: (email || '').toString().trim().toLowerCase() }
  let user = await userController.readOne(filter)
  return user;
}

module.exports = { addUser, getUserByEmail, updateUser }
