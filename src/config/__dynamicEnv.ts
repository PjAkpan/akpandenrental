type EnvironmentType = "production" | "staging";
const environment: EnvironmentType = process.env
  .REACT_APP_ENVIRONMENT as EnvironmentType;

// console.log("Environment:", process.env.REACT_APP_ENVIRONMENT);
// console.log("Secret Key:", process.env.REACT_APP_SECRET_KEY);
// Define a mapping object for base URLs
const baseApiUrls: Record<EnvironmentType, string> = {
  production: process.env.REACT_APP_PRODUCTION_BaseApi_URL || "",
  staging: process.env.REACT_APP_STAGING_BaseApi_URL || "",
};

// Define a mapping object for AES configurations
const AES: Record<EnvironmentType, { sec: string; iv: string }> = {
  production: {
    sec: process.env.REACT_APP_PRODUCTION_SECURITYKEY || "",
    iv: process.env.REACT_APP_PRODUCTION_INITVECTOR || "",
  },
  staging: {
    sec: process.env.REACT_APP_STAGING_SECURITYKEY || "",
    iv: process.env.REACT_APP_STAGING_INITVECTOR || "",
  },
};

// Export the environment configuration
export const env = {
  baseApiUrls,
  environment,
  AES,
};
