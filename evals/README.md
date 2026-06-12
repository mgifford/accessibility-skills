# Evals

This directory holds repo-local evaluation manifests for accessibility skills.

The current convention is:

- one folder per skill, such as `evals/navigation/`
- one manifest per skill named `evals.json`
- a `skill_file` field that points to the target `skills/.../SKILL.md`

Manifest fields currently supported by the local validator:

- `skill_name` - the skill being evaluated
- `skill_file` - path to the skill file in `skills/`
- `evals` - array of evaluation cases
- per-eval fields such as `id`, `prompt`, `expected_output`, `expectations`
- optional arrays: `files`, `must_contain_any`, `must_not_contain`

Run the validator with:

```bash
npm run validate:evals
```

Run the scorer with:

```bash
npm run run:evals
```

Generate persisted report artifacts with:

```bash
npm run report:evals
```

That command writes both `reports/eval-report.json` and `reports/eval-report.md`
so you can review the current score and missing-response gaps later.

The runner looks for response files in `responses/<skill-name>/` and reads
`<id>.txt` or `<id>.md` for each eval case. Keep responses separate from the
manifests so you can generate them locally without changing the checked-in
eval definitions.

Keep the first eval set small and high-signal. Add more skills only after the
pilot manifest is stable.
