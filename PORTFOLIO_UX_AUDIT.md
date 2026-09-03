# Portfolio UX Audit — Keith Vergara

**Audit date:** September 2, 2026  
**Scope:** Landing page, mobile landing page (390 px), and the TRACKY project page  
**Primary user goal:** A recruiter, hiring manager, or prospective client should be able to decide quickly whether to contact you, then find convincing proof that you can deliver relevant work.

## Overall assessment

This is a polished, credible foundation. It is responsive, visually consistent, easy to scan, and already includes real projects, experience, contact links, a work-status signal, and accessible structural basics such as a skip link and labeled navigation.

What it lacks is a stronger *conversion story*: a visitor can see that you are a developer, but cannot immediately see what kind of problem you are best at solving, how well you solved it, or the clearest next action to take. The portfolio currently reads more like a well-designed resume than a focused product portfolio.

## What is working

- The dark, technical visual language is cohesive across desktop, mobile, and project pages.
- The page has a clear section order: identity, profile, experience, skills, projects, education, then contact.
- Project detail pages include real interface screenshots; TRACKY in particular gives the work visual credibility.
- The mobile layout remains readable and the menu is compact rather than crowded.
- The site includes visible availability, email, GitHub, LinkedIn, theme control, scroll progress, and keyboard-oriented structure.

## Highest-impact gaps

### 1. The top of the page lacks a concrete value proposition

**Priority: P0 — do first**

The opening identifies you as a “Full-Stack Web Developer,” but the animated role line rotates through several broad statements such as “Let’s build your website,” “Building Solutions,” and “Let’s track your sales.” This makes positioning feel less specific than your actual experience.

**Why it matters:** Recruiters scan very quickly. A visitor should understand your specialty, audience, and proof before they scroll.

**Add:**

- One stable, outcome-led headline, for example: “Full-stack developer building internal tools and financial products people rely on.”
- A short proof line beneath it: years of experience, production work, or a specific strength such as real-time dashboards, workflow automation, or AI-assisted finance tools.
- Two primary actions: **View selected work** and **Email me / Download résumé**.

Avoid making the headline itself rotate; motion makes the key positioning harder to scan and capture.

### 2. The project list shows features, not outcomes

**Priority: P0 — do next**

Project cards describe what each product contains (“AI transaction parsing,” “real-time sync,” “GPS mapping”), but they do not establish the problem, your role, constraints, users, or result.

**Why it matters:** A hiring manager needs evidence of judgment and impact, not only a technology inventory.

**Add to each featured project:**

- **Problem:** what was slow, error-prone, or missing.
- **Your role:** ownership, collaboration, and the parts you built.
- **Outcome:** a measured result where permissible, or a credible proxy such as time saved, workflows consolidated, user type served, or production status.
- **Key decision:** one technical or UX trade-off that reveals how you think.

Example card summary: “Replaced manual cooperative records with a real-time member, loan, and ledger workflow—built end-to-end with Next.js and Supabase.”

### 3. Your best work is not prioritized above the fold

**Priority: P0**

Visitors must scroll through biography, experience, and a large skills marquee before reaching projects. Your strongest visual proof—especially TRACKY and Coop-Tracker—is therefore delayed.

**Add:**

- A **Selected work** section immediately after the hero, containing 2–3 projects only.
- One representative screenshot or a restrained thumbnail per featured card.
- A short “More projects” link below the featured work for the remaining entries.

This makes the portfolio feel like a portfolio first and a résumé second.

### 4. Case studies are galleries, not yet decision stories

**Priority: P1**

The TRACKY page has an overview, stack, live link, and useful screenshots. It does not yet explain the workflow, design choices, your contribution, the hard part, or any result. The images show the final UI but not why it is designed that way.

**Add this case-study structure:**

1. One-sentence challenge and product outcome.
2. Context: users, constraints, and your role.
3. Key flows or screenshots annotated with the decision they support.
4. Technical approach and one difficult problem solved.
5. Result, lesson learned, and live/repository links where public.

For confidential client work such as 371admin, use redacted screens and describe the business workflow without exposing sensitive operational data.

