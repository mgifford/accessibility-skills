# Evaluation Manifest

This directory contains evaluation fixtures that demonstrate the core functionality of the role-aware accessibility workflow.

Each fixture tests the system's ability to:

1. Map findings to ARRM tasks and role ownership
2. Distinguish between auto-fixable and judgement-call requirements  
3. Generate role-specific questions and recommendations
4. Document conflicts and uncertainty
5. Route findings to appropriate human processes

Fixtures are intended to be run using the repository's existing evaluation infrastructure.

# Evolution Path

The evaluation system is designed to evolve from simple deterministic fixes to complex multi-role decisions. Early fixtures focus on establishing the core mapping and decision-state logic, while later fixtures will test advanced scenario handling.

# Next Steps

1. Implement a simple testing framework for evaluating planner output
2. Add more fixture scenarios covering edge cases
3. Create tests for integration with other AI workflows
4. Add evaluation of perspective auditor and bug reporter capabilities