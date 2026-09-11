/**
 * Remote configuration for the /vault protected page's single download
 * destination. Read ONLY inside the createServerFn handler in
 * src/routes/vault.tsx via a dynamic import -- never imported by any
 * client component, so this URL never ships in the client JS bundle.
 * Edit the URL below to change the destination; nothing else needs to
 * change.
 */
export const VAULT_DOWNLOADS = {
  // Placeholder -- no real destination set yet.
  download: "https://archive.org/download/Driver2-LivBs/PSX/Driver%202%20-%20The%20Wheelman%20Is%20Back%20%28USA%29.zip",
} as const;
