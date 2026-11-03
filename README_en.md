# Shenzhen Elderly Park Guide

> 语言 / Language: [中文版](README.md)

A WeChat mini program for older adults in Shenzhen, bringing together park information and age-friendly reference data to help users find parks, learn about facilities, and plan visits.

## Try the Mini Program

Scan the QR code below with WeChat to open the Shenzhen Elderly Park Guide mini program.

![QR code for the Shenzhen Elderly Park Guide mini program](attachment/qr-code.jpg)

## Overview

The project currently lists **27 parks** across Futian, Nanshan, Luohu, Bao'an, Yantian, Longgang, Longhua, and Pingshan districts. Users can search by park name or district and view park locations, feature tags, ratings, and related travel information.

## Features

- **Park list and search:** Browse park cards with cover images, names, ratings, and districts; search by park name or district keyword.
- **Tag filters:** Filter by features such as accessibility, level paths, seating, shade, and exercise facilities. When multiple tags are selected, results must match all selected tags.
- **Nearby map:** View your current location and park markers. Select a park to open its details or start map navigation. Location access must be enabled to use this feature.
- **Park details:** View photos, feature tags, a five-dimension radar chart, and an overall rating on a five-point scale. Details also include the park and a nearby medical service point, with navigation links; the medical point includes a call option.
- **Photo viewer:** View park photos full-screen, swipe between them, or use the on-screen previous/next buttons. The viewer shows the current photo index and supports vertical scrolling for tall images.

## Ratings

The project data includes five dimension scores (each 0–100), a weighted overall score, and an overall rating on a five-point scale for each park. These values are provided as built-in data; the mini program does not calculate them from user input or live measurements at runtime.

The detail page assigns a grade based on the percentage equivalent of the five-point rating:

| Rating percentage | Grade | Color |
| --- | --- | --- |
| ≥ 85% | Excellent | Light green `#67c23a` |
| ≥ 70% and < 85% | Good | Dark green `#2e8b57` |
| ≥ 55% and < 70% | Fair | Orange `#ff7d00` |
| < 55% | Needs improvement | Yellow `#e6a23c` |

The radar chart shows these five dimensions:

| Dimension | Description |
| --- | --- |
| Accessibility | Ease of access via barrier-free paths and ramps |
| Safety & Risk | On-site safety facilities and potential risks |
| Exercise Facilities | Exercise equipment and walking paths |
| Environmental Comfort | Shade, greenery, seating, and other comfort factors |
| Transport Convenience | Access by metro, bus, and other public transport |

> Park facilities, ratings, addresses, and medical point information are built-in reference data and may change. Verify current information before visiting. Ratings are for reference only and are not official assessments.