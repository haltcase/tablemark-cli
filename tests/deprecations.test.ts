import { assert, expect, test } from "vitest";

import { execute, resolveFixture, snapshotFile } from "./helpers.ts";

const inputPath = resolveFixture("./input.json");

test("warns on use of --wrap-width", async () => {
	const { success, stdout, stderr } = await execute(
		`${inputPath} --wrap-width 6`
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(
		snapshotFile("deprecations/wrap-width-stdout")
	);
	await expect(stderr).toMatchFileSnapshot(
		snapshotFile("deprecations/wrap-width-stderr")
	);
});

test("warns on use of --no-case-headers", async () => {
	const { success, stdout, stderr } = await execute(
		`${inputPath} --no-case-headers`
	);

	assert(success);
	await expect(stdout).toMatchFileSnapshot(
		snapshotFile("deprecations/no-case-headers-stdout")
	);
	await expect(stderr).toMatchFileSnapshot(
		snapshotFile("deprecations/no-case-headers-stderr")
	);
});
