# Arabic RTL Requirements
## متطلبات دعم اللغة العربية واتجاه النص

**Document:** REQ-003
**Status:** Draft
**Last Updated:** 2026-05-29

---

## Overview

Arabic RTL (Right-to-Left) support is a core platform requirement, not a cosmetic feature. This document defines technical and design requirements for delivering a native Arabic experience.

---

## Layout Requirements

| ID | Requirement |
|---|---|
| RTL-01 | Default layout direction is RTL for Arabic locale |
| RTL-02 | All UI components must mirror correctly in RTL (navigation, cards, tables, forms) |
| RTL-03 | Icons with directional meaning must flip (e.g., back/forward arrows) |
| RTL-04 | Charts and graphs must render with RTL axis orientation |
| RTL-05 | Language toggle persists across sessions (stored in user profile) |

---

## Typography Requirements

| ID | Requirement |
|---|---|
| RTL-06 | Arabic font: IBM Plex Arabic or Noto Kufi Arabic (pending design approval) |
| RTL-07 | Arabic font size: minimum 14px body, 18px headings |
| RTL-08 | Line height for Arabic: 1.8 (Arabic script requires more vertical space) |
| RTL-09 | No italic styling for Arabic text (italic degrades readability in Arabic) |
| RTL-10 | Number formatting: Arabic-Indic numerals optional (configurable per user) |

---

## Content Requirements

| ID | Requirement |
|---|---|
| RTL-11 | All UI labels, navigation items, and button text translated to Arabic |
| RTL-12 | Dashboard module names bilingual: English title + Arabic subtitle |
| RTL-13 | AI-generated content must be in user's language preference |
| RTL-14 | Date format: DD/MM/YYYY for Arabic; Hijri calendar display optional |
| RTL-15 | Currency: Saudi Riyal (SAR) with Arabic symbol (ر.س) support |

---

## Technical Implementation

| ID | Requirement |
|---|---|
| RTL-16 | Use `dir="rtl"` on `<html>` for Arabic locale |
| RTL-17 | CSS logical properties (margin-inline-start vs margin-left) throughout |
| RTL-18 | Tailwind CSS RTL plugin or equivalent framework support |
| RTL-19 | i18n library: `react-i18next` or `vue-i18n` with Arabic locale files |
| RTL-20 | All string literals externalized — no hardcoded Arabic/English in components |

---

## Testing Requirements

| ID | Requirement |
|---|---|
| RTL-21 | RTL layout tested on Chrome, Safari, and Firefox |
| RTL-22 | RTL layout tested on iPad (tablet) at minimum |
| RTL-23 | Native Arabic speaker review before each major release |
| RTL-24 | Automated visual regression tests for RTL layouts |
