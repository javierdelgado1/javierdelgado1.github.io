---
title: 5 security problems I found reviewing a ten-year-old frontend
description: Picking up a 2016 web project, I found exposed API keys, a vulnerable PHP form, and dead APIs. Here's the checklist to run before touching a single line of new code.
date: 2026-09-06
category: Security
tags: [security, git, frontend, maintenance]
cover: /assets/img/cover-seguridad.jpg
coverAlt: Padlock resting on a computer keyboard
author: Javier Delgado
translationKey: legacy-frontend-security
keyPoints:
  - An API key committed to a public repository stays exposed even after you delete it from the code; you have to rotate it.
  - "Unused" code (PHP forms, old integrations) is still reachable and exploitable on the server.
  - Committing build artifacts and zip files hides old dependencies and secrets inside the repository.
  - Before auditing a dependency, check whether it's actually imported; many aren't.
  - A security review of a legacy project takes an afternoon and doesn't require migrating anything.
---

When I decided to modernize my portfolio, the first thing I did wasn't pick a framework — it was read the repository with an attacker's eyes. In a 2016 project patched on and off for years, I found five problems that are extremely common in any legacy frontend. Here they are, along with the fix I applied to each.

## 1. An API key in the HTML

The `index.html` had a Google Maps `<script>` with the API key written right into the URL. The map wasn't even shown: the `div` that held it was commented out. But the key was still there, in a public repository, available to anyone.

**What I did**: delete the script. **What still needs to happen**: rotate the key. Removing it from the current code isn't enough, because git history keeps every previous version of the file. The new key should be restricted by domain (HTTP referrer) so it only works from the site.

> Rule of thumb: if a secret ever touched a public commit, it's compromised. Rotate it.

## 2. A PHP contact form nobody used

The project included `contact-form.php`, the script that shipped with the original template to send emails. The Vue contact component already posted data to a different backend, so the PHP was dead code — and dangerous at the same time. It was still deployed and reachable by URL.

A script like that, with no validation or rate limiting, is a spam relay waiting to happen. **What I did**: delete it, and while I was at it, remove the entire contact section, which was the only reason jQuery Validate was loaded.

## 3. An integration with a dead API

There was an `api/twitter/` folder with code for the Twitter API v1.1, shut down years ago, complete with its own token configuration file. Dead code doesn't throw errors, so nobody reviews it — but any servable PHP file is attack surface, and any configuration file is a candidate for leaking credentials.

**What I did**: delete the whole folder. If it's ever needed again, it's in the git history.

## 4. Build artifacts and zips inside the repository

The `dist/` folder (the compiled output) was checked into git, along with a `dist.zip` and a `src.zip`. Three copies of the project, each with its own dependency versions and potentially secrets already "deleted" from the source code.

**What I did**: `git rm -r --cached dist/`, delete the zips, and make sure `.gitignore` excludes them. Deployment should generate the build, not read it from the repository.

## 5. jQuery 1.12 and an audit that surprised me

jQuery 1.12 has known vulnerabilities and no longer receives patches. The obvious reaction is "remove it," but first you need to know who actually uses it. The audit gave a curious result: out of all the code, **only the template script (`core.js`) and the form validation** depended on jQuery. The Vue components didn't.

Once the contact section was removed (point 2), the only remaining use was in `core.js`, which got replaced by Vue behavior during the migration. The lesson: before auditing or replacing a dependency, measure its actual usage; it's often smaller than it looks.

## A checklist for your next legacy project

If you're picking up an old frontend, this review fits in an afternoon:

| What to look for | How | What to do |
| --- | --- | --- |
| Keys and tokens in the code | `git log -p` and search for `key=`, `token`, `secret` | Rotate and restrict |
| Server scripts (PHP, CGI) | List deployed executable files | Delete the ones that aren't used |
| Integrations with closed APIs | Check `api/`, `lib/`, `vendor/` folders | Delete |
| Committed artifacts | `dist/`, `build/`, `*.zip` in `git ls-files` | Remove from git |
| Outdated dependencies | `npm audit` plus the actual `import` statements | Replace only what's really used |

## Frequently asked questions

### Do I really need to rotate a key I already deleted from the code?

Yes. In a public repository, anyone can recover the previous version of the file with `git log -p`. Even in private repositories, clones and forks retain history.

### How do I know if an old PHP file is still reachable?

If it's inside the hosting's public folder (`public_html` or equivalent), it's reachable by URL even if nothing links to it. Delete it or move it outside the public folder.

### Is `npm audit` useful for a 2016 project?

It's useful as an inventory, but it will produce hundreds of warnings, many for dependencies that aren't even used. Prioritize the ones actually imported in the code and the ones that run on the server.

## Conclusion

None of these five problems required migrating the project to fix. They were addressed before touching Vue, in a separate branch, with small commits. Starting with security makes the later migration simpler, because there's less code to move, and it guarantees the effort is worthwhile even if the project stalls halfway through.
