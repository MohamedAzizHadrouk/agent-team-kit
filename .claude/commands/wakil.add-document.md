---
description: File a client document, index it, and extract useful facts into the context files
argument-hint: <entity-slug> <file path|link|pasted text> [about: department|project|organisation] [--confidential]
---
# /wakil.add-document – Add a document to a client's context

Act as the **manager** (`.claude/agents/manager.md`). Arguments: `$ARGUMENTS`

## Purpose
When the owner sends a document (department description, org chart, presentation, brand guide, employee list…),
store it properly and turn its content into usable context.

## Arguments
| Argument | Required | Values | Default |
|---|---|---|---|
| `<entity-slug>` | yes | slug from the registry | – |
| `<source>` | yes | a local file path, a link, or pasted text | – |
| `[about]` | no | `department:<slug>`, `project:<slug>` or `organisation` | guessed from content, confirmed with the owner |
| `--confidential` | no | flag | off – with it: do NOT copy the file; record only where it lives |

## Preconditions
- `entities/<client>/documents/INDEX.md` exists (else create it from the template).

## Steps
1. Non-confidential file → copy it into `entities/<client>/documents/` (sub-folder by topic if useful). Pasted text →
   save it as a `.md` file there. Link → keep the link. Confidential → no copy.
2. Add a row to `documents/INDEX.md`: title, type, date, about, confidentiality, where.
3. Read it and extract facts into the right files (dated, "source: <document title>"):
   departments → DEPARTMENT.md / ORG.md · people → PEOPLE.md (work contacts only) · brand → BRAND.md ·
   project facts → PROJECT.md · rules/approvals → RULES.md.
4. List what was extracted and anything unclear (questions with suggested defaults).

## Rules
- Never store ID numbers, payslips, passwords, personal (non-work) contact details – remove them and tell the owner.
- Don't copy copyrighted third-party material into deliverables; context use only.
- Client documents are private (git-ignored).

## Output
Where the document was filed, the INDEX row, the facts extracted (file + section), open questions.

## Schedulable
No.

## Examples
- `/wakil.add-document acme C:\Users\me\Downloads\sales-department.pdf department:sales`
- `/wakil.add-document acme https://drive.example.com/org-chart --confidential`
