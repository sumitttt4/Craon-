# Craon Video Editor Feature Status

## Working
Features that are implemented and usable.

- **Local Video Selection**
  - Component: `VideoEditor.tsx` (`fileInputRef`, `handleFiles`)
  - Current Behavior: Selects local video files via native file picker.
  - Remaining Issue: None.
  - Priority: Critical

- **Drag-and-Drop Media Import**
  - Component: `VideoEditor.tsx` (`handleMediaDrop`, `ingestFiles`)
  - Current Behavior: Dragging local files onto the editor area imports accepted videos.
  - Remaining Issue: None.
  - Priority: Critical

- **Multi-File Selection & Import Validation**
  - Component: `VideoEditor.tsx` (`ingestFiles`)
  - Current Behavior: Enforces max 15 files, 1 GB file size limit, and supported `video/*` MIME formats.
  - Remaining Issue: None.
  - Priority: Critical

- **Local Preview URL Creation & Cleanup**
  - Component: `VideoEditor.tsx` (`objectUrlsRef`, `URL.createObjectURL`, `URL.revokeObjectURL`)
  - Current Behavior: Instant browser-local video object URLs created and revoked upon asset deletion or unmount.
  - Remaining Issue: None.
  - Priority: Critical

- **Asset Deletion**
  - Component: `VideoEditor.tsx` (`removeAsset`, `Dialog.Root` delete confirmation)
  - Current Behavior: Confirmation modal pops up, removes asset, clears object URL, and cleans dependent timeline clips.
  - Remaining Issue: None.
  - Priority: Critical

- **Asset Search & Grid/List Toggle**
  - Component: `VideoEditor.tsx` (`assetSearch`, `assetView`)
  - Current Behavior: Instant case-insensitive filtering of imported assets; toggles between grid and list views.
  - Remaining Issue: None.
  - Priority: Important

- **Asset Library Cards**
  - Component: `VideoEditor.tsx` (`AssetCard`)
  - Current Behavior: Renders video metadata preview, filename, duration, ready status badge, and context menu.
  - Remaining Issue: None.
  - Priority: Critical

- **Video Preview Controls**
  - Component: `VideoEditor.tsx` (`videoRef`, `togglePlayback`, `viewerOverlay`)
  - Current Behavior: Play/pause, frame stepping, volume slider, mute toggle, Fit/Original sizing, and browser fullscreen mode.
  - Remaining Issue: None.
  - Priority: Critical

- **Add to Timeline Flow**
  - Component: `VideoEditor.tsx` (`addAssetToTimeline`, drag-and-drop on timeline)
  - Current Behavior: Appends asset clip to timeline sequence, updates total duration, and moves playhead.
  - Remaining Issue: None.
  - Priority: Critical

- **Clip Selection & Deletion**
  - Component: `VideoEditor.tsx` (`deleteSelectedClip`, `Delete` key handler)
  - Current Behavior: Clicking selects clip; pressing Delete/Backspace key or clicking trash button removes selected clip.
  - Remaining Issue: None.
  - Priority: Critical

- **Split Selected Clip at Playhead**
  - Component: `VideoEditor.tsx` (`splitClipAtPlayhead`, Split button, 'S' key shortcut)
  - Current Behavior: Cuts the active or selected timeline clip at playhead time into 2 distinct clips, selects the new right clip, and pushes history state.
  - Remaining Issue: None.
  - Priority: Critical

- **Undo / Redo Timeline History Stack**
  - Component: `VideoEditor.tsx` (`historyRef`, `historyIndexRef`, `pushHistory`, `handleUndo`, `handleRedo`, Ctrl+Z / Ctrl+Y shortcuts)
  - Current Behavior: Full stack history tracking across all clip additions, deletions, reorders, splits, and duplicates. Topbar buttons dynamically enable/disable based on history position.
  - Remaining Issue: None.
  - Priority: Critical

