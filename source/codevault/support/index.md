---
title: Code Vault Support
layout: page
permalink: /CodeVault/support/
---

# Code Vault Support

Code Vault is a local-first snippet and clipboard launcher for macOS 15.7 or later.

## Before you write in

1. Confirm macOS is 15.7 or later.
2. Restart Code Vault from the menu bar or Applications folder. If a secret cannot be saved, unlock your Mac login Keychain and try again; Code Vault blocks secret saving rather than storing plaintext.
3. If text cannot be inserted into another app, open **System Settings › Privacy & Security › Accessibility** and allow Code Vault.
4. If a global hotkey does not respond, check whether another app registered the same combination. If Code Vault asks for Input Monitoring, grant it for the event-tap fallback; the normal Carbon path does not need it.
5. If a backup restored from another Mac shows encrypted key values, restore it on the Mac that created the backup; the local encryption key remains in that Mac’s Keychain.
6. If sync is unavailable, check the service address, API token, network connection, and service status.

## What to include

- macOS version and Code Vault version.
- Whether the issue happens in offline mode.
- Exact action, expected result, and actual result.
- A screenshot or short screen recording that excludes secrets.
- The text of any error message.

Do not send API tokens, real credentials, or sensitive clipboard content.

## Support channel

Submit and track public support issues at:

`https://github.com/pekaboo/pekaboo.github.io/issues`

Please prefix the issue title with `[Code Vault]` so support requests are easy to separate from website issues. Security reports should use that repository's private security advisory feature if available; otherwise create a normal issue without secret values.

## Data to remove before sharing logs

- API tokens
- passwords, keys, and personal identifiers
- client code or private clipboard contents

## Service boundaries

Code Vault support covers the Mac app and its documentation. A self-hosted sync service is supported by its operator. Billing and App Store download problems are handled by Apple using the report-a-problem flow.
