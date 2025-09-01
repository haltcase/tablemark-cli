#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Type } from "cmd-ts";
import {
	array,
	binary,
	command,
	flag,
	multioption,
	number,
	option,
	positional,
	run,
	string
} from "cmd-ts";
import type { Alignment, InputData, TablemarkOptions } from "tablemark";
import { alignmentOptions } from "tablemark";

import { convert, getStdin, parse, read, zip } from "./util.ts";

interface PackageInfo {
	description: string;
	version: string;
}

const getPackageInfo = (): PackageInfo => {
	const pkgPath = dirname(fileURLToPath(import.meta.url));

	try {
		const pkg = readFileSync(resolve(pkgPath, "../package.json"), "utf8");
		const { description, version } = JSON.parse(pkg) as {
			description: string;
			version: string;
		};

		return { description, version };
	} catch {
		return { description: "", version: "" };
	}
};

const alignmentList: Type<string[], Alignment[]> = {
	// eslint-disable-next-line @typescript-eslint/require-await
	async from(input) {
		return input.map((part) => {
			if (part === "") {
				return "left";
			}

			if (!Object.keys(alignmentOptions).includes(part.toLowerCase())) {
				throw new Error(`Expected an Alignment, got "${part}"`);
			}

			return part as Alignment;
		});
	}
};

export const inputContent: Type<string, InputData> = {
	async from(input) {
		const content = input === "-" ? await getStdin() : read(input);

		if (content === "" && process.stdin.isTTY) {
			return [];
		}

		return parse(content);
	}
};

const { description, version } = getPackageInfo();

const cmd = command({
	name: "tablemark",
	description,
	version,
	args: {
		inputFile: positional({
			displayName: "input-file",
			description: "Path to input file containing JSON data (use - for stdin)",
			type: inputContent
		}),
		column: multioption({
			long: "column",
			short: "c",
			description:
				"Custom column name, can be used multiple times (default: infer from object keys)",
			type: array(string)
		}),
		align: multioption({
			long: "align",
			short: "a",
			description:
				"Custom alignments, can be used multiple times, applied in order to columns (default: left)",
			type: alignmentList
		}),
		noCaseHeaders: flag({
			long: "no-case-headers",
			short: "N",
			description: "Disable automatic sentence casing of inferred column names",
			defaultValue: () => false,
			defaultValueIsSerializable: true
		}),
		lineEnding: option({
			long: "line-ending",
			short: "e",
			description: "End-of-line string (default: \\n)",
			type: string,
			defaultValue: () => "\n"
		}),
		wrapWidth: option({
			long: "wrap-width",
			short: "w",
			description: "Width at which to hard wrap cell content",
			type: number,
			defaultValue: () => Infinity,
			defaultValueIsSerializable: true
		}),
		wrapWithGutters: flag({
			long: "wrap-with-gutters",
			short: "G",
			description: "Add '|' characters to wrapped rows",
			defaultValue: () => false,
			defaultValueIsSerializable: true
		})
	},
	handler: (args) => {
		const options = {
			...args,
			caseHeaders: !args.noCaseHeaders,
			columns: [] as NonNullable<TablemarkOptions["columns"]>
		} satisfies TablemarkOptions;

		for (const [name, align] of zip(args.column, args.align)) {
			options.columns.push({ name, align });
		}

		// write results to stdout
		process.stdout.write(`${convert(args.inputFile, options)}\n`);
	}
});

await run(binary(cmd), process.argv);
