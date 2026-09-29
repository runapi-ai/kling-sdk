# Changelog

## [js/v0.4.0](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.4.0), [ruby/v0.4.0](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.4.0), [go/v0.4.0](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.4.0), [python/v0.4.0](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.4.0) - 2026-09-29

### Changed
- Require output_resolution for kling-3.0 motion_control, matching the API, which rejects requests that omit it.
  Migration: Pass output_resolution (720p or 1080p) explicitly on kling-3.0 motion_control requests.
- Reject enable_sound without pro mode for kling-v2.6 text-to-video and image-to-video through generated contract rules, matching the API.
  Migration: Set mode to pro when enabling sound on kling-v2.6.
- Record the server default duration, resolution, and sound settings of Kling text-to-video and image-to-video models in generated contract metadata.
- Enforce the kling-v2.6 sound-mode rule only through the generated contract rules; the rejection and its message are unchanged.

## [java/v0.2.1](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.2.1) - 2026-09-29

### Changed
- Require output_resolution for kling-3.0 motion_control, matching the API, which rejects requests that omit it.
  Migration: Pass output_resolution (720p or 1080p) explicitly on kling-3.0 motion_control requests.
- Reject enable_sound without pro mode for kling-v2.6 text-to-video and image-to-video through generated contract rules, matching the API.
  Migration: Set mode to pro when enabling sound on kling-v2.6.
- Record the server default duration, resolution, and sound settings of Kling text-to-video and image-to-video models in generated contract metadata.
- Reject enable_sound without pro mode for kling-v2.6 text-to-video and image-to-video through the generated contract rules, reporting the generated contract rule message (for example "enable_sound must be one of: false when mode is std and model is kling-v2.6") instead of "enable_sound requires mode pro for kling-v2.6".
  Migration: Match on ValidationException rather than the old message text; set mode to pro when enabling sound on kling-v2.6.


## [js/v0.3.6](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.6), [ruby/v0.3.6](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.6), [go/v0.3.6](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.6), [python/v0.3.6](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.6) - 2026-09-28

### Added
- Return usage.cost as a float USD amount on completed async Task query and webhook envelopes.

### Changed
- Synchronize generated Kling request validation rule ordering with the canonical contract.

### Removed
- Remove the public Task billing object from Task envelopes.
  Migration: Read usage.cost on completed Task envelopes. Create, processing, and failed envelopes omit usage.


## [js/v0.3.5](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.5), [ruby/v0.3.5](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.5), [go/v0.3.5](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.5), [python/v0.3.5](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.5) - 2026-09-16

### Changed
- Refresh generated contract projections after the shared catalog contract export.


## [js/v0.3.4](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.4), [ruby/v0.3.4](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.4), [go/v0.3.4](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.4), [python/v0.3.4](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.4) - 2026-09-11

### Changed
- Normalize generated contract rule ordering across supported SDK languages.


## [js/v0.3.3](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.3), [ruby/v0.3.3](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.3), [go/v0.3.3](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.3), [python/v0.3.3](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.3) - 2026-09-09

### Changed
- Synchronize generated input validation metadata.
- Normalize generated contract rule ordering across supported SDK languages.


## [js/v0.3.2](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.2), [ruby/v0.3.2](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.2), [go/v0.3.2](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.2), [python/v0.3.2](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.2) - 2026-09-07

### Changed
- Regenerate equivalent edit-video validation rules in canonical contract order without changing accepted requests.


## [js/v0.3.1](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.1), [ruby/v0.3.1](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.1), [go/v0.3.1](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.1), [python/v0.3.1](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.1) - 2026-09-04

### Changed
- Refresh generated contract metadata for hybrid terminal and 202 Task API responses.
- Add length limits for prompt, lyrics, style, title and range limits for style_weight, weirdness_constraint, audio_weight across Suno endpoints.


## [js/v0.3.0](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.3.0), [ruby/v0.3.0](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.3.0), [go/v0.3.0](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.3.0), [python/v0.3.0](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.3.0), [java/v0.2.0](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.2.0) - 2026-08-21

### Added
- Add typed text-to-video and edit-video resources for Kling V3 Omni workflows.


## [ruby/v0.2.14](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.14) - 2026-08-18

### Changed
- Allow Ruby clients to install the core SDK release that adds persistent Files and multipart Uploads alongside this model SDK.


## [python/v0.2.2](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.2.2) - 2026-07-29

### Fixed
- Point package documentation metadata to the current RunAPI Developer Docs.


## [go/v0.2.13](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.13) - 2026-07-28

### Added
- Expose persisted billing facts on task responses.
- Add Kling O1 text-to-video and image-to-video fields for ordered image references, video references, reference roles, and audio preservation.
- Validate reference markers, media extensions, image counts, video dependencies, sound restrictions, and base-video frame conflicts before submission.

