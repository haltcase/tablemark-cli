import { number, oneOf as namelessOneOf, string, type Type } from "cmd-ts";
import type { ColumnDescriptor, InputData } from "tablemark";
import {
	alignmentOptions,
	headerCaseOptions,
	lineBreakStrategies,
	overflowStrategies,
	textHandlingStrategies,
	unknownKeyStrategies
} from "tablemark";

import { getStdin, parse, read } from "./util.ts";

// A version of `oneOf` that also sets the `displayName` so the help text is
// more specific than just `value`
const oneOf = <T extends string>(
	literals: Parameters<typeof namelessOneOf<T>>[0],
	name: string
): ReturnType<typeof namelessOneOf<T>> => ({
	...namelessOneOf(literals),
	displayName: name
});

export const alignmentType = oneOf(
	Object.values(alignmentOptions),
	"Alignment"
);

export const headerCaseType = oneOf(
	Object.values(headerCaseOptions),
	"HeaderCase"
);

export const lineBreakStrategyType = oneOf(
	Object.values(lineBreakStrategies),
	"LineBreakStrategy"
);

export const overflowStrategyType = oneOf(
	Object.values(overflowStrategies),
	"OverflowStrategy"
);

export const unknownKeyStrategyType = oneOf(
	Object.values(unknownKeyStrategies),
	"UnknownKeyStrategy"
);

export const textHandlingStrategyType = oneOf(
	Object.values(textHandlingStrategies),
	"TextHandlingStrategy"
);

export const descriptorsType: Type<string, ColumnDescriptor[]> = {
	async from(input) {
		try {
			const raw = JSON.parse(input) as unknown;

			if (!Array.isArray(raw)) {
				throw new TypeError("Not an array");
			}

			for (const item of raw) {
				if (typeof item !== "object" || item == null) {
					throw new TypeError("Not an array of objects");
				}

				const object = item as Record<string, unknown>;
				for (const [key, value] of Object.entries(object)) {
					switch (key) {
						case "align": {
							await alignmentType.from(String(value));
							break;
						}
						case "name": {
							await string.from(String(value));
							break;
						}
						case "overflowHeaderStrategy":
						case "overflowStrategy": {
							await overflowStrategyType.from(String(value));
							break;
						}
						case "textHandlingStrategy": {
							await textHandlingStrategyType.from(String(value));
							break;
						}
						case "maxWidth":
						case "width": {
							await number.from(String(value));
							break;
						}
					}
				}
			}

			return raw as ColumnDescriptor[];
		} catch {
			throw new Error(`Expected a JSON array of column descriptors`);
		}
	},
	displayName: "ColumnDescriptors",
	description: `column descriptors as a JSON array`
};

export const filePathOrStdinType: Type<string, InputData> = {
	async from(input) {
		const content = input === "-" ? await getStdin() : read(input);

		if (content === "" && process.stdin.isTTY) {
			return [];
		}

		return parse(content);
	}
};
