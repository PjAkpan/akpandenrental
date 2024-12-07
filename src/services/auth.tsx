/* eslint-disable @typescript-eslint/no-unused-vars */
// services/auth.js
import { logger } from "netwrap";
import { costomencryDecryptInternalCRYPTOJS, createFetcher } from "../utils";
import { getAppUrls } from "../config";




// Define the backend keys and IV (for decryption)
const keyBase64 = getAppUrls().secret; 
const ivBase64 = getAppUrls().iv; 
const apiBseUrl = getAppUrls().url;   



export const loginUser = async (
  email: string,
  password: string,
  deviceId: string
) => {
  try {
const url =`${apiBseUrl}users/login`;
const queryPayload ={ email, password, deviceId };
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
      //  logger(response);


       
    // // Send login request to backend
    // const response = await fetch(`${apiBseUrl}users/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password, deviceId }),
    // });

    // Parse the response as JSON
    const data = await response.payload;

    // Check for non-200 response
    if (!response.status) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.payload?.encryptedString || !data.payload.verificationToken) {
      throw new Error("Invalid response payload from the server.");
    }
// logger(data.payload.encryptedString);
// console.log({ keyBase64, ivBase64 });
    // Decrypt the encryptedString
    const decryptedPayload = await costomencryDecryptInternalCRYPTOJS(
      "DE",
      data.payload.encryptedString,
      keyBase64,
      ivBase64
    );

    // console.log("Decrypted Payload:", decryptedPayload);

    // Return the decrypted payload along with the token
    return { ...decryptedPayload, token: data.payload.verificationToken,message:response.message };
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


// const { trigger: handleLogin, isLoading, data, error } = useFetcher({
//     queryFn: async () => {
//       try {
//         const response = await axios.post(
//           "http://127.0.0.1:5000/api/users/login",
//           {
//               email: username, 
//         password,
//         deviceId,
//           },
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );
//         return response.data; // Return the response data
//       } catch (err) {
//         const errorMessage =
//           (err as ErrorResponse).response?.data?.message || "Signup failed";
//         throw new Error(errorMessage);
//       }
//     },
//     onSuccess: () => {
//       console.log("SignupIn successful");
//     //  navigate("/dashboard", { });
//     },
//     onError: (err) => {
//       console.error("Error during signup:", (err as Error).message);
//     },
//   });


