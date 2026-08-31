# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two distinct audiences share one interface, at very different skill levels.

**The setup user** is technical — a developer or bucket owner who already has an AWS account. They perform the one-time configuration: paste an IAM access key ID and secret, name a region and bucket, choose a 4-digit vault PIN, and optionally run the one-click CORS setup. This person understands what a region and a bucket are.

**The day-to-day user** may not be technical at all. They are handed access and use the explorer to upload, download, organize, and delete files. They never open the AWS Console and are not expected to understand IAM. For them the credential setup screen is a one-time hurdle a technical person walks them through.

Design and copy must serve both without patronizing the first or stranding the second.

## Product Purpose

A web interface for managing AWS S3 buckets and objects, built as an alternative to the AWS Console for people who find the Console slow and cluttered.

This is a real product seeking users, not a portfolio piece or a personal tool. Success means people outside the author's circle sign up, connect their own buckets, and return. That target raises the bar on trust, reliability, onboarding, and security relative to a showcase project.

## Positioning

Bring-your-own-bucket with no credential custody. AWS keys are encrypted in the browser (AES-256-GCM, PBKDF2-derived from the user's PIN) before they ever reach the server; the database stores only ciphertext, the salt, and the plaintext region and bucket name. Identity (Clerk) and bucket access (the vault) are deliberately separate systems — signing in does not by itself grant access to the user's files.

The product holds no user data. Files stay in the user's own S3 bucket, under their own AWS account and billing.

## Operating Context

Users arrive with an existing AWS account and IAM credentials they have created themselves. The product never provisions AWS resources.

Core workflows:

- **First run:** sign in via Clerk, complete credential setup (AWS key pair, region, bucket, 4-digit PIN), which encrypts the keys locally and auto-configures bucket CORS.
- **Each session:** the vault is locked on a fresh tab. A full-screen PIN prompt decrypts the keys in-browser; the PIN is cached in `sessionStorage` so reloads within the tab unlock silently. Closing the tab or signing out re-locks it.
- **Daily use:** browse the bucket root, expand folders inline, upload files, download files, delete files, create folders. Bucket name and region are displayed for orientation.
- **Maintenance:** re-run CORS setup or replace stored credentials from the nav.

Deployed on Vercel; Neon Postgres via Drizzle; Clerk for authentication. The decrypted AWS keys travel to the server as request headers on each S3 operation, where a per-request `S3Client` is constructed and discarded.

## Capabilities and Constraints

**Confirmed capabilities:** bucket browsing with inline recursive folder expansion; file upload via presigned PUT (browser to S3 directly, multiple files at once); file download via presigned GET (browser from S3 directly, 5-minute URL expiry); file delete; folder creation; recursive folder size calculation; one-click bucket CORS configuration; credential replacement.

**Known limits of the current build:**

- One bucket and one region per user account.
- Browsing is root-anchored: folders expand in place, with no path navigation, breadcrumbs, or "current directory" concept.
- No multi-select, rename, move, copy, search, or sort.
- No file preview — every file downloads rather than opening.
- Upload is single-part presigned PUT: works to 5 GB, but offers no progress percentage, no resume, and a failed transfer restarts from zero.
- Download progress and cancellation live in the browser's download manager, not in the app.
- No error tracking or observability. A failure for a user surfaces nowhere.
- No automated tests.

**Terminology used in the product:** *vault* (the encrypted credential store), *PIN* (the 4-digit key that unlocks it), *bucket*, *folder* (an S3 key prefix, not a real directory).

**Open decisions — do not resolve these by assumption:**

- *Security positioning.* The site, README, and metadata currently claim "enterprise-grade security", "military-grade AES-256", and "zero-trust architecture". The encryption is implemented correctly, but the 4-digit PIN gives a 10,000-value keyspace that is brute-forceable offline by anyone holding a database dump, and the decrypted keys pass through the server in plaintext headers on every request. Whether to strengthen the credential derivation to match the claims, revise the claims to match the implementation, or both is undecided as of 2026-08-31. Future work must not quietly pick a side.
- A generated migration dropping the unused `is_active` column exists at `lib/db/migrations/0004_mean_tarot.sql` but has not been applied to the database.

## Brand Commitments

- **Name:** S3 Buddy.
- **Logo:** `public/images/S3.png`.
- **Domain:** `s3buddy.vercel.app`.
- **Source:** `github.com/asimar007/S3-Web-UI`, public. Author: Asim SK.
- **Voice:** direct and slightly irreverent about the incumbent — the established line is "Stop wrestling with the AWS Console's clunky interface." Positions against the AWS Console explicitly rather than naming competing products.

The security superlatives listed above are *not* confirmed brand commitments; see the open decision in Capabilities and Constraints.

## Evidence on Hand

- Live deployment at `s3buddy.vercel.app`.
- README with product screenshots: `public/images/Home.png` (landing), `public/images/file-explorer.png` (dashboard).
- Social preview image: `public/images/meta.png`.
- Public source repository.

**Absent — must not be fabricated by future work:** no testimonials, named customers, user counts, uptime figures, benchmarks, press coverage, case studies, pricing, or third-party security review exists. The product has no confirmed users yet.

## Product Principles

1. **Two skill levels, one interface.** Setup may assume AWS literacy; everything after it must not.
2. **The user's data stays the user's.** Files never leave their bucket and account; the product is a lens, not a host. Losing access to S3 Buddy must never mean losing access to their files.
3. **No plaintext credentials at rest.** Encryption happens in the browser before storage, and the database never holds a usable key.
4. **Claims must survive inspection.** Real users are the target, so anything asserted about security or capability has to be true under scrutiny, not just persuasive.
5. **Positioned against the Console, not against other tools.** The competitor is the friction of the incumbent interface.
