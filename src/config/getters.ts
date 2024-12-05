import { env } from "./__dynamicEnv";

export const getAppUrls = () => {
  console.log("Environment Configurations:", env); // Debug information

  const { environment, baseApiUrls, AES } = env;

  // Validate the `environment`
  if (!environment) {
    throw new Error("Environment is not defined. Check your REACT_APP_ENVIRONMENT variable.");
  }

  // Retrieve configurations based on the current environment
  const baseUrl = baseApiUrls[environment];
  const aesConfig = AES[environment];

  // Validate the presence of `baseUrl` and `AES` configurations
  if (!baseUrl) {
    throw new Error(`Base URL is not defined for environment '${environment}'.`);
  }
  if (!aesConfig || !aesConfig.sec || !aesConfig.iv) {
    throw new Error(`AES configuration is incomplete for environment '${environment}'.`);
  }

  // Return the finalized app URLs and secrets
  return {
    url: baseUrl,
    secret: aesConfig.sec,
    iv: aesConfig.iv,
  };
};
