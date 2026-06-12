# Responses

Put generated model output here when you want to score it against the eval
manifests.

Recommended layout:

- `responses/navigation/1.txt`
- `responses/navigation/2.txt`
- `responses/forms/1.txt`
- `responses/forms/2.txt`

You can also store a combined skill response in `responses/<skill-name>/all.md`
or `all.txt`. In that file, separate each eval with a heading like `## Eval 1`,
`## Eval 2`, and so on. The scorer will use the matching section for that eval.

The runner checks each response file against the matching manifest entry in
`evals/<skill>/evals.json`.
