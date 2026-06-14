# 3D Tech Constellation Design

## Goal

Add a new flagship page to the Hexo blog that publicly presents the author's technical growth as a highly polished 3D constellation map.

The page should feel visually striking, technically mature, and personally authored rather than like a generic portfolio grid.

## Context

The current blog already includes:

- a custom immersive music page
- a custom tag-tree landing page
- animated ambient effects such as loader, cursor, and snow
- theme-level page customization through EJS, CSS, and page front matter

The user wants a new page that behaves like a lightweight companion experience, but with a stronger public showcase purpose:

- it should represent real learning progress
- it should focus on `Java后端`、`大模型`、`Agent`
- it should allow custom notes per technology node
- it should be maintained directly in theme configuration
- it should look very cool, ideally with true 3D spatial presentation

This is not a private dashboard. It is a public-facing growth map inside the blog.

## Non-Goals

- Do not build a generic resume page.
- Do not require a database or server-side editing backend.
- Do not make the page depend on user login or author-only UI.
- Do not turn the page into a free-flight 3D demo that harms readability.
- Do not load heavy 3D code across the whole site when only one page needs it.

## Approved Product Direction

### Core Shape

The feature is a dedicated `技术星图` page with a supporting mini entry on the homepage or sidebar.

The main page is the primary experience.

The mini entry is a lightweight summary card that drives visitors into the full constellation view.

### Primary Audience

Public visitors to the blog, including:

- peers
- recruiters
- classmates
- collaborators
- the author returning to update the map

### Tone

The page should feel:

- restrained
- technical
- atmospheric
- slightly futuristic
- suitable for a computer science graduate student

Avoid overly cute, overly childish, or overly decorative visual language.

## Information Model

### Top-Level Structure

The constellation has three equal primary trunks:

- `Java后端`
- `大模型`
- `Agent`

These are parallel pillars, not a single-root dependency chain.

### Node Model

Each technology node represents one concrete skill, concept, framework, or tooling area.

Each node must support:

- technology icon
- status badge
- one short visible label
- one longer detailed note
- branch membership
- optional related article links
- update timestamp
- spatial positioning data for the 3D scene

### Public Presentation Model

The page is explicitly public-facing.

That means the node content should optimize for:

- clear wording
- modest but confident status naming
- short explanatory notes that others can understand
- enough detail to feel personal without becoming a private notebook dump

## Status System

### Approved Status Levels

The page uses four growth states:

- `了解`
- `会用`
- `做过项目`
- `能输出`

### Meaning

`了解`

- understands the concept and purpose
- has not yet built strong hands-on experience

`会用`

- can use the technology for common tasks
- has passed the purely conceptual stage

`做过项目`

- has used it in a real project, experiment, or integrated feature
- indicates meaningful applied practice

`能输出`

- can explain it clearly
- can write about it
- can summarize tradeoffs or guide others through it

### Visual Mapping

The 3D scene should map status to visual intensity:

- `了解`: dim cold glow, weak halo
- `会用`: stable lit node, soft breathing pulse
- `做过项目`: stronger glow, more active link energy
- `能输出`: strongest glow, outer pulse ring, highest visual weight

Status must remain readable even if glow effects are disabled or reduced.

## Content Model

### Required Node Fields

Each node should support the following configuration fields:

- `id`
- `name`
- `icon`
- `branch`
- `status`
- `short_note`
- `detail`
- `tags`
- `updated_at`
- `position`

Recommended `position` shape:

- `x`
- `y`
- `z`

### Optional Node Fields

- `articles`
- `projects`
- `featured`
- `hidden`

### Branch-Level Fields

Each primary branch should support:

- `id`
- `name`
- `subtitle`
- `icon`
- `color`
- `core_position`
- `description`

### Page-Level Fields

The constellation page should support configuration for:

- page title
- page subtitle
- hero eyebrow text
- hero summary line
- total stats labels
- legend copy
- mini-entry title
- mini-entry summary

## Page Layout

### 1. Hero Header

The top of the page introduces the experience.

Recommended content:

- page title
- one-line identity statement
- short summary copy
- top-level stats such as node count, lit count, and latest update

This area should frame the page without competing with the 3D scene.

### 2. 3D Main Stage

This is the visual centerpiece.

The scene contains:

- three luminous branch cores
- distributed technology nodes around each core
- glowing links between related nodes
- subtle particles or field noise
- controlled camera motion

The stage should feel like a curated technical universe, not random floating dots.

### 3. Detail Panel

Clicking a node opens a stable detail surface outside the 3D scene.

The panel should display:

- node name
- technology icon
- status badge
- short note
- full detail text
- keywords
- related article links
- parent branch label
- updated date

Desktop layout should prefer a right-side panel.

Mobile layout should place this panel below the stage.

### 4. Mini Entry Card

The homepage or sidebar entry should summarize the constellation with low cognitive load.

Recommended contents:

- title
- three-branch progress summary
- lit node count
- latest updated node
- button or link into the full page

The mini card should visually echo the main page without embedding the full 3D scene.

## Interaction Design

### Main Stage Behavior

Desktop:

- light camera parallax on pointer movement
- controlled drag rotation
- hover highlight for nodes and connected paths
- click to focus a node and open details

Mobile:

- no free rotation requirement
- tap to focus nodes
- reduced motion and simplified camera response

### Focus Rules

When one node is active:

- its branch should become more visually legible
- connected links should intensify
- unrelated nodes may slightly fade back
- the detail panel becomes the primary reading surface

