import { join } from "node:path";

import { getEslintConfig } from "@haltcase/style/eslint";
import oxlint from "eslint-plugin-oxlint";

export default [
	{
		ignores: ["dist"]
	},

	...getEslintConfig({
		node: true,
		typescriptProject: join(import.meta.dirname, "tsconfig.json")
	}),

	...oxlint.configs["flat/recommended"]
];
