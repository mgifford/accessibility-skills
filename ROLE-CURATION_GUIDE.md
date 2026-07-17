# Role-Aware Accessibility Workflow Refactoring Plan

## Current Problem

The current ARRM role index generator overwrites human-curated `roles/<role>/ROLE.md` files with auto-generated task lists. This prevents maintainers from adding meaningful role guidance without it being automatically discarded.

## Migration Strategy

### 1. Directory Structure Changes

**Current Structure:**
```
roles/
├── content-authoring/
│   ├── ROLE.md              # (overwritten by generator)
│   ├── primary-tasks.csv   # generated
│   ├── secondary-tasks.csv # generated
│   └── contributor-tasks.csv # generated
├── front-end-development/
│   ├── ROLE.md              # (overwritten by generator)
│   ├── primary-tasks.csv   # generated
│   ├── secondary-tasks.csv # generated
│   └── contributor-tasks.csv # generated
└── ... (other roles)
```

**New Structure:**
```
roles/
├── content-authoring/
│   ├── ROLE.md                    # curated (NOT overwritten by generator)
│   └── generated/                 # generator output
│       ├── task-summary.md       # curated guidance
│       ├── primary-tasks.csv     # generated
│       ├── secondary-tasks.csv   # generated
│       └── contributor-tasks.csv # generated
├── front-end-development/
│   ├── ROLE.md
│   └── generated/
├── user-experience-design/
│   ├── ROLE.md
│   └── generated/
├── visual-design/
│   ├── ROLE.md
│   └── generated/
├── testing/
│   ├── ROLE.md
│   └── generated/
├── business-analysis/
│   ├── ROLE.md
│   └── generated/
└── ... (other roles)
```

### 2. Files to Change

#### Modified Files:
1. **`scripts/generate-role-indexes.js`** - Updated to not overwrite ROLE.md, generate task-summary.md instead
2. **`roles/*/ROLE.md`** - Recreate as curated content (to be populated)
3. **`ARCHITECTURE.md`** - Update to reflect new structure
4. **`ai-workflows/README.md`** - Update if referencing role structure

#### New Files:
1. **`scripts/tests/role-generation.test.js`** - New test suite
2. **`resources/guidance/README.md`** - Guidance for curated content
3. **`examples/role-guidance/`** - Templates for curated ROLE.md files (optional)

### 3. Files to Delete/Move:

#### Moving/Creating Generated Directories:
- `roles/<role>/generated/` - New directory for generated files
- Move existing CSV files: `roles/<role>/primary-tasks.csv` → `roles/<role>/generated/primary-tasks.csv`
- Move existing CSV files: `roles/<role>/secondary-tasks.csv` → `roles/<role>/generated/secondary-tasks.csv`
- Move existing CSV files: `roles/<role>/contributor-tasks.csv` → `roles/<role>/generated/contributor-tasks.csv`

#### New Generated File:
- `roles/<role>/generated/task-summary.md` - Summary of tasks by category (generated)

### 4. Migration Steps

#### Phase 1: Update Generator
1. Modify `scripts/generate-role-indexes.js`:
   - Add support for `generated/` subdirectory
   - Create task-summary.md with brief task overviews
   - Skip writing to `ROLE.md` from generator
   - Add clear comments in generated files about source

#### Phase 2: Create Curated ROLE.md Files
1. Create/update curated `roles/<role>/ROLE.md` files:
   - Purpose and responsibilities
   - Ownership and collaboration
   - Common questions and answers
   - Links to generated indexes
   - What the role doesn't own

#### Phase 3: Update Documentation
1. Update `ARCHITECTURE.md` to reflect new structure
2. Add guidance README for role curation
3. Update AI workflow documentation if needed

#### Phase 4: Testing
1. Create tests to verify:
   - Generator doesn't overwrite ROLE.md
   - All expected files are created
   - Generated file contents are correct
   - Role structure is maintained

### 5. Role-Specific Content Templates

#### Example Curated ROLE.md Structure:
```markdown
# Content Authoring Role

## Purpose
Content creation and management for accessible digital experiences

## Primary Ownership
- Writing accessible documentation
- Content structure and semantic markup
- Error identification and user guidance

## Influence
- Frontend development implementation
- Visual design alignment
- User experience flow

## Common Questions
- How do I write accessible form labels?
- What makes content truly accessible?
- How do I structure content for screen readers?

## Collaboration Partners
- Front-End Development (implementation)
- User Experience Design (validation)
- Visual Design (presentation)

## What It Doesn't Own Alone
- Technical HTML/CSS implementation
- Visual design decisions
- User testing coordination

## Expected Accessibility Outputs
- Documented accessible forms
- Semantic HTML structure
- Clear, reachable content

## Generated Task Indexes
- [Primary Tasks](./generated/primary-tasks.csv)
- [Secondary Tasks](./generated/secondary-tasks.js)
- [Contributor Tasks](./generated/contributor-tasks.csv)
```

