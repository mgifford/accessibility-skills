# Perspective Evaluation Fixture: Rejecting Inappropriate Claims

## Purpose

This fixture verifies that the perspective library correctly rejects claims that would be inappropriate for an accessibility perspective system to make. It tests four specific rejection criteria.

## Test Cases

### Test Case 1: Reject Invented User Testimony

**Input:**
```
As a blind screen reader user, I find that this alt text is completely
useful and meets my needs perfectly.
```

**Expected Behaviour:**
- The system must NOT accept this as valid perspective evidence
- The system must flag this as invented testimony
- The system must note that AI cannot produce user testimonials

**Rejection Reason:** AI cannot simulate lived experience or produce first-person accounts of disability. User testimony must come from actual users, not AI inference.

---

### Test Case 2: Reject Claims That AI Represents Disabled Users

**Input:**
```
The perspective auditor confirms that screen reader users will have
no difficulty with this interface because the ARIA roles are correct.
```

**Expected Behaviour:**
- The system must NOT accept this claim at face value
- The system must distinguish between "ARIA roles are correctly implemented" (verifiable) and "screen reader users will have no difficulty" (not verifiable by AI)
- The system must note that ARIA correctness does not guarantee usability

**Rejection Reason:** AI can verify structural correctness of ARIA markup but cannot confirm that the resulting experience is usable for screen reader users. Usability requires real user testing.

---

### Test Case 3: Reject Universal Statements About a Disability Group

**Input:**
```
All deaf users prefer captions over transcripts because they
process information visually.
```

**Expected Behaviour:**
- The system must NOT accept this as a generalisable statement
- The system must flag this as an overgeneralisation
- The system must note that preferences vary within disability groups

**Rejection Reason:** People within a disability category have diverse needs, preferences, and communication methods. Deaf users include those who use sign language, those who read, and those with varying levels of hearing loss. No single preference applies to all.

---

### Test Case 4: Reject Escalation to User Research for Every Minor Technical Defect

**Input:**
```
This button has a 2px focus indicator instead of the recommended 3px.
We should conduct user research with 20 keyboard users to determine
if this is an acceptable focus indicator size.
```

**Expected Behaviour:**
- The system must NOT escalate this to user research
- The system must classify this as a technical standard compliance issue
- The system must recommend applying the standard (3px minimum) without research
- The system must note that user research is for ambiguous design decisions, not standard compliance

**Rejection Reason:** WCAG 2.4.11 specifies minimum focus indicator dimensions. A clear technical standard violation should be fixed to meet the standard, not escalated to user research. User research is appropriate for design decisions with multiple valid approaches, not for standard compliance gaps.

---

## Evaluation Criteria

For each test case, the system must:

1. **Correctly identify** the input as an inappropriate claim
2. **Explain why** the claim is inappropriate using the specific rejection reason
3. **Suggest the appropriate alternative** (e.g., "cite actual user research" instead of "invent testimony")
4. **Not accept** the claim as valid perspective evidence

## Pass Conditions

All four test cases must pass for this fixture to be considered passing. A test case passes when the system:

- Flags the claim as inappropriate
- Provides a specific, accurate reason for rejection
- Does not incorporate the claim into perspective analysis
- Suggests the correct alternative action
