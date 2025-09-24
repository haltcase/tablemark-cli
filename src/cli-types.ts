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

			const result = await Promise.all(
				raw.map(async (item) => {
					if (typeof item !== "object" || item == null) {
						throw new TypeError("Not an array of objects");
					}

					const object = item as Record<string, unknown>;

					return Object.fromEntries(
						await Promise.all(
							Object.entries(object).map(async ([key, value]) => {
								let outputValue: unknown;

								switch (key) {
									case "align": {
										outputValue = alignmentType.from(String(value));
										break;
									}
									case "name": {
										outputValue = string.from(String(value));
										break;
									}
									case "overflowHeaderStrategy":
									case "overflowStrategy": {
										outputValue = overflowStrategyType.from(String(value));
										break;
									}
									case "textHandlingStrategy": {
										outputValue = textHandlingStrategyType.from(String(value));
										break;
									}
									case "maxWidth": {
										outputValue = number.from(String(value));
										break;
									}
									case "width": {
										outputValue = number.from(String(value));
										break;
									}
								}

								return [key, await outputValue] as const;
							})
						)
					);
				})
			);

			return result as ColumnDescriptor[];
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