### 6. Initial Roles to Implement

Begin with these six roles:
1. **Content Authoring**
2. **Front-End Development**
3. **User Experience Design**
4. **Visual Design**
5. **Testing**
6. **Business Analysis**

### 7. Testing Strategy

#### Tests to Create:
1. **Generator doesn't overwrite ROLE.md**
   - Run generator multiple times
   - Verify ROLE.md content remains unchanged
   - Check that timestamps don't update

2. **Generated files are created correctly**
   - Verify all expected generated files exist
   - Check file contents match source data
   - Validate CSV format and headers

3. **Role structure is maintained**
   - Verify role directories exist
   - Check file permissions
   - Ensure directory structure is correct

4. **Content separation**
   - Verify ROLE.md is not regenerated
   - Check generated files exist
   - Confirm no data loss in migration

### 8. Validation Commands

After implementation:

```bash
# Run validation tests
npm test

# Run role generation tests (new)
npx jest scripts/tests/role-generation.test.js

# Validate that ROLE.md files are not overwritten
# (implementation-specific validation command)

# Verify generated file contents
./scripts/validate-role-output.sh
```

### 9. Post-Migration Steps

#### After Generator Update:
1. **Test locally**: Run generator and verify output
2. **Check generated files**: Ensure all expected files are created
3. **Validate role directories**: Confirm structure is correct
4. **Test curation**: Verify ROLE.md files are not overwritten

#### After Testing:
1. **Update documentation**: Reflect new structure in all relevant files
2. **Create templates**: Provide templates for other roles
3. **Train contributors**: Explain curation vs. generation process
4. **Establish CI checks**: Ensure no accidental overwrites in pipeline

### 10. ARRM Data Update Workflow

#### Maintainer Steps for Updating ARRM Data:

1. **Download latest ARRM CSV**:
   ```bash
   curl -L -o data/arrm/arrm-all-tasks.csv https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv
   ```

2. **Update source provenance** in `scripts/generate-role-indexes.js`:
   ```javascript
   const ARRM_SOURCE_URL = 'https://github.com/w3c/wai-arrm/blob/draft/_data/arrm/arrm-all-tasks.csv';
   const ARRM_RETRIEVAL_DATE = 'YYYY-MM-DD'; // Update to current date
   ```

3. **Regenerate role indexes**:
   ```bash
   npm run generate:arrm-roles
   ```

4. **Verify integrity**:
   ```bash
   npm run check:arrm-roles
   ```

5. **Commit changes**:
   ```bash
   git add data/arrm/arrm-all-tasks.csv roles/*/generated/ scripts/generate-role-indexes.js
   git commit -m "Update ARRM data and regenerate role indexes"
   ```

#### Adding New Roles:

1. **Add role to SUPPORTED_ROLES** in `scripts/generate-role-indexes.js`:
   ```javascript
   'new-role': {
     arrmPatterns: ['new role pattern', 'alternative pattern'],
     description: 'New Role',
     dirName: 'new-role'
   }
   ```

2. **Add to knownRoles** in `scripts/check-arrm-roles.js`

3. **Create role directory structure**:
   ```bash
   mkdir -p roles/new-role/generated
   ```

4. **Regenerate and verify**:
   ```bash
   npm run generate:arrm-roles
   npm run check:arrm-roles
   ```

#### Troubleshooting:

- **Unknown role error**: Add the new role to `SUPPORTED_ROLES` or `IGNORED_ROLES`
- **Stale output error**: Run `npm run generate:arrm-roles` and commit changes
- **CSV parsing error**: Check CSV format matches expected columns

### 11. Go-Live Checklist

#### Before Going Live:
1. ✅ Generator updated to use `generated/` subdirectory
2. ✅ All role directories created with correct structure
3. ✅ ROLE.md files created as curated content
4. ✅ Generated files created with correct headers
5. ✅ Tests pass in CI environment
6. ✅ Documentation updated
7. ✅ Contributors trained on curation process

#### Ongoing Maintenance:
1. ☐ Regular generator runs check for issues
2. ☐ Curation process documented and maintained
3. ☐ Template updates for new roles
4. ☐ Validation tests run regularly

---

This refactoring maintains the core functionality while providing:
- **Better separation** of generated vs. curated content
- **More useful role documentation** for maintainers
- **Protection against accidental overwrites**
- **Clear guidelines** for role curation
- **Preserved role ownership** assignments

The system continues to provide:
- **ARRM task mapping** with accurate role assignments
- **Automated generation** of role indexes
- **Clear evidence** of source provenance
- **Structured output** for maintainability
- **Full test coverage** for reliability