import { readFileSync } from "node:fs";
import { styleText } from "node:util";

import {
	alignmentOptions,
	type ColumnDescriptor,
	headerCaseOptions,
	lineBreakStrategies,
	overflowStrategies,
	textHandlingStrategies,
	unknownKeyStrategies
} from "tablemark";
import { assert, expect, test } from "vitest";

import { execute, resolveFixture, snapshotFile } from "./helpers.ts";

const inputLongValue = JSON.stringify({
	"lots of ones": "1".repeat(50)
});

const inputThreeColumn = JSON.stringify({
	one: "one",
	two: "two",
	"three dog": "night"
});

const inputPath = resolveFixture("./input.json");
const ndjsonInputPath = resolveFixture("./input.ndjson");
const jsonContent = readFileSync(inputPath, "utf8");

test("renders JSON from file as a markdown table", async () => {
	const { success, stdout } = await execute(inputPath);
	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("from-file-json"));
});

test("renders NDJSON from file as a markdown table", async () => {
	const { success, stdout } = await execute(ndjsonInputPath);
	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("from-file-ndjson"));
});

test("renders JSON content from stdin as a markdown table", async () => {
	const { success, stdout } = await execute("-", jsonContent);
	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("from-file-stdin"));
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
	const { success, stdout } = await execute("-", inputLongValue);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(
		snapshotFile("long-values-not-wrapped")
	);
});

test("long values are wrapped if `--max-width` is supplied", async () => {
	const { success, stdout } = await execute("- --max-width 25", inputLongValue);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("long-values-wrapped"));
});

