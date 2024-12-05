// import { createHttpError } from "./createHttpError";

import CryptoJS from "crypto-js";



const encrypt = (data: string, keyBase64: string, ivBase64: string): string => {
  const key = CryptoJS.enc.Base64.parse(keyBase64);
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  const cipherText = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return cipherText.toString();
};

const decrypt = (
  encryptedData: string,
  keyBase64: string,
  ivBase64: string,
): string => {
  const key = CryptoJS.enc.Base64.parse(keyBase64);
  const iv = CryptoJS.enc.Base64.parse(ivBase64);

  console.log(key, "key");
  console.log(iv, "iv");
  console.log(encryptedData, "encryptedData");

  // Decrypt the data
  const decryptedText = CryptoJS.AES.decrypt(encryptedData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  console.log("Decrypted WordArray:", decryptedText);

  // Convert WordArray to UTF-8 string
  const decryptedString = decryptedText.toString(CryptoJS.enc.Utf8);

  console.log("Decrypted String:", decryptedString);

  // Ensure the decrypted string is not empty
  if (!decryptedString || decryptedString.trim() === "") {
    throw new Error("Decryption failed: Output is empty or invalid");
  }

  return decryptedString;
};

export const costomencryDecryptInternalCRYPTOJS = async (
  requestType: string,
  data: string,
  keyBase64: string,
  ivBase64: string,
) => {
  let cypherData = "";
  try {
    await Promise.resolve();
    if (requestType === "EN") {
      const encryptedData = encrypt(data, keyBase64, ivBase64);
      // logToConsole({ "Encryption data:": encryptedData });
      cypherData = encryptedData;
      return {
        status: cypherData.length > 0 ? true : false,
        payload: cypherData,
      };
    } else {
      const decryptedData = decrypt(data, keyBase64, ivBase64);
      // logToConsole({ "Decrypted data:": decryptedData });
      cypherData = decryptedData;
      return {
        status: cypherData.length > 0 ? true : false,
        payload: JSON.parse(cypherData),
      };
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payload: "Error: " + (error as any).message,
    };
  }
};















