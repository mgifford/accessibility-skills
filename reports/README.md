# Reports

This directory stores persisted outputs from the eval runner.

Run:

```bash
npm run report:evals
```

The command writes:

- `reports/eval-report.json`
- `reports/eval-report.md`

It also keeps these companion summaries in the same directory:

- `reports/eval-requirements.json`
- `reports/eval-requirements.md`

These files are generated from the current eval manifests and any matching
response files under `responses/<skill-name>/`.
