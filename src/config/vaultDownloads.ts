/**
 * Remote configuration for the /vault protected page's two download
 * destinations. Read ONLY inside the createServerFn handler in
 * src/routes/vault.tsx via a dynamic import -- never imported by any
 * client component, so these URLs never ship in the client JS bundle.
 * Edit the two URLs below to change either destination; nothing else
 * needs to change.
 */
export const VAULT_DOWNLOADS = {
  download1: "https://2u.pw/58fPUL",
  download2: "https://2u.pw/cD1Vtc",
} as const;
