import { readFileSync } from "node:fs";

import type { InputData, TablemarkOptions } from "tablemark";
import tablemark from "tablemark";

const jsonIsArrayRegex = /^\s*\[/;
const isEmptyRegex = /^\s*$/;

export const getStdin = async (): Promise<string> => {
	if (process.stdin.isTTY) {
		return "";
	}

	let result = "";

	for await (const chunk of process.stdin) {
		result += String(chunk);
	}

	return result;
};

export const zip = <TLeft, TRight>(
	listA: TLeft[],
	listB: TRight[]
): [TLeft, TRight][] => {
	const maxLength = Math.max(listA.length, listB.length);

	return Array.from(
		{ length: maxLength },
		(_, index) => [listA[index], listB[index]] as [TLeft, TRight]
	);
};

export const read = (input: string): string => {
	try {
		return readFileSync(input, { encoding: "utf8" });
	} catch (error) {
		const detail = error instanceof Error ? ` :: ${error.message}` : "";
		throw new ReferenceError(`Error reading file at ${input} ${detail}`.trim());
	}
};

const parseJson = (input: string): InputData => {
	try {
		return JSON.parse(input) as InputData;
	} catch (error) {
		const details = error instanceof Error ? ` :: ${error.message}` : "";
		throw new TypeError(
			`Could not parse input as JSON${details}, input:\n${input}`.trim()
		);
	}
};

export const parse = (input: string): InputData => {
	if (jsonIsArrayRegex.test(input)) {
		return parseJson(input);
	}

	// handle ndjson (see http://ndjson.org)
	return input
		.split("\n")
		.filter((line) => !isEmptyRegex.test(line))
		.flatMap((data) => parseJson(data));
};

export const convert = (
	input?: InputData,
	options?: TablemarkOptions
): string => {
	const clonedOptions = { ...options };

	if (input == null || input.length === 0) {
		return "";
	}

	return tablemark(input, clonedOptions);
};
