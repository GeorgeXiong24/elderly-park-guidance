[中文](./README.md)

# Shenzhen Elderly Park Guide

A WeChat mini program designed for elderly residents in Shenzhen, providing park guidance, age-friendly ratings, and travel assistance to help seniors quickly find green spaces suitable for leisure, exercise, and socializing.

## Overview

The "Shenzhen Elderly Park Guide" brings together basic information on **22 major parks** in Shenzhen, offering a unified guidance entry point built around the actual needs of the elderly (accessible pathways, resting benches, shaded facilities, fitness equipment, quiet walking paths, and more).

The mini program is centered on age-friendly design: larger fonts, high-contrast colors, and a simple interaction flow, so elderly users can get started without any learning curve. It currently covers Futian, Nanshan, Luohu, Bao'an, Yantian, Longgang, Longhua, and Pingshan districts.

## Core Features

### Park List & Search
- Displays all parks in a card grid, showing cover image, name, rating, and district.
- Supports real-time search by park name or district keyword.

### Tag Filtering
- Provides filter tags such as "All Parks / Accessible Pathways / Ample Seating / Shaded Pavilions / Senior Fitness Equipment / Quiet Walking".
- One-tap switching to quickly locate parks matching specific needs.

### Park Details
- Multi-angle photo carousel to understand the park's environment and facilities at a glance.
- Shows a 5.0-point comprehensive rating with a grade badge.
- Summarizes core features with concise tags (e.g., "ample seats | accessible-friendly | suitable for walking").

### Image Preview
- Tap a photo to open a full-screen preview for a high-resolution view.
- Supports two navigation modes: swipe left/right and arrow buttons (`‹` / `›`).
- Shows the current index / total at the bottom; long images support vertical scrolling.

### Age-Friendly Five-Dimension Radar Chart
- Visualizes the park's age-friendliness across 5 dimensions at a glance.
- Tap a dimension below to highlight its score on the chart and view the exact value.

### About Us
- Introduces the project's positioning and goals, helping new users quickly understand its value.

## Rating System

The comprehensive rating is derived from the **weighted total score** of each park's age-friendly five-dimension evaluation, converted to a **5.0-point scale** (1 decimal place). It is also divided into four grades based on the rating percentage, each distinguished by a different color:

| Rating Percentage | Grade | Color |
| --- | --- | --- |
| ≥ 85% | Excellent | Light green `#67c23a` |
| 70% – 84% | Good | Dark green `#2e8b57` |
| 55% – 69% | Fair | Orange `#ff7d00` |
| < 55% | Needs improvement | Yellow `#e6a23c` |

## Age-Friendly Five-Dimension Evaluation

The radar chart evaluates a park's age-friendliness across the following 5 dimensions (each scored 0–100):

| Dimension | Description |
| --- | --- |
| Accessibility | Ease of access via ramps and barrier-free pathways |
| Safety & Risk | On-site safety facilities and potential risks |
| Exercise Facilities | Completeness of fitness equipment and trails |
| Environmental Comfort | Comfort from shade, greenery, and resting seats |
| Transport Convenience | Accessibility by metro and bus |

## Included Parks

| Park Name | District | Rating /5 |
| --- | --- | --- |
| Shenzhen Bay Park | Futian / Nanshan | 4.1 |
| Wutong Mountain Scenic Area | Luohu / Yantian / Longgang | 2.8 |
| Lianhua Mountain Park | Futian | 4.0 |
| Fairy Lake Botanical Garden | Luohu | 3.2 |
| Bijia Mountain Sports Park | Futian | 4.2 |
| Garden Expo Park | Futian | 3.7 |
| Shenzhen Talent Park | Nanshan | 3.9 |
| Dasha River Park | Nanshan | 4.0 |
| Dameisha Seaside Park | Yantian | 3.5 |
| Bao'an Binhai Cultural Park | Bao'an | 3.9 |
| Donghu Park | Luohu | 3.7 |
| Honghu Park | Luohu | 3.6 |
| Yangtai Mountain Forest Park | Bao'an / Longhua / Nanshan | 3.1 |
| Fenghuang Mountain Forest Park | Bao'an | 3.0 |
| Shenzhen Central Park | Futian | 3.9 |
| Maluan Mountain Country Park | Pingshan | 2.6 |
| Tanglang Mountain Country Park | Nanshan | 3.1 |
| Yanhan Mountain Park | Nanshan | 2.8 |
| Xiwan Mangrove Park | Bao'an | 3.2 |
| Lizhi Park | Futian | 3.6 |
| Bao'an Park | Bao'an | 3.6 |
| Julong Mountain Park | Pingshan | 4.1 |

## Background

As Shenzhen's population ages, the elderly's demand for outdoor activity venues continues to grow. However, park information is often scattered across multiple channels and rarely organized around the actual needs of the elderly. When choosing activity venues, seniors often face inconvenience due to the lack of age-friendly information.

This project helps seniors conveniently and clearly find parks that suit them by gathering age-friendly information on major parks in Shenzhen.

## Roadmap

- Precise geolocation and map display
- Public transport guidance and one-tap navigation
- Scientific exercise duration and intensity suggestions
- Park peak crowd time alerts
- More age-friendly information dimensions
