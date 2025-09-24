import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { execa, execaNode } from "execa";

export const testDirectory = dirname(fileURLToPath(import.meta.url));
export const cliPath = resolve(testDirectory, "../src/cli.ts");
export const snapshotDirectory = resolve(import.meta.dirname, "__snapshots__");
export const fixtureDirectory = resolve(import.meta.dirname, "fixtures");

export const resolveFixture = (fileName: string): string =>
	resolve(fixtureDirectory, fileName);

export interface ExecutionResult {
	success: boolean;
	stdout: string;
	stderr: string;
}

const isNativeTypescript =
	"typescript" in process.features &&
	(process.features.typescript === "strip" ||
		process.features.typescript === "transform");

type ExecaOptions = Parameters<typeof execa>[1];

export const execute = async (
	cliArguments: string | string[],
	stdin?: string,
	noReject = false
): Promise<ExecutionResult> => {
	const options = {
		encoding: "utf8",
		input: stdin,
		reject: !noReject
	} satisfies ExecaOptions;

	const argumentArray = Array.isArray(cliArguments)
		? cliArguments
		: cliArguments.trim().split(" ");

	// Remove this when all supported versions of Node support TypeScript natively
	if (!isNativeTypescript) {
		const { stdout, stderr, failed } = await execa(
			"tsx",
			[cliPath, ...argumentArray],
			options
		);

		return {
			success: !failed,
			stdout,
			stderr
		};
	}

	const { stdout, stderr, failed } = await execaNode(
		cliPath,
		argumentArray,
		options
	);

	return {
		success: !failed,
		stdout,
		stderr
	};
};

export const snapshotFile = (
	fileName: string,
	extension: `.${string}` = ".md"
): string => resolve(snapshotDirectory, `${fileName}${extension}`);
