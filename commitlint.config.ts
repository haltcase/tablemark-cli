import type { UserConfig } from "@commitlint/types";

export default {
	extends: ["@commitlint/config-conventional"],
	// remove this if we can ever get dependabot to follow the rules
	// https://github.com/dependabot/dependabot-core/issues/2445
	ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")]
} satisfies UserConfig;