## [js/v0.2.13](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.13) - 2026-07-28

### Added
- Type task billing facts on task responses.
- Add Kling O1 text-to-video and image-to-video fields for ordered image references, video references, reference roles, and audio preservation.
- Validate reference markers, media extensions, image counts, video dependencies, sound restrictions, and base-video frame conflicts before submission.

## [ruby/v0.2.13](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.13) - 2026-07-28

### Added
- Expose live pricing through the shared core SDK.
- Add Kling O1 text-to-video and image-to-video fields for ordered image references, video references, reference roles, and audio preservation.
- Validate reference markers, media extensions, image counts, video dependencies, sound restrictions, and base-video frame conflicts before submission.

## [python/v0.2.1](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.2.1), [java/v0.1.6](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.6) - 2026-07-28

### Added
- Add Kling O1 text-to-video and image-to-video fields for ordered image references, video references, reference roles, and audio preservation.
- Validate reference markers, media extensions, image counts, video dependencies, sound restrictions, and base-video frame conflicts before submission.


## [python/v0.2.0](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.2.0) - 2026-07-24

### Added
- Expose shared Files, Account, and Pricing resources plus typed Task Billing Facts through the Provider Client.


## [js/v0.2.12](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.12), [ruby/v0.2.12](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.12), [go/v0.2.12](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.12), [python/v0.1.4](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.1.4), [java/v0.1.5](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.5) - 2026-07-23

### Added
- Add Kling 2.6 motion-control models, required request fields, and model-specific background validation across supported SDKs.


## [js/v0.2.11](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.11), [ruby/v0.2.11](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.11), [go/v0.2.11](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.11), [python/v0.1.3](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.1.3), [java/v0.1.4](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.4) - 2026-07-23

### Added
- Add Kling V3 Omni text-to-video and image-to-video requests with 720p, 1080p, and 4K output resolution, optional sound, and final-frame validation.
- Add SDK support for continuing completed Kling v2.5 Turbo videos.


## [js/v0.2.10](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.10), [ruby/v0.2.10](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.10), [go/v0.2.10](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.10), [python/v0.1.2](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.1.2), [java/v0.1.3](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.3) - 2026-07-22

### Added
- Add Kling 2.6 text-to-video and image-to-video requests with Standard/Pro modes, optional sound, and final-frame validation.


## [js/v0.2.9](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.9), [ruby/v0.2.9](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.9), [go/v0.2.9](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.9), [python/v0.1.1](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.1.1), [java/v0.1.2](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.2) - 2026-07-16

### Changed
- Add create helpers and typed params for Kling V3 Turbo text-to-video and image-to-video.
- Include contract validation for duration, aspect ratio, output resolution, and first-frame image inputs.
- Refresh Kling SDK docs with links to the new catalog variants.

## [java/v0.1.1](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.1) - 2026-06-25

### Fixed
- Fixed Java retry handling for Retry-After response headers.
- Fixed Java contract validation for action-level conditional rules.
- Refreshed Java SDK metadata for v0.1.1.

## [java/v0.1.0](https://github.com/runapi-ai/kling-sdk/releases/tag/java%2Fv0.1.0) - 2026-06-24

### Added
- Publish `ai.runapi:runapi-kling` for Java SDK consumers.
- Include typed Java builders, synchronous client resources, sources, and Javadocs.

## [js/v0.2.8](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.8), [ruby/v0.2.8](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.8), [go/v0.2.8](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.8), [python/v0.1.0](https://github.com/runapi-ai/kling-sdk/releases/tag/python%2Fv0.1.0) - 2026-06-18

### Changed
- Per-method documentation for all resource methods

## [js/v0.2.7](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.7), [ruby/v0.2.7](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.7), [go/v0.2.7](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.7) - 2026-06-01

### Changed
- Align SDK with upstream Input Contract and public API vocabulary changes
- Update endpoint definitions and field constraints

## [js/v0.2.4](https://github.com/runapi-ai/kling-sdk/releases/tag/js%2Fv0.2.4), [ruby/v0.2.4](https://github.com/runapi-ai/kling-sdk/releases/tag/ruby%2Fv0.2.4), [go/v0.2.4](https://github.com/runapi-ai/kling-sdk/releases/tag/go%2Fv0.2.4) - 2026-05-22

### Changed
- Publish JavaScript, Ruby, and Go SDK artifacts for kling with per-language GitHub release tags.
- Refresh public README metadata.

## [v0.2.1](https://github.com/runapi-ai/kling-sdk/releases/tag/v0.2.1) - 2026-05-19

Initial release.