test("gutters are included on wrapped rows when `--wrap-with-gutters` is supplied", async () => {
	const { success, stdout } = await execute(
		"- --max-width 25 --wrap-with-gutters",
		inputLongValue
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(
		snapshotFile("long-values-wrapped-with-gutters")
	);
});

test("line ending can be customized using `--line-ending`", async () => {
	const lineEnding = "~@~";

	const { success, stdout } = await execute(
		`- --line-ending ${lineEnding}`,
		inputLongValue
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("custom-line-ending"));
});

for (const headerCase of Object.values(headerCaseOptions)) {
	test(`header case can be customized using --header-case ${headerCase}`, async () => {
		const data = JSON.stringify({
			"first name": "John",
			"last name": "Doe",
			"UPPER CASED": "value",
			"mixed CASED": "value",
			"sPonGe cAsEd": "value",
			camelCased: "value",
			PascalCased: "value",
			Pascal_Snake_Cased: "value",
			"Capital Cased": "value",
			CONSTANT_CASED: "value",
			"dot.cased": "value",
			"kebab-cased": "value",
			"path/cased": "value",
			"Sentence cased": "value",
			snake_cased: "value",
			"Train-Cased": "value"
		});

		const { success, stdout } = await execute(
			`- --header-case ${headerCase}`,
			data
		);

		assert(success);
		await expect(stdout).toMatchFileSnapshot(
			snapshotFile(`header-case-${headerCase}`)
		);
	});
}

for (const lineBreakStrategy of Object.values(lineBreakStrategies)) {
	test(`line break strategy can be customized using --line-break-strategy ${lineBreakStrategy}`, async () => {
		const data = JSON.stringify({
			one: "Line one\nLine two\nLine three",
			two: "Line one\r\nLine two\r\nLine three",
			three: "Line one\rLine two\rLine three"
		});

		const { success, stdout } = await execute(
			`- --line-break-strategy ${lineBreakStrategy} --max-width 20 --wrap-with-gutters`,
			data
		);

		assert(success);
		await expect(stdout).toMatchFileSnapshot(
			snapshotFile(`line-break-strategy-${lineBreakStrategy}`)
		);
	});
}

for (const overflowStrategy of Object.values(overflowStrategies)) {
	test(`overflow strategy can be customized using --overflow-strategy ${overflowStrategy}`, async () => {
		const { success, stdout } = await execute(
			`- --overflow-strategy ${overflowStrategy} --max-width 5`,
			JSON.stringify({
				one: "one two three four five six seven eight nine ten",
				two: "one two three four five six seven eight nine ten",
				three: "one two three four five six seven eight nine ten"
			})
		);

		assert(success);
		await expect(stdout).toMatchFileSnapshot(
			snapshotFile(`overflow-strategy-${overflowStrategy}`)
		);
	});

	test(`header overflow strategy can be customized using --overflow-header-strategy ${overflowStrategy}`, async () => {
		const { success, stdout } = await execute(
			`- --overflow-header-strategy ${overflowStrategy} --max-width 5`,
			inputThreeColumn
		);

		assert(success);
		await expect(stdout).toMatchFileSnapshot(
			snapshotFile(`overflow-header-strategy-${overflowStrategy}`)
		);
	});
}

for (const unknownKeyStrategy of Object.values(unknownKeyStrategies)) {
	test(`unknown key strategy can be customized using --unknown-key-strategy ${unknownKeyStrategy}`, async () => {
		const { success, stdout, stderr } = await execute(
			`- --unknown-key-strategy ${unknownKeyStrategy}`,
			JSON.stringify([
				{ one: "one", two: "two" },
				{ two: "two", three: "three" },
				{ three: "three", four: "four" }
			]),
			true
		);

		if (unknownKeyStrategy === unknownKeyStrategies.throw) {
			assert(!success);
			await expect(stderr).toMatchFileSnapshot(
				snapshotFile(`unknown-key-strategy-${unknownKeyStrategy}-stderr`)
			);
		} else {
			assert(success);
			await expect(stdout).toMatchFileSnapshot(
				snapshotFile(`unknown-key-strategy-${unknownKeyStrategy}`)
			);
		}
	});
}

for (const textHandlingStrategy of Object.values(textHandlingStrategies)) {
	test(`text handling strategy can be customized using --text-handling-strategy ${textHandlingStrategy}`, async () => {
		const { success, stdout } = await execute(
			`- --text-handling-strategy ${textHandlingStrategy} --max-width 10 --wrap-with-gutters`,
			JSON.stringify({
				ansi: `this text has ${styleText("underline", "ANSI")} styles`,
				fullwidth: "this text has fullwidth characters 你好",
				emojis: "This text has a few emojis 🤠🤡👻",
				mixed:
					"\u001B[4mThis text, containing emoji 👨‍👩‍👧‍👦, ANSI styles and CJK 古, will wrap and style properly\u001B[0m"
			})
		);

		assert(success);
		await expect(stdout).toMatchFileSnapshot(
			snapshotFile(`text-handling-strategy-${textHandlingStrategy}`)
		);
	});
}

test("all columns are aligned using `--align-all`", async () => {
	const { success, stdout } = await execute(
		"- --align-all center",
		inputThreeColumn
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("all-center"));

	const { success: isAliasSuccess, stdout: stdoutAlias } = await execute(
		"- -A center",
		inputThreeColumn
	);

	assert(isAliasSuccess);
	expect(stdoutAlias).toBe(stdout);
});

test("individual column alignment can be customized using `--align`", async () => {
	const { success, stdout } = await execute(
		"- --align left --align center --align right",
		inputThreeColumn
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("custom-alignments"));
});

test("column names can be customized using `--column`", async () => {
	const { success, stdout } = await execute(
		"- --column AAA --column BBB --column CCCCC",
		inputThreeColumn
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("custom-column-names"));
});

test("treats ANSI escape codes as non-zero width using `--count-ansi`", async () => {
	const { success, stdout } = await execute(
		"- --count-ansi",
		JSON.stringify({
			one: styleText(["bold", "red", "underline"], "value")
		})
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("count-ansi"));
});

test("complex option combination works as expected", async () => {
	const lineEnding = "~@~";

	const columns = ["AAA", "BBB"].map((name) => `-c ${name}`).join(" ");

	const alignments = Object.values(alignmentOptions)
		.map((align) => `-a ${align}`)
		.join(" ");

	const data = JSON.stringify([
		{ AAA: "one", BBB: "two", "three dog": styleText("underline", "night") },
		{
			AAA: "one",
			BBB: "two\n\nagain",
			"three dog": styleText("underline", "night but it's really long")
		},
		{ AAA: "one", BBB: "two", "three dog": styleText("underline", "night") }
	]);

	const { success, stdout } = await execute(
		[
			`- --align-all right ${columns} ${alignments}`,
			`--max-width 12 --wrap-with-gutters --line-ending ${lineEnding}`,
			`--overflow-strategy truncateStart --overflow-header-strategy truncateEnd`,
			`--text-handling-strategy basic --count-ansi --no-pad-header-separator`,
			`--line-break-strategy strip`,
			`--header-case pathCase`
		].join(" "),
		data
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("all-options"));
});

test("accepts column descriptors as JSON", async () => {
	const data = JSON.stringify([
		{ id: "AAA", title: "Column A" },
		{ id: "BBB", title: "Column B" },
		{ id: "CCC", title: "Column C" }
	]);

	const descriptors = JSON.stringify([
		{
			name: "Triple A",
			align: "right",
			maxWidth: 5,
			overflowHeaderStrategy: "truncateStart"
		},
		{ name: "Triple B", align: "center", width: 10, maxWidth: 3 }
	] satisfies ColumnDescriptor[]);

	const { success, stdout } = await execute(
		["-", "--max-width", "50", "--descriptors", descriptors],
		data
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(snapshotFile("column-descriptors"));
});
