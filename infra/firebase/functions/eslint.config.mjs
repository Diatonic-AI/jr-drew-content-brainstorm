import { createConfig } from '../../../eslint.warn.config.mjs';

// Use repo-wide flat config for Functions package
// Switch to `true` to enforce strict rules locally
export default createConfig(false);
