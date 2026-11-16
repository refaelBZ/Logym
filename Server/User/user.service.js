const userController = require("./user.controller")
const bcrypt = require('bcryptjs');
const { pickAllowedFields } = require('./compliance');

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
    const safeData = pickAllowedFields(updateData);
    return await userController.updateByEmail(filter, safeData);
  } else {
    return { success: false, message: "User not found" };
  }
}

async function updateUserById(userId, updateData) {
  const userExists = await userController.readById(userId);
  if (!userExists) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  const safeData = pickAllowedFields(updateData);
  return await userController.updateById(userId, safeData);
}

async function getUserByEmail(email) {
  const filter = { email: (email || '').toString().trim().toLowerCase() }
  let user = await userController.readOne(filter)
  return user;
}

async function getUserById(userId) {
  return await userController.readById(userId);
}

async function deleteAccount(userId) {
  const user = await userController.readById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  await userController.deleteUserAndData(userId);
  return { message: 'Account and associated data deleted.' };
}

async function exportAccount(userId) {
  const data = await userController.exportUserData(userId);
  if (!data) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return data;
}

async function acceptHealthDisclaimer(userId) {
  const { LEGAL_DOC_VERSION } = require('./compliance');
  const updated = await userController.updateById(userId, {
    healthDisclaimerAcceptedAt: new Date(),
    legalDocVersion: LEGAL_DOC_VERSION,
  });
  if (!updated) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return updated;
}

module.exports = {
  addUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserById,
  deleteAccount,
  exportAccount,
  acceptHealthDisclaimer,
};
