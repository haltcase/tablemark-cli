import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { execa, execaNode } from "execa";
import { assert, expect, test } from "vitest";

interface ExecutionResult {
	success: boolean;
	stdout: string;
	stderr: string;
}

const joinLines = (lines: string[], lineEnding = "\n"): string =>
	lines.join(lineEnding) + lineEnding;

const commonExpected = joinLines([
	"| Name          | Repo                                                                | Desc                                                                                        |",
	"| :------------ | :------------------------------------------------------------------ | :------------------------------------------------------------------------------------------ |",
	"| trilogy       | [haltcase/trilogy](https://github.com/haltcase/trilogy)             | No-hassle SQLite with type-casting schema models and support for native & pure JS backends. |",
	"| strat         | [haltcase/strat](https://github.com/haltcase/strat)                 | Functional-ish JavaScript string formatting, with inspirations from Python.                 |",
	"| tablemark-cli | [haltcase/tablemark-cli](https://github.com/haltcase/tablemark-cli) | Generate markdown tables from JSON data at the command line.                                |"
]);

const inputLongValue = JSON.stringify({
	"lots of ones": "1".repeat(50)
});

const inputThreeColumn = JSON.stringify({
	one: "one",
	two: "two",
	"three dog": "night"
});

const testDirectory = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(testDirectory, "../src/cli.ts");
const inputPath = resolve(testDirectory, "./fixtures/input.json");
const ndjsonInputPath = resolve(testDirectory, "./fixtures/input.ndjson");

const jsonContent = readFileSync(inputPath, "utf8");

const isNativeTypescript =
	"typescript" in process.features &&
	(process.features.typescript === "strip" ||
		process.features.typescript === "transform");

const execute = async (
	argumentString: string,
	stdin?: string
): Promise<ExecutionResult> => {
	const options = {
		encoding: "utf8",
		input: stdin
	} satisfies Parameters<typeof execa>[1];

	// Remove this when all supported versions of Node support TypeScript natively
	if (!isNativeTypescript) {
		const { stdout, stderr, failed } = await execa(
			"tsx",
			[cliPath, ...argumentString.trim().split(" ")],
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
		argumentString.trim().split(" "),
		options
	);

	return {
		success: !failed,
		stdout,
		stderr
	};
};

test("renders JSON from file as a markdown table", async () => {
	const { success, stdout } = await execute(inputPath);
	assert(success);
	assert.strictEqual(stdout, commonExpected);
});

test("renders NDJSON from file as a markdown table", async () => {
	const { success, stdout } = await execute(ndjsonInputPath);
	assert(success);
	assert.strictEqual(stdout, commonExpected);
});

test("renders JSON content from stdin as a markdown table", async () => {
	const { success, stdout } = await execute("-", jsonContent);
	assert(success);
	assert.strictEqual(stdout, commonExpected);
});

test("fails when input file path does not exist", async () => {
	await expect(() => execute("not-a-file.js")).rejects.toThrow(
		/no such file or directory/
	);
});

test("fails when input content is invalid", async () => {
	await expect(() => execute("-", "not json")).rejects.toThrow(
		/Could not parse input as JSON/
	);
});

test("long values are not wrapped by default", async () => {
	const expected = joinLines([
		"| Lots of ones                                       |",
		"| :------------------------------------------------- |",
		"| 11111111111111111111111111111111111111111111111111 |"
	]);

	const { success, stdout } = await execute("-", inputLongValue);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("long values are wrapped if `--wrap-width` is supplied", async () => {
	const expected = joinLines([
		"| Lots of ones              |",
		"| :------------------------ |",
		"| 1111111111111111111111111 |",
		"  1111111111111111111111111  "
	]);

	const { success, stdout } = await execute(
		"- --wrap-width 25",
		inputLongValue
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("gutters are included on wrapped rows when `--wrap-with-gutters` is supplied", async () => {
	const expected = joinLines([
		"| Lots of ones              |",
		"| :------------------------ |",
		"| 1111111111111111111111111 |",
		"| 1111111111111111111111111 |"
	]);

	const { success, stdout } = await execute(
		"- --wrap-width 25 --wrap-with-gutters",
		inputLongValue
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("line ending can be customized using `--line-ending`", async () => {
	const lineEnding = "~@~";

	const expected = joinLines(
		[
			"| Lots of ones                                       |",
			"| :------------------------------------------------- |",
			"| 11111111111111111111111111111111111111111111111111 |"
		],
		lineEnding
	);

	const { success, stdout } = await execute(
		`- --line-ending ${lineEnding}`,
		inputLongValue
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("sentence casing can be disabled with `--no-case-headers`", async () => {
	const expected = joinLines([
		"| one   | two   | three dog |",
		"| :---- | :---- | :-------- |",
		"| one   | two   | night     |"
	]);

	const { success, stdout } = await execute(
		"- --no-case-headers",
		inputThreeColumn
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("column alignment can be customized using `--align`", async () => {
	const expected = joinLines([
		"| One   |  Two  | Three dog |",
		"| :---- | :---: | --------: |",
		"| one   |  two  |     night |"
	]);

	const { success, stdout } = await execute(
		"- --align left --align center --align right",
		inputThreeColumn
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("column names can be customized using `--column`", async () => {
	const expected = joinLines([
		"| AAA   | BBB   | CCCCC |",
		"| :---- | :---- | :---- |",
		"| one   | two   | night |"
	]);

	const { success, stdout } = await execute(
		"- --column AAA --column BBB --column CCCCC",
		inputThreeColumn
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});

test("all options work together as expected", async () => {
	const lineEnding = "~@~";

	const expected = joinLines(
		[
			"| AAA   |  BBB  | three |",
			"|       |       |   dog |",
			"| :---- | :---: | ----: |",
			"| one   |  two  | night |"
		],
		lineEnding
	);

	const columns = ["AAA", "BBB"].map((name) => `-c ${name}`).join(" ");

	const alignments = ["left", "center", "right"]
		.map((align) => `-a ${align}`)
		.join(" ");

	const { success, stdout } = await execute(
		`- ${columns} ${alignments} --wrap-width 3 --wrap-with-gutters --line-ending ${lineEnding} --no-case-headers`,
		inputThreeColumn
	);

	assert(success);
	assert.strictEqual(stdout, expected);
});
