---
title: Code Vault Privacy Policy
layout: page
permalink: /CodeVault/privacy/
---

# Code Vault Privacy Policy

**Last updated:** 2026-09-25
**Product:** Code Vault for macOS

Code Vault is local-first. It works without an account or network connection. This policy describes what the app stores, transmits, and does not do.

## Summary

- Code Vault does not contain third-party analytics or advertising SDKs.
- Code Vault does not track you across apps or websites.
- Snippet and clipboard data stays on the Mac by default.
- Optional sync sends your snippet library to the sync service you select.
- The sync API token is stored in the macOS Keychain and is never written to plain-text preferences.
- Clipboard history and local backups are not uploaded by Code Vault.

## Data stored on your Mac

| Data | Purpose | Location |
| --- | --- | --- |
| Snippets, titles, tags, notes, and timestamps | Provide the local snippet library | SwiftData store in the app container |
| Clipboard history, source-app metadata, and thumbnails | Provide local clipboard search and reuse | SwiftData store and caches in the app container |
| Preferences, hotkeys, theme, language, and retention settings | Remember your setup | UserDefaults in the app container |
| Sync server URL and last successful sync time | Connect to your selected service | UserDefaults in the app container |
| Sync API token | Authenticate optional sync | macOS Keychain |
| Local key-encryption key | Protect key-type snippet fields on this Mac | macOS Keychain |
| Local backups and diagnostic files | Restore data or investigate a problem you report | Application Support in the app container |
| Unified logging metadata | Diagnose operation and failures | Apple unified logging |

Key-type snippet fields are encrypted locally with a per-install key before they are written to the snippet store. The encryption key is stored separately in the macOS Keychain. A local backup containing key-type snippets is therefore intended for restore on the same Mac installation; copying it to another Mac does not also copy that Keychain key. If Code Vault cannot access or create the Keychain key, it blocks saving or exporting new secret fields instead of writing them as plaintext. Sensitive or transient clipboard markers are respected when sensitive-data filtering is enabled.

## Data transmitted outside your Mac

### Optional snippet sync

Sync is off until you enter a service address and API token. When enabled, Code Vault sends the snippet fields needed for synchronization: title, type, language, content, notes, tags, UUID, creation/update timestamps, and deletion state. This includes the API token in the HTTP Authorization header.

You can use the official service or a self-hosted service. If you use a self-hosted service, that service operator controls server-side retention and security.

Deleting a snippet creates a short-lived local tombstone so a deleted item is not restored during a later sync. Signing out stops sync and deletes the API token from this Mac; it does not automatically delete data already stored by the sync service.

### Link previews

For a clipboard URL, Code Vault can request the linked page directly to display its title, description, site name, or image. Only the resulting metadata is stored locally. Code Vault does not send your clipboard history to a preview service.

### Network failure information

Code Vault contacts the selected sync service to verify a token and synchronize. It does not send crash or usage reports to a developer-controlled analytics service.

## Apple privacy disclosure

For App Store privacy labeling, Code Vault reports:

- **Data linked to you:** Other user content, for app functionality, when optional sync is enabled.
- **Tracking:** None.
- **Tracking domains:** None.

Clipboard history, local backups, preferences, and local diagnostics are not uploaded by Code Vault.

## Data controls and retention

- Disable clipboard history or change retention in Settings.
- Clear clipboard history from the Clipboard module.
- Delete individual snippets or key entries.
- Create or delete local backups from System settings.
- Sign out to stop sync and remove the API token from this Mac.
- Uninstalling Code Vault removes the app container, including local data not explicitly stored elsewhere.

Server-side deletion depends on the selected sync service. The official service must provide a way to revoke the API token and request account/data deletion; a self-hosted operator controls equivalent server-side policy.

## Children

Code Vault is not directed to children and does not knowingly collect personal information from children.

## Contact

Use the [Code Vault support page](/CodeVault/support/) or the support URL listed on the App Store product page.

## Changes

If this policy changes, the published policy will show a new last-updated date before a new App Store version is submitted.
