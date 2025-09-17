export enum EnvVariables {
  USER_POOL_ID = "USER_POOL_ID",
  COGNITO_CLIENT_ID = "COGNITO_CLIENT_ID",
}

export const fetchEnvVariableOrThrow = (envVar: EnvVariables) => {
  const variable = process.env[envVar];

  if (!variable)
    throw new Error("Missing required environment variable: " + envVar);

  return variable;
};