### Short Note Exposure

Because the user wants both quick labels and full notes:

- each node should expose a concise visible label in the scene or near-scene UI
- full detail should appear only in the detail panel

The short note must remain brief enough not to clutter the stage.

## Visual Direction

### Overall Look

The visual language should lean toward:

- deep-space navy and charcoal backdrops
- electric cyan, blue, teal, and controlled warm accents
- high-quality bloom and glow
- crisp engineering-like typography
- quiet rather than flashy motion

Avoid candy colors or game-like cartoon rendering.

### 3D Aesthetic

The scene should feel like:

- a personal research universe
- a systems diagram elevated into a constellation
- a technical map with emotional atmosphere

Each main branch should feel distinct but part of one coherent galaxy.

### Icon Strategy

The design needs both technology icons and state indicators.

Recommended layering:

- technology icon identifies what the node is
- status badge or ring communicates progress level

These two signals must remain visually separable.

## Technical Approach

### Approved Architecture

Use a hybrid architecture:

- WebGL for the true 3D constellation stage
- DOM for hero, stats, legend, detail panel, and mini entry
- theme configuration as the source of truth

This is the preferred compromise between spectacle and maintainability.

### Why Hybrid

It provides:

- real depth and camera movement
- clean readable content surfaces
- easier responsive layout behavior
- safer fallback if 3D initialization fails

### Preferred Rendering Stack

For implementation, prefer:

- `Three.js` for the 3D layer
- existing EJS templates for page shell markup
- existing theme CSS plus dedicated constellation styles
- page-scoped JavaScript loaded only where needed

### Configuration Source

The user wants direct configuration maintenance.

Therefore the recommended source of truth is theme data configuration, most likely under:

- `source/_data/argon.yml`

The implementation may later split large data into a secondary file if maintenance becomes painful, but the initial design assumes direct configuration inside the current theme-oriented data flow.

## Page Integration Strategy

### Page Trigger

The new page should follow the current custom-page pattern already used by the theme.

Recommended approach:

- create a dedicated page such as `source/tech-map/index.md`
- assign a specific front matter flag such as `lq_tech_map_page: true`
- route page rendering through a custom branch in the existing page partial logic

### Likely Theme Touchpoints

- `themes/argon/layout/layout.ejs`
- `themes/argon/layout/_partial/content-page.ejs`
- `themes/argon/source/style.css`
- a new page-specific script under `themes/argon/source/`
- `source/_data/argon.yml`

### Asset Loading

The 3D script should load only on the constellation page.

Do not attach the full 3D runtime to normal article pages, archives, or the homepage.

## Fallback and Resilience

### 3D Failure Mode

If the 3D scene cannot initialize:

- the page must still render a static readable fallback
- node list or branch panels should remain accessible
- details and links must still work

The page should never fail into a blank hero or empty canvas.

### Motion Preferences

Respect reduced-motion preferences by:

- reducing camera drift
- lowering or disabling pulse intensity
- simplifying particle motion

### Performance Expectations

The scene should prioritize smoothness over excess ornament.

Especially important:

- keep mobile rendering lighter
- avoid excessive post-processing
- avoid large icon asset bloat

## Mini Entry Design

### Role

The mini entry is a bridge, not a second full product.

It should:

- hint at the existence of the constellation
- summarize progress
- invite deeper exploration

### Placement

Either of these is acceptable:

- sidebar card
- homepage section

The final implementation can choose one primary placement first and add the second later if it still feels balanced.

### Behavior

The mini entry should not attempt full 3D interaction.

It can use:

- a small animated glow cluster
- static branch progress bars
- a compact node count summary

## Initial Content Guidance

### Example Branch Expansion

`Java后端`

- Java
- Spring
- Spring Boot
- MySQL
- Redis
- Linux
- Docker

`大模型`

- Transformer
- Prompt Engineering
- RAG
- Embedding
- Vector Database
- Fine-tuning

`Agent`

- Tool Calling
- Workflow Design
- Memory
- Planning
- Multi-Agent
- Evaluation

These are examples only. The final node list should reflect the author's real path and remain editable through configuration.

## Accessibility

The page must remain understandable without depending only on color or glow.

Required safeguards:

- textual status labels
- keyboard-reachable detail content
- readable contrast in dark surfaces
- fallback descriptions if icons fail to load

## Testing Strategy

Implementation planning should include:

- page shell rendering tests
- configuration parsing tests
- fallback rendering tests
- mini-entry rendering tests
- responsive layout verification

3D rendering itself may require lighter structural tests plus manual browser verification.

## Recommended Delivery Order

1. Add configuration schema for branches and nodes.
2. Add the dedicated page route and page shell.
3. Implement a non-3D readable fallback layout first.
4. Layer in the 3D stage with page-scoped loading.
5. Add the mini entry card.
6. Tune motion, glow, and responsive behavior.

This order keeps the page useful even before the full visual polish is complete.

## Open Decisions Intentionally Deferred

These details should be settled during implementation planning rather than design approval:

- exact 3D node coordinates
- whether the mini entry ships in sidebar first or homepage first
- exact icon source set
- whether related articles are entered manually or derived from existing posts

## Final Recommendation

Build the feature as a public, configuration-driven, hybrid 3D constellation page with three equal main trunks: `Java后端`、`大模型`、`Agent`.

Use true 3D only for the visual stage, keep all rich reading surfaces in DOM, and preserve a reliable fallback path so the page remains maintainable inside the existing Hexo theme.
