// Web-safe SecureStore wrapper
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type User = {
  email: string;
  username: string;
};

// Fallback for Web
async function save(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function load(key: string) {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function remove(key: string) {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// REGISTER
export async function registerUser(
  email: string,
  password: string,
  username: string
) {
  const user = { email, username };

  await save("user", JSON.stringify(user));
  await save("token", "token-123");

  return user;
}

// LOGIN
export async function loginUser(email: string, password: string) {
  const userJson = await load("user");
  if (!userJson) throw new Error("User does not exist.");

  const user = JSON.parse(userJson);

  if (user.email !== email) throw new Error("Invalid email or password.");

  await save("token", "token-123");

  return user;
}

// LOGOUT
export async function logoutUser() {
  await remove("token");
}

// PROFILE UPDATE
export async function updateUserProfile(
  email: string,
  username: string,
  password?: string
) {
  const newUser = { email, username };
  await save("user", JSON.stringify(newUser));
  return newUser;
}

// LOAD USER
export async function getStoredUser(): Promise<User | null> {
  const userJson = await load("user");
  if (!userJson) return null;
  return JSON.parse(userJson);
}
