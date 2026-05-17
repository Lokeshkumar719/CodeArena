# `frontend/src/components/problem/ProblemTabs.jsx`

**Source:** `frontend/src/components/problem/ProblemTabs.jsx`  
**Doc path:** `frontend_docs/components/problem/ProblemTabs.md`

# File Purpose

Tab strip for problem solver panels (left and right), with icons and active-state styling.

# Responsibilities

- Render one button per tab id in `tabs` array.
- Call `setActiveTab(tab)` on click.
- Show icon from `tabIcons` map and capitalized label.

# Main Functions / Components / Classes

| Symbol | Type | Role |
|--------|------|------|
| `ProblemTabs` | default export | Tab bar |
| `tabIcons` | object | Maps tab id → `react-icons/fi` component |
| Props | `tabs`, `activeTab`, `setActiveTab` | Controlled tabs |

Supported tab ids in icon map: `description`, `editorial`, `solutions`, `submissions`, `code`, `testcase`, `result`.

# Internal Logic

Horizontal scrollable flex row: active tab gets `bg-primary text-primary-content shadow-md`; inactive `bg-base-100 hover:bg-base-300`.

Uses **Tailwind/DaisyUI classes**, not `.tab-bar` / `.tab-btn` from ProblemPage.css.

# Inputs and Outputs

| Input | Output |
|-------|--------|
| `tabs` array | Button row |
| Click | `setActiveTab(tabId)` |

# Dependencies

`react-icons/fi` (`FiFileText`, `FiBookOpen`, `FiCode`, `FiClock`, `FiTerminal`).

# Used By

- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md) — twice (left and right tab sets)

# API Connections

None.

# Database Connections

None.

# State/Context Dependencies

Controlled: `activeTab` / `setActiveTab` from `ProblemPage`.

# Related Files

- [`../../pages/ProblemPage.css.md`](../../pages/ProblemPage.css.md) (legacy tab CSS unused)
- [`../../pages/ProblemPage.md`](../../pages/ProblemPage.md)

# Next Files To Read

1. [`ProblemDescription.md`](./ProblemDescription.md)
2. [`CodeEditorPanel.md`](./CodeEditorPanel.md)

# Common Risks / Notes

- Unknown tab ids render without icon (`tabIcons[tab]` undefined).
- `testcase` and `result` both use `FiTerminal` icon.

# Last Reviewed: 2026-05-18
