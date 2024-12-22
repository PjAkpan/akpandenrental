/* eslint-disable @typescript-eslint/no-unused-vars */
// services/auth.js
import { logger } from "netwrap";
import { costomencryDecryptInternalCRYPTOJS, createFetcher } from "../utils";
import { getAppUrls } from "../config";
import { LoginResponse } from "../types";

// Define the backend keys and IV (for decryption)
const keyBase64 = getAppUrls().secret;
const ivBase64 = getAppUrls().iv;
const apiBseUrl = getAppUrls().url;

export const loginUser = async (
email: string, password: string, deviceId: string, paymentId: string | null) => {
  try {
    const url = `${apiBseUrl}users/login`;
    const queryPayload = { email, password, deviceId };

    const postCustomerUpdate = createFetcher({
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      url,
      // eslint-disable-next-line camelcase
      query: {},
      params: {},
      data: { ...queryPayload },
      timeout: 60 * 9 * 1000, // 9 minutes
    });

    const response = await postCustomerUpdate.trigger();

    // Parse the response as JSON
       const data: LoginResponse = response.payload;

    // Check for non-200 response
    if (!response.status || !data.status) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.payload?.encryptedString || !data.payload.verificationToken) {
      throw new Error("Invalid response payload from the server.");
    }
 
    const decryptedPayload = await costomencryDecryptInternalCRYPTOJS(
      "DE",
      data.payload.encryptedString,
      keyBase64,
      ivBase64
    );

    localStorage.setItem("authToken", data.payload.verificationToken);
    // localStorage.setItem("userId", decryptedPayload.userId);
    // Return the decrypted payload along with the token
    return {
      ...decryptedPayload,
      token: data.payload.verificationToken,
      message: response.message,
    };
  } catch (error) {
    // Handle known and unknown errors
    if (error instanceof Error) {
      console.error("Login Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error occurred during login:", error);
      throw new Error("An unknown error occurred during login.");
    }
  }
};


