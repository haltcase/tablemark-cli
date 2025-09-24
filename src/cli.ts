#!/usr/bin/env node

import { styleText } from "node:util";

import {
	array,
	binary,
	command,
	flag,
	multioption,
	number,
	option,
	optional,
	positional,
	run,
	string
} from "cmd-ts";
import type { TablemarkOptions } from "tablemark";
import {
	alignmentOptions,
	headerCaseOptions,
	lineBreakStrategies,
	overflowStrategies,
	tablemark,
	textHandlingStrategies,
	unknownKeyStrategies
} from "tablemark";

import {
	alignmentType,
	descriptorsType,
	filePathOrStdinType,
	headerCaseType,
	lineBreakStrategyType,
	overflowStrategyType,
	textHandlingStrategyType,
	unknownKeyStrategyType
} from "./cli-types.ts";
import { fail, getPackageInfo, print, warn, zip } from "./util.ts";

const { description, version } = getPackageInfo();

const labelDefault = (text: string): string =>
	styleText("gray", `[default: ${styleText("italic", text)}]`);

const cmd = command({
	name: "tablemark",
	description,
	version,
	args: {
		inputFile: positional({
			displayName: "input-file",
			description: "Path to input file containing JSON data (use - for stdin)",
			type: filePathOrStdinType
		}),
		align: multioption({
			long: "align",
			short: "a",
			description: `Alignment, can be used multiple times ${labelDefault("left")}`,
			type: array(alignmentType)
		}),
		alignAll: option({
			long: "align-all",
			short: "A",
			description: `Default alignment for all columns`,
			type: alignmentType,
			defaultValue: () => alignmentOptions.left,
			defaultValueIsSerializable: true
		}),
		column: multioption({
			long: "column",
			short: "c",
			description: `Column name, can be used multiple times ${labelDefault("infer from object key")}`,
			type: array(string)
		}),
		countAnsi: flag({
			long: "count-ansi",
			description: "Count ANSI escape codes towards content width"
		}),
		descriptors: option({
			long: "descriptors",
			short: "D",
			description: `Column descriptors as a JSON array, overrides --align/--column ${labelDefault("none")}`,
			type: optional(descriptorsType)
		}),
		headerCase: option({
			long: "header-case",
			short: "H",
			description: "Control the casing of column names",
			type: headerCaseType,
			defaultValue: () => headerCaseOptions.sentenceCase,
			defaultValueIsSerializable: true
		}),
		lineBreakStrategy: option({
			long: "line-break-strategy",
			short: "l",
			description: "How to handle line breaks in cell content",
			type: lineBreakStrategyType,
			defaultValue: () => lineBreakStrategies.preserve,
			defaultValueIsSerializable: true
		}),
		lineEnding: option({
			long: "line-ending",
			short: "e",
			description: `End-of-line string ${labelDefault("\\n")}`,
			type: string,
			defaultValue: () => "\n"
		}),
		maxWidth: option({
			long: "max-width",
			short: "w",
			description: "Maximum content width of each column",
			type: number,
			defaultValue: () => Number.POSITIVE_INFINITY,
			defaultValueIsSerializable: true
		}),
		noCaseHeaders: flag({
			long: "no-case-headers",
			short: "N",
			description:
				"(Deprecated) Disable automatic sentence casing of inferred column names",
			defaultValue: () => false
		}),
		overflowStrategy: option({
			long: "overflow-strategy",
			short: "o",
			description: "What to do when cell content exceeds max width",
			type: overflowStrategyType,
			defaultValue: () => overflowStrategies.wrap,
			defaultValueIsSerializable: true
		}),
		overflowHeaderStrategy: option({
			long: "overflow-header-strategy",
			short: "O",
			description: "What to do when header cell content exceeds max width",
			type: overflowStrategyType,
			defaultValue: () => overflowStrategies.wrap,
			defaultValueIsSerializable: true
		}),
		noPadHeaderSeparator: flag({
			long: "no-pad-header-separator",
			short: "P",
			description: "Omit padding on the header separator row",
			defaultValue: () => false
		}),
		unknownKeyStrategy: option({
			long: "unknown-key-strategy",
			short: "u",
			description: "What to do when an unknown key is encountered",
			type: unknownKeyStrategyType,
			defaultValue: () => unknownKeyStrategies.ignore,
			defaultValueIsSerializable: true
		}),
		textHandlingStrategy: option({
			long: "text-handling-strategy",
			short: "t",
			description: "Which text processing method to use",
			type: textHandlingStrategyType,
			defaultValue: () => textHandlingStrategies.auto,
			defaultValueIsSerializable: true
		}),
		wrapWidth: option({
			long: "wrap-width",
			description: "(Deprecated) Alias for --max-width",
			type: number,
			defaultValue: () => Number.POSITIVE_INFINITY,
			defaultValueIsSerializable: true
		}),
		wrapWithGutters: flag({
			long: "wrap-with-gutters",
			short: "G",
			description: "Add '|' characters to wrapped rows",
			defaultValue: () => false
		})
	},
	handler: ({
		align: alignments,
		alignAll,
		descriptors,
		noCaseHeaders,
		noPadHeaderSeparator,
		...args
	}) => {
		const columns =
			descriptors ??
			zip(args.column, alignments).map(([name, align]) => ({
				name,
				align
			}));

		let headerCase = args.headerCase;
		let maxWidth = args.maxWidth;

		// Support deprecated --wrap-width flag. This behavior will be removed in
		// a future major release.
		if (args.wrapWidth !== Number.POSITIVE_INFINITY) {
			warn(
				"Option --wrap-width is deprecated. Please use --max-width instead."
			);
			maxWidth = args.wrapWidth;
		}

		// Support deprecated --no-case-headers flag. This behavior will be
		// removed in a future major release.
		if (noCaseHeaders) {
			warn(
				"Option --no-case-headers is deprecated. Please use --header-case=preserve instead."
			);
			headerCase = headerCaseOptions.preserve;
		}

		const options = {
			...args,
			align: alignAll,
			columns,
			headerCase,
			maxWidth,
			padHeaderSeparator: !noPadHeaderSeparator
		} satisfies TablemarkOptions;

		try {
			print(tablemark(args.inputFile, options));
		} catch (error) {
			fail(
				error instanceof Error
					? error.message
					: `An unknown error occurred: ${String(error)}`
			);
		}
	}
});

await run(binary(cmd), process.argv);