- **Duplicate Selected Clip**
  - Component: `VideoEditor.tsx` (`duplicateSelectedClip`, Ctrl+D shortcut)
  - Current Behavior: Duplicates the selected clip right after its current position in the sequence and pushes state to history.
  - Remaining Issue: None.
  - Priority: Important

- **Timeline Playhead Synchronization**
  - Component: `VideoEditor.tsx` (`playhead`, `activeClipInfo`, `videoRef.currentTime`)
  - Current Behavior: Playhead position syncs smoothly with HTML5 `<video>` current time and active clip sequence.
  - Remaining Issue: None.
  - Priority: Critical

- **Clip Reordering**
  - Component: `VideoEditor.tsx` (`reorderClip`, HTML5 Drag & Drop on timeline clips)
  - Current Behavior: Dragging a clip over another swaps sequence order cleanly.
  - Remaining Issue: None.
  - Priority: Critical

- **Timeline Zoom & Ruler**
  - Component: `VideoEditor.tsx` (`zoom`, `zoomPercent`, `timelineCanvas`, `ruler`)
  - Current Behavior: Zoom slider adjusts pixel scale per second from 65% to 200% with live tabular numeric percentage badge.
  - Remaining Issue: None.
  - Priority: Important

- **AI Edit Composer**
  - Component: `VideoEditor.tsx` (`PromptComposer`, `AiWorkspace`, suggestion chips)
  - Current Behavior: Prompts populate composer, simulated processing feedback runs, and timeline clips highlight with AI edit glow.
  - Remaining Issue: None.
  - Priority: Critical

- **Transcript Navigation**
  - Component: `VideoEditor.tsx` (`TranscriptPanel`, `TRANSCRIPT`)
  - Current Behavior: Renders timestamped lines, highlights active sentence during playback, searches text, and seeks playhead on click.
  - Remaining Issue: None.
  - Priority: Important

- **Export Configuration Modal**
  - Component: `VideoEditor.tsx` (`Dialog.Content` export modal)
  - Current Behavior: Configures filename, format (MP4/WebM/MOV), resolution, frame rate, aspect ratio, simulated progress bar, and local prototype disclaimer.
  - Remaining Issue: None.
  - Priority: Critical

- **Workspace Resizing & Collapse Mechanics**
  - Component: `VideoEditor.tsx` (`ResizablePanelGroup`, `PanelImperativeHandle`)
  - Current Behavior: Imperative panel collapse for AI sidebar, resizable split panels with strict `minSize` boundaries.
  - Remaining Issue: None.
  - Priority: Critical


## Partial
Features that exist visually or technically but are incomplete.

- **Asset Sorting / Filtering**
  - Component: `VideoEditor.tsx` (`filteredAssets`)
  - Current Behavior: Text search filter works cleanly. Explicit sort options dropdown (by name, date, duration) is missing.
  - Remaining Issue: Add explicit sort menu option in media library header.
  - Priority: Optional

- **Transcript Text Editing**
  - Component: `VideoEditor.tsx` (`TranscriptPanel`)
  - Current Behavior: Displays transcript lines and highlights active playhead sentence. Clicking line seeks playhead.
  - Remaining Issue: Inline text editing for transcript sentences is not interactive.
  - Priority: Optional


## Mocked
Features that only simulate a result.

- **AI Prompt Processing**
  - Component: `VideoEditor.tsx` (`submitPrompt`)
  - Current Behavior: Simulates 1.15s processing delay and highlights affected clips in timeline (`aiAffected`).
  - Remaining Issue: Expected prototype behavior (no real backend AI required).
  - Priority: Optional

- **Video Render Export**
  - Component: `VideoEditor.tsx` (`startExport`)
  - Current Behavior: Simulates percentage progress counter and local preview ready state.
  - Remaining Issue: Expected prototype behavior (no FFmpeg/wasm rendering required).
  - Priority: Optional


## Missing
Important basic features not yet present.

- None (all core basic video editing features are fully implemented or mocked per prototype scope).