### 5. The contact area has no compelling close

**Priority: P1**

“Open to collaborations” is friendly but passive. The email, GitHub, and LinkedIn links are present, yet the footer does not clarify what you want to be contacted about or provide a strong action.

**Add:**

- A direct invitation: “Hiring for full-stack, dashboard, or workflow-automation work? Let’s talk.”
- A prominent **Email Keith** button alongside secondary GitHub and LinkedIn links.
- A résumé download/link and timezone or availability expectation if useful for your target roles.

### 6. Skills occupy more attention than evidence

**Priority: P1**

The animated skills marquee is visually interesting, but it takes substantial space while communicating little about depth, context, or how you apply those tools. It also moves continuously, which can distract from scanning and should respect reduced-motion preferences.

**Improve it by:**

- Grouping skills by confidence and use: **Daily tools**, **Backend/data**, and **AI/productivity**.
- Connecting important technologies to projects or experience instead of presenting all tools as equivalent.
- Pausing animation for keyboard focus and honoring `prefers-reduced-motion`.

### 7. Resume details need a credibility pass

**Priority: P1**

Several copy details weaken an otherwise polished presentation: “Im” should be “I’m,” “Based on Philippines” needs “Based in the Philippines,” and “5 working projects” is vague. The professional identity can be more precise than the degree and project count.

**Improve it by:**

- Replacing informal or generic phrasing with concise, specific language.
- Using “5 shipped projects” only if it is accurate, or removing the count.
- Adding graduation date (if advantageous), professional certifications, open-source activity, or other verifiable signals.
- Reviewing capitalization and labels for consistency: `Tech Stack` rather than `Tech-Stack`.

### 8. There is no tailored path for different visitors

**Priority: P2**

Recruiters, technical interviewers, and prospective clients all land on the same long page. The current navigation helps, but it does not surface the distinct proof each audience values.

**Consider adding:**

- A concise résumé PDF for recruiters.
- GitHub/source links for projects that can be public.
- “What I can help with” service cards for clients: dashboards, internal tools, automation, and full-stack web apps.
- A compact availability/status note for clients and employers.

### 9. Accessibility and interaction need verification beyond visual review

**Priority: P2**

The page includes good starting points—skip link, labeled navigation, and visible focus styles in the stylesheet. A visual audit cannot confirm keyboard flow, contrast ratios, screen-reader announcements, or motion preferences.

**Verify next:**

- Keyboard focus order, menu focus trap/return behavior, and Escape-to-close behavior on mobile navigation.
- Sufficient contrast for muted copy, chips, borders, and the animated/background treatment in both themes.
- `prefers-reduced-motion` behavior for the name glitch, role transition, card entrance, badge pulse, and marquee.
- Descriptive image alt text on every project screenshot; labels such as “Main Dashboard” are a useful start but can be more informative.
- Clear visible states for all interactive controls, not only hover states.

## Recommended information architecture

1. **Hero:** specific specialty, proof line, availability, and two calls to action.
2. **Selected work:** 2–3 visual, outcome-led project summaries.
3. **Experience:** concise credibility timeline with measurable responsibility/outcomes.
4. **Capabilities:** grouped skills and the kinds of systems you build.
5. **Additional projects:** remaining work with lighter summaries.
6. **About / education:** human context, kept concise.
7. **Contact:** direct invitation, email CTA, résumé, GitHub, LinkedIn.

## 30-minute improvement plan

1. Replace the rotating hero statements with one specific positioning statement and add “View selected work” plus “Email me.”
2. Move TRACKY and Coop-Tracker directly below the hero, each with a thumbnail and one outcome-led sentence.
3. Rewrite the five project descriptions around problem, role, and result.
4. Make the contact section action-oriented and add a résumé link.
5. Correct copy issues and add reduced-motion support before adding more decorative motion.

## Evidence limits

This review was based on the current local render of the desktop landing page, a 390 px mobile landing page, and the TRACKY case-study page, plus the available source structure. It does not test real visitor analytics, résumé content, live-project reliability, keyboard behavior, screen-reader output, or formal WCAG conformance.
