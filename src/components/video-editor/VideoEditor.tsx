'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  ArrowUpLeft01Icon,
  ArrowUpRight01Icon,
  AudioWaveformIcon,
  BellIcon,
  Cancel01Icon,
  Clock01Icon,
  Copy01Icon,
  Cursor01Icon,
  Delete02Icon,
  Download01Icon,
  DragDropIcon,
  EyeIcon,
  Film01Icon,
  Folder01Icon,
  FullScreenIcon,
  GridViewIcon,
  HelpCircleIcon,
  Image01Icon,
  Layers01Icon,
  ListViewIcon,
  Loading03Icon,
  Magnet01Icon,
  Message01Icon,
  Mic01Icon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PauseIcon,
  PencilEdit01Icon,
  PlayIcon,
  Rotate01Icon,
  ScissorIcon,
  Search01Icon,
  SearchMinusIcon,
  SentIcon,
  Settings01Icon,
  Share01Icon,
  SidebarLeftIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  SplitIcon,
  TextIcon,
  Tick02Icon,
  Unlink01Icon,
  Upload01Icon,
  Video01Icon,
  ViewOffIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
  VolumeOffIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from '@hugeicons/core-free-icons';
import { Button as ShadcnButton } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { PanelImperativeHandle } from 'react-resizable-panels';
import {
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './VideoEditor.module.css';

type HugeIconProps = { size?: number; className?: string };

function makeHugeIcon(icon: typeof BellIcon) {
  return function EditorHugeIcon({ size = 16, className }: HugeIconProps) {
    return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
  };
}

const Bell = makeHugeIcon(BellIcon);
const ChevronDown = makeHugeIcon(ArrowDown01Icon);
const ArrowUp = makeHugeIcon(ArrowUp01Icon);
const CaretLeft = makeHugeIcon(ArrowLeft01Icon);
const ChevronRight = makeHugeIcon(ArrowRight01Icon);
const MessageCircle = makeHugeIcon(Message01Icon);
const Check = makeHugeIcon(Tick02Icon);
const Loader2 = makeHugeIcon(Loading03Icon);
const History = makeHugeIcon(Clock01Icon);
const Copy = makeHugeIcon(Copy01Icon);
const Maximize2 = makeHugeIcon(FullScreenIcon);
const Cursor = makeHugeIcon(Cursor01Icon);
const GripVertical = makeHugeIcon(DragDropIcon);
const MoreHorizontal = makeHugeIcon(MoreHorizontalIcon);
const MoreVertical = makeHugeIcon(MoreVerticalIcon);
const Download = makeHugeIcon(Download01Icon);
const Pencil = makeHugeIcon(PencilEdit01Icon);
const Eye = makeHugeIcon(EyeIcon);
const EyeSlash = makeHugeIcon(ViewOffIcon);
const Film = makeHugeIcon(Film01Icon);
const FolderOpen = makeHugeIcon(Folder01Icon);
const Grid2X2 = makeHugeIcon(GridViewIcon);
const ImageIcon = makeHugeIcon(Image01Icon);
const Search = makeHugeIcon(Search01Icon);
const ZoomOut = makeHugeIcon(ZoomOutAreaIcon);
const ZoomIn = makeHugeIcon(ZoomInAreaIcon);
const Microphone = makeHugeIcon(Mic01Icon);
const List = makeHugeIcon(ListViewIcon);
const Send = makeHugeIcon(SentIcon);
const Pause = makeHugeIcon(PauseIcon);
const Play = makeHugeIcon(PlayIcon);
const Plus = makeHugeIcon(Add01Icon);
const CircleHelp = makeHugeIcon(HelpCircleIcon);
const Redo2 = makeHugeIcon(ArrowUpRight01Icon);
const RotateCcw = makeHugeIcon(Rotate01Icon);
const Share2 = makeHugeIcon(Share01Icon);
const PanelLeft = makeHugeIcon(SidebarLeftIcon);
const SkipBack = makeHugeIcon(ArrowLeft02Icon);
const SkipForward = makeHugeIcon(ArrowRight02Icon);
const Settings2 = makeHugeIcon(Settings01Icon);
const SlidersHorizontal = makeHugeIcon(SlidersHorizontalIcon);
const Sparkles = makeHugeIcon(SparklesIcon);
const Volume2 = makeHugeIcon(VolumeHighIcon);
const VolumeX = makeHugeIcon(VolumeMute01Icon);
const SpeakerSimpleX = makeHugeIcon(VolumeOffIcon);
const Trash2 = makeHugeIcon(Delete02Icon);
const Undo2 = makeHugeIcon(ArrowUpLeft01Icon);
const Upload = makeHugeIcon(Upload01Icon);
const Music2 = makeHugeIcon(AudioWaveformIcon);
const X = makeHugeIcon(Cancel01Icon);

type AssetStatus = 'Ready' | 'Reading file' | 'Generating preview' | 'Extracting audio';

type EditorAsset = {
  id: string;
  name: string;
  url: string;
  duration: number;
  status: AssetStatus;
  objectUrl?: boolean;
};

type TimelineClip = {
  id: string;
  assetId: string;
  duration: number;
};

type TranscriptLine = {
  id: string;
  time: number;
  speaker: string;
  text: string;
};

const STARTER_ACTIONS = [
  { title: 'Talking Head Editing', copy: 'Remove pauses and tighten delivery' },
  { title: 'Motion Graphics', copy: 'Add clean animated emphasis' },
  { title: 'Long Video to Shorts', copy: 'Find and format the strongest moments' },
  { title: 'Product / App Promo', copy: 'Build a fast, polished product story' },
  { title: 'AI Short Film', copy: 'Shape a cinematic narrative' },
  { title: 'Explainer Video', copy: 'Clarify structure and pacing' },
];

type EditorGlyphName =
  | 'recipe'
  | 'subtitles'
  | 'dialogue'
  | 'grade'
  | 'callout'
  | 'trim'
  | 'split'
  | 'snapping'
  | 'captions'
  | 'detach'
  | 'ripple';

function EditorGlyph({
  name,
  size = 16,
  className,
}: {
  name: EditorGlyphName;
  size?: number;
  className?: string;
}) {
  const icons = {
    recipe: Layers01Icon,
    subtitles: TextIcon,
    dialogue: AudioWaveformIcon,
    grade: SlidersHorizontalIcon,
    callout: Cursor01Icon,
    trim: ScissorIcon,
    split: SplitIcon,
    snapping: Magnet01Icon,
    captions: TextIcon,
    detach: Unlink01Icon,
    ripple: Delete02Icon,
  } satisfies Record<EditorGlyphName, typeof BellIcon>;

  return <HugeiconsIcon icon={icons[name]} size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}

const TRANSCRIPT: TranscriptLine[] = [
  {
    id: 'line-1',
    time: 0,
    speaker: 'Speaker 1',
    text: 'The first cut is never the final idea. It is where the rhythm starts to become visible.',
  },
  {
    id: 'line-2',
    time: 5.6,
    speaker: 'Speaker 1',
    text: 'Craon removes the friction between an edit in your head and the sequence on screen.',
  },
  {
    id: 'line-3',
    time: 11.8,
    speaker: 'Speaker 1',
    text: 'Describe the feeling, tighten the pacing, and let every frame carry the story forward.',
  },
  {
    id: 'line-4',
    time: 18.7,
    speaker: 'Speaker 1',
    text: 'Dynamic subtitles, balanced audio, and cinematic color arrive as one connected edit.',
  },
  {
    id: 'line-5',
    time: 26.2,
    speaker: 'Speaker 1',
    text: 'You stay in control while the busy work disappears.',
  },
];

const WAVEFORM = [
  18, 44, 29, 72, 38, 58, 83, 30, 67, 46, 76, 28, 55, 88, 35, 64, 48, 79, 24, 62,
  42, 71, 32, 86, 52, 66, 27, 74, 40, 59, 82, 34, 68, 45, 77, 25, 61, 50, 84, 36,
];

function formatTime(value: number) {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  const frames = Math.floor((safe % 1) * 30);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

function compactDuration(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function IconButton({
  label,
  children,
  active = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: {
  label: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type={type}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={`${styles.iconButton} ${active ? styles.iconButtonActive : ''} ${className}`}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} side="top" sideOffset={7}>
          {label}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function getAiEditSummary(command: string) {
  const lower = command.toLowerCase();
  if (lower.includes('pause') || lower.includes('silence') || lower.includes('gap')) {
    return {
      title: 'Silence removal & delivery pacing applied',
      subtitle: 'Timeline sequence tightened',
      stats: [
        { label: 'Removed', value: '4 silent gaps' },
        { label: 'Saved', value: '1.4 seconds' },
        { label: 'Pacing', value: 'Tightened speech cadence' },
      ],
    };
  }
  if (lower.includes('subtitle') || lower.includes('caption') || lower.includes('text')) {
    return {
      title: 'Word-perfect subtitles generated',
      subtitle: 'Timeline captions created and synced',
      stats: [
        { label: 'Created', value: '26 animated subtitles' },
        { label: 'Font', value: 'Geist Sans · Medium' },
        { label: 'Sync', value: 'Word-perfect speech timing' },
      ],
    };
  }
  if (lower.includes('short') || lower.includes('vertical') || lower.includes('reel') || lower.includes('tiktok')) {
    return {
      title: 'Short highlight sequence created',
      subtitle: '9:16 vertical focus and key moments',
      stats: [
        { label: 'Extracted', value: '3 key highlight clips' },
        { label: 'Format', value: '9:16 Vertical crop' },
        { label: 'Duration', value: '28s short sequence' },
      ],
    };
  }
  if (lower.includes('audio') || lower.includes('sound') || lower.includes('noise') || lower.includes('voice')) {
    return {
      title: 'Audio enhancement & noise cleanup',
      subtitle: 'Dialogue track enhanced',
      stats: [
        { label: 'Cleaned', value: 'Background hum & reverb' },
        { label: 'Leveled', value: 'Speech volume & EQ' },
        { label: 'Quality', value: 'Enhanced audio track' },
      ],
    };
  }
  return {
    title: 'AI video edit complete',
    subtitle: 'Timeline changes applied in context',
    stats: [
      { label: 'Action', value: command.length > 24 ? `${command.slice(0, 22)}...` : command },
      { label: 'Sequence', value: 'Timeline clips updated' },
      { label: 'Status', value: 'Highlighted on timeline' },
    ],
  };
}

export default function VideoEditor() {
  const [assets, setAssets] = useState<EditorAsset[]>([]);
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedClipId, setSelectedClipId] = useState('');
  const [activeTab, setActiveTab] = useState<'assets' | 'library' | 'transcript'>('assets');
  const [assetView, setAssetView] = useState<'grid' | 'list'>('grid');
  const [assetSearch, setAssetSearch] = useState('');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [projectName, setProjectName] = useState('Untitled video');
  const [fitMode, setFitMode] = useState<'fit' | 'original'>('fit');
  const [helpOpen, setHelpOpen] = useState(false);
  const [volume, setVolume] = useState(0.82);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!assets.length && activeTab === 'transcript') setActiveTab('assets');
  }, [activeTab, assets.length]);
  const [playhead, setPlayhead] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [videoLoading, setVideoLoading] = useState(false);
  const [draggingMedia, setDraggingMedia] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aiState, setAiState] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [lastCommand, setLastCommand] = useState('');
  const [aiAffected, setAiAffected] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [pendingDeleteAssetId, setPendingDeleteAssetId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [toast, setToast] = useState('');
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [assetsDrawerOpen, setAssetsDrawerOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [editorEnabled, setEditorEnabled] = useState(true);
  const [videoTrackVisible, setVideoTrackVisible] = useState(true);
  const [timelineDropActive, setTimelineDropActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const aiPanelRef = useRef<PanelImperativeHandle>(null);
  const processingTimersRef = useRef<number[]>([]);
  const historyRef = useRef<TimelineClip[][]>([[]]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((newClips: TimelineClip[]) => {
    const stack = historyRef.current.slice(0, historyIndexRef.current + 1);
    stack.push(newClips);
    historyRef.current = stack;
    historyIndexRef.current = stack.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      announce('Nothing to undo');
      return;
    }
    historyIndexRef.current -= 1;
    const prevClips = historyRef.current[historyIndexRef.current];
    setClips(prevClips);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    announce('Last edit undone');
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      announce('Nothing to redo');
      return;
    }
    historyIndexRef.current += 1;
    const nextClips = historyRef.current[historyIndexRef.current];
    setClips(nextClips);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    announce('Edit restored');
  }, []);

  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectChip = useCallback((chipText: string) => {
    setPrompt(chipText);
    window.setTimeout(() => {
      composerTextareaRef.current?.focus();
    }, 10);
  }, []);

  const toggleAiCollapse = useCallback(() => {
    const panel = aiPanelRef.current;
    if (!panel) {
      setAiCollapsed((prev) => !prev);
      return;
    }
    if (panel.isCollapsed()) {
      panel.expand();
    } else {
      panel.collapse();
    }
  }, []);
  const playingRef = useRef(false);
  const lastFrameRef = useRef(0);

  const projectDuration = useMemo(
    () => clips.reduce((total, clip) => total + clip.duration, 0),
    [clips],
  );

  const clipStarts = useMemo(() => {
    let cursor = 0;
    return clips.map((clip) => {
      const start = cursor;
      cursor += clip.duration;
      return { clip, start, end: cursor };
    });
  }, [clips]);

  const activeClipInfo = useMemo(
    () =>
      clipStarts.find(({ start, end }) => playhead >= start && playhead < end) ??
      clipStarts[clipStarts.length - 1],
    [clipStarts, playhead],
  );

  const activeAsset =
    assets.find((asset) => asset.id === activeClipInfo?.clip.assetId) ??
    assets.find((asset) => asset.id === selectedAssetId) ??
    assets[0];

  const playbackDuration = projectDuration || activeAsset?.duration || 0;
  const pendingDeleteAsset = assets.find((asset) => asset.id === pendingDeleteAssetId);

  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        asset.name.toLocaleLowerCase().includes(assetSearch.trim().toLocaleLowerCase()),
      ),
    [assetSearch, assets],
  );

  const filteredTranscript = useMemo(
    () =>
      TRANSCRIPT.filter((line) =>
        line.text.toLocaleLowerCase().includes(transcriptSearch.trim().toLocaleLowerCase()),
      ),
    [transcriptSearch],
  );

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [activeAsset?.id, volume]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2300);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!playing || playbackDuration <= 0) return;
    let frame = 0;
    const tick = (time: number) => {
      if (!playingRef.current) return;
      if (!lastFrameRef.current) lastFrameRef.current = time;
      const delta = Math.min((time - lastFrameRef.current) / 1000, 0.1);
      lastFrameRef.current = time;
      setPlayhead((current) => {
        const next = current + delta;
        if (next >= playbackDuration) {
          playingRef.current = false;
          window.setTimeout(() => setPlaying(false), 0);
          return 0;
        }
        return next;
      });
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      lastFrameRef.current = 0;
    };
  }, [playbackDuration, playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeAsset) return;
    const localTime = activeClipInfo ? Math.max(0, playhead - activeClipInfo.start) : playhead;
    if (Math.abs(video.currentTime - localTime) > 0.45 && video.readyState >= 1) {
      video.currentTime = Math.min(localTime, Math.max(0, video.duration || localTime));
    }
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [activeAsset, activeClipInfo, playhead, playing]);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    const timers = processingTimersRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const announce = useCallback((message: string) => setToast(message), []);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || !activeAsset) {
      announce('Add media to preview playback');
      return;
    }
    const nextPlaying = !playingRef.current;
    playingRef.current = nextPlaying;
    setPlaying(nextPlaying);
    if (nextPlaying) {
      void video.play().catch(() => {
        playingRef.current = false;
        setPlaying(false);
        announce('The browser could not start this preview');
      });
    } else {
      video.pause();
    }
  }, [activeAsset, announce]);

  const chooseFiles = () => fileInputRef.current?.click();

  const updateAssetStatus = useCallback((assetId: string, status: AssetStatus) => {
    setAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, status } : asset)),
    );
  }, []);

  const updateAssetDuration = useCallback((assetId: string, duration: number) => {
    if (!Number.isFinite(duration) || duration <= 0) return false;
    setAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, duration } : asset)),
    );
    return true;
  }, []);

  const scheduleProcessing = useCallback(
    (assetId: string) => {
      const stages: Array<{ delay: number; status: AssetStatus }> = [
        { delay: 520, status: 'Generating preview' },
        { delay: 1180, status: 'Extracting audio' },
        { delay: 1600, status: 'Ready' },
      ];
      stages.forEach(({ delay, status }) => {
        const timer = window.setTimeout(() => {
          updateAssetStatus(assetId, status);
          if (status === 'Ready') {
            setAssets((currentAssets) => {
              const readyAsset = currentAssets.find((a) => a.id === assetId);
              if (readyAsset && readyAsset.duration > 0) {
                setClips((currentClips) => {
                  if (currentClips.some((c) => c.assetId === assetId)) return currentClips;
                  const newClip: TimelineClip = {
                    id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    assetId,
                    duration: readyAsset.duration,
                  };
                  const next = [...currentClips, newClip];
                  pushHistory(next);
                  return next;
                });
              }
              return currentAssets;
            });
          }
        }, delay);
        processingTimersRef.current.push(timer);
      });
    },
    [pushHistory, updateAssetStatus],
  );

  const ingestFiles = useCallback((incoming: File[]) => {
    setUploadError('');

    if (!incoming.length) return;
    if (assets.length + incoming.length > 15) {
      setUploadError('A project can contain up to 15 local video files.');
      return;
    }

    const accepted: EditorAsset[] = [];
    for (const file of incoming) {
      if (!file.type.startsWith('video/')) {
        setUploadError(`${file.name} is not a supported video file.`);
        continue;
      }
      if (file.size > 1024 * 1024 * 1024) {
        setUploadError(`${file.name} is larger than the 1 GB local limit.`);
        continue;
      }

      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      const id = `asset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      accepted.push({
        id,
        name: file.name,
        url,
        duration: 0,
        status: 'Reading file',
        objectUrl: true,
      });

      const metadataVideo = document.createElement('video');
      metadataVideo.preload = 'metadata';
      metadataVideo.src = url;
      const releaseMetadataVideo = () => {
        metadataVideo.onloadedmetadata = null;
        metadataVideo.ondurationchange = null;
        metadataVideo.oncanplay = null;
        metadataVideo.onerror = null;
        metadataVideo.removeAttribute('src');
        metadataVideo.load();
      };
      const readDuration = () => {
        if (!updateAssetDuration(id, metadataVideo.duration)) return false;
        releaseMetadataVideo();
        return true;
      };
      metadataVideo.onloadedmetadata = () => {
        if (!readDuration() && metadataVideo.duration === Infinity) {
          metadataVideo.currentTime = Number.MAX_SAFE_INTEGER;
        }
      };
      metadataVideo.ondurationchange = readDuration;
      metadataVideo.oncanplay = readDuration;
      metadataVideo.onerror = () => {
        setUploadError(`Craon could not read the duration of ${file.name}.`);
        releaseMetadataVideo();
      };
      metadataVideo.load();
      scheduleProcessing(id);
    }

    if (accepted.length) {
      setAssets((current) => [...current, ...accepted]);
      setSelectedAssetId(accepted[0].id);
      setVideoLoading(true);
      setActiveTab('assets');
      setProjectName((current) =>
        current === 'Untitled video' ? accepted[0].name.replace(/\.[^.]+$/, '') : current,
      );
      announce(`${accepted.length} ${accepted.length === 1 ? 'video' : 'videos'} added locally`);
    }
  }, [announce, assets.length, scheduleProcessing, updateAssetDuration]);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    ingestFiles(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleMediaDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDraggingMedia(false);
    ingestFiles(Array.from(event.dataTransfer.files ?? []));
  };

  const previewAssetFullscreen = useCallback((assetId: string) => {
    setSelectedAssetId(assetId);
    setVideoLoading(true);
    setPlayhead(0);
    setPlaying(true);

    window.setTimeout(() => {
      const video = videoRef.current;
      const stage = video?.parentElement;
      if (video?.requestFullscreen) {
        void video.requestFullscreen().catch(() => {
          if (stage?.requestFullscreen) void stage.requestFullscreen();
        });
      } else if (stage?.requestFullscreen) {
        void stage.requestFullscreen();
      }
    }, 50);
  }, []);

  const addAssetToTimeline = useCallback(
    (assetId: string) => {
      const asset = assets.find((item) => item.id === assetId);
      if (!asset) return;
      if (asset.status !== 'Ready') {
        announce('This clip is still preparing');
        return;
      }
      if (!Number.isFinite(asset.duration) || asset.duration <= 0) {
        announce('Craon is still reading this clip duration');
        return;
      }
      const clip: TimelineClip = {
        id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        assetId,
        duration: asset.duration,
      };
      setClips((current) => {
        const next = [...current, clip];
        pushHistory(next);
        return next;
      });
      setSelectedClipId(clip.id);
      setPlayhead(projectDuration);
      announce('Clip added to the timeline');
    },
    [announce, assets, projectDuration, pushHistory],
  );

  const removeAsset = (assetId: string) => {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) return;
    if (asset.objectUrl) URL.revokeObjectURL(asset.url);
    objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== asset.url);
    const remainingAssets = assets.filter((item) => item.id !== assetId);
    setAssets(remainingAssets);
    setClips((current) => {
      const next = current.filter((clip) => clip.assetId !== assetId);
      pushHistory(next);
      return next;
    });
    if (selectedAssetId === assetId) setSelectedAssetId(remainingAssets[0]?.id ?? '');
    announce('Local asset removed');
  };

  const deleteSelectedClip = useCallback(() => {
    if (!selectedClipId) return;
    setClips((current) => {
      const next = current.filter((clip) => clip.id !== selectedClipId);
      pushHistory(next);
      return next;
    });
    setSelectedClipId('');
    setPlayhead((current) => Math.min(current, Math.max(0, projectDuration - 0.1)));
    announce('Clip removed. Undo is available.');
  }, [announce, projectDuration, pushHistory, selectedClipId]);

  const splitClipAtPlayhead = useCallback(() => {
    if (!clips.length) {
      announce('Add clips to the timeline before splitting');
      return;
    }
    let target = clipStarts.find(({ start, end }) => playhead > start && playhead < end);
    if (!target && selectedClipId) {
      target = clipStarts.find(({ clip }) => clip.id === selectedClipId);
    }
    if (!target) {
      announce('Move playhead over a clip to split');
      return;
    }
    const { clip, start } = target;
    const splitTime = Math.max(0.2, Math.min(playhead - start, clip.duration - 0.2));
    if (splitTime <= 0.2 || splitTime >= clip.duration - 0.2) {
      announce('Playhead is too close to clip edge to split');
      return;
    }
    const leftClip: TimelineClip = {
      id: `clip-${Date.now()}-1`,
      assetId: clip.assetId,
      duration: Number(splitTime.toFixed(2)),
    };
    const rightClip: TimelineClip = {
      id: `clip-${Date.now()}-2`,
      assetId: clip.assetId,
      duration: Number((clip.duration - splitTime).toFixed(2)),
    };
    setClips((current) => {
      const index = current.findIndex((item) => item.id === clip.id);
      if (index < 0) return current;
      const next = [...current];
      next.splice(index, 1, leftClip, rightClip);
      pushHistory(next);
      return next;
    });
    setSelectedClipId(rightClip.id);
    announce('Clip split at playhead');
  }, [announce, clipStarts, clips.length, playhead, pushHistory, selectedClipId]);

  const duplicateSelectedClip = useCallback(() => {
    if (!selectedClipId) {
      announce('Select a clip to duplicate');
      return;
    }
    const target = clips.find((clip) => clip.id === selectedClipId);
    if (!target) return;
    const duplicate: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      assetId: target.assetId,
      duration: target.duration,
    };
    setClips((current) => {
      const index = current.findIndex((clip) => clip.id === selectedClipId);
      const next = [...current];
      next.splice(index + 1, 0, duplicate);
      pushHistory(next);
      return next;
    });
    setSelectedClipId(duplicate.id);
    announce('Clip duplicated');
  }, [announce, clips, pushHistory, selectedClipId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedClip();
      } else if (event.code === 'Space') {
        event.preventDefault();
        togglePlayback();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        handleRedo();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        duplicateSelectedClip();
      } else if (event.key.toLowerCase() === 's') {
        splitClipAtPlayhead();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteSelectedClip, duplicateSelectedClip, handleRedo, handleUndo, splitClipAtPlayhead, togglePlayback]);

  const reorderClip = (sourceId: string, targetId: string) => {
    if (!sourceId || sourceId === targetId) return;
    setClips((current) => {
      const sourceIndex = current.findIndex((clip) => clip.id === sourceId);
      const targetIndex = current.findIndex((clip) => clip.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      pushHistory(next);
      return next;
    });
    announce('Clip snapped into position');
  };

  const dropOnTimeline = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setTimelineDropActive(false);
    const assetId = event.dataTransfer.getData('application/craon-asset');
    if (assetId) addAssetToTimeline(assetId);
  };

  const seekTimeline = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || projectDuration <= 0) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const local = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    setPlayhead((local / rect.width) * projectDuration);
  };

  const submitPrompt = (value = prompt) => {
    const command = value.trim();
    if (!command || aiState === 'processing') return;
    setPrompt('');
    setLastCommand(command);
    setAiState('processing');
    setAiAffected([]);
    const timer = window.setTimeout(() => {
      setAiState('complete');
      setAiAffected(clips.map((clip) => clip.id));
      announce('AI edit connected to the timeline');
    }, 1150);
    processingTimersRef.current.push(timer);
  };

  const startExport = () => {
    setExporting(true);
    setExportProgress(8);
    const progress = [27, 48, 73, 100];
    progress.forEach((value, index) => {
      const timer = window.setTimeout(() => {
        setExportProgress(value);
        if (value === 100) {
          setExporting(false);
          announce('Export preview is ready');
        }
      }, 500 + index * 480);
      processingTimersRef.current.push(timer);
    });
  };

  const activeTranscriptId =
    [...TRANSCRIPT].reverse().find((line) => playhead >= line.time)?.id ?? TRANSCRIPT[0].id;

  const pxPerSecond = 42 * zoom;

  return (
    <Tooltip.Provider delayDuration={0} skipDelayDuration={0}>
      <main className={styles.editorRoot}>
        <div className={styles.mobileGate}>
          <Copy size={28} />
          <h1>Craon Editor is best experienced on desktop.</h1>
          <p>Open this workspace on a larger screen to edit footage, timelines, and AI instructions.</p>
        </div>

        <div className={styles.editorApp}>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
            multiple
            hidden
            onChange={handleFiles}
          />

          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <a href="/" className={styles.brand} aria-label="Return to Craon home">
                <Copy size={16} />
                <span>Craon</span>
              </a>
              <button
                type="button"
                className={styles.projectMenu}
                onClick={() => announce('Project menu opened')}
              >
                Project <ChevronDown size={11} />
              </button>
              <span className={styles.topDivider} />
              <IconButton label="Undo last change" disabled={!canUndo} onClick={handleUndo}>
                <Undo2 size={14} />
              </IconButton>
              <IconButton label="Redo change" disabled={!canRedo} onClick={handleRedo}>
                <Redo2 size={14} />
              </IconButton>
              <IconButton label="Version history" onClick={() => announce('Version history is ready')}>
                <History size={14} />
              </IconButton>
              <IconButton
                label={aiCollapsed ? 'Show AI panel' : 'Hide AI panel'}
                onClick={toggleAiCollapse}
                active={!aiCollapsed}
              >
                <PanelLeft size={14} />
              </IconButton>
            </div>

            <div className={styles.topbarCenter}>
              <label className={styles.projectNameWrap}>
                <span className={styles.srOnly}>Project name</span>
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  className={styles.projectName}
                />
                <IconButton label="Project settings" onClick={() => announce('Project settings opened')}>
                  <Settings2 size={13} />
                </IconButton>
              </label>
            </div>

            <div className={styles.topbarRight}>
              <IconButton label="Notifications" onClick={() => announce('You are all caught up')}>
                <Bell size={14} />
              </IconButton>
              <label className={styles.editorToggle}>
                <span>Editor</span>
                <input
                  type="checkbox"
                  checked={editorEnabled}
                  onChange={(event) => {
                    setEditorEnabled(event.target.checked);
                    announce(event.target.checked ? 'Editor controls enabled' : 'Editor controls hidden');
                  }}
                />
                <span className={styles.toggleTrack} />
              </label>
              <IconButton label="Comments" onClick={() => announce('Comments opened')}>
                <MessageCircle size={14} />
              </IconButton>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => announce('Private review link copied')}
              >
                <Share2 size={14} /> Share
              </button>
              <button type="button" className={styles.exportButton} onClick={() => setExportOpen(true)}>
                Export
              </button>
            </div>
          </header>

          <ResizablePanelGroup
            orientation="horizontal"
            className={`${styles.workspace} ${aiCollapsed ? styles.workspaceAiCollapsed : ''}`}
          >
            <ResizablePanel
              ref={aiPanelRef}
              collapsible
              collapsedSize={0}
              defaultSize="23%"
              minSize="15%"
              maxSize="35%"
              onResize={(panelSize) => setAiCollapsed(panelSize.asPercentage === 0)}
            >
              <aside className={`${styles.aiPanel} ${aiCollapsed ? styles.aiPanelCollapsed : ''}`}>
                <div className={styles.aiPanelContent}>
                  <AiWorkspace
                    aiState={aiState}
                    lastCommand={lastCommand}
                    prompt={prompt}
                    onSelectChip={handleSelectChip}
                    onKeep={() => {
                      setAiAffected([]);
                      announce('AI edit kept');
                    }}
                    onUndo={() => {
                      setAiState('idle');
                      setAiAffected([]);
                      announce('AI edit undone');
                    }}
                    onPreview={() => {
                      setPlayhead(0);
                      setPlaying(true);
                    }}
                    onCollapse={toggleAiCollapse}
                  />
                  <PromptComposer
                    prompt={prompt}
                    setPrompt={setPrompt}
                    textareaRef={composerTextareaRef}
                    processing={aiState === 'processing'}
                    onSubmit={() => submitPrompt()}
                    onAdd={chooseFiles}
                    onFeedback={announce}
                  />
                </div>
              </aside>
            </ResizablePanel>

            <ResizableHandle className={styles.resizeHandle} />

            <ResizablePanel defaultSize="77%" minSize="65%">
              <ResizablePanelGroup orientation="vertical" className={styles.rightWorkspace}>
                <ResizablePanel defaultSize="66%" minSize="45%">
                  <ResizablePanelGroup orientation="horizontal" className={styles.topWorkspace}>
                    <ResizablePanel defaultSize="34%" minSize="20%" maxSize="48%">
                      <section
                        className={`${styles.assetsPanel} ${assetsDrawerOpen ? styles.assetsDrawerOpen : ''}`}
                        onDragEnter={(event) => {
                          event.preventDefault();
                          setDraggingMedia(true);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget as Node)) setDraggingMedia(false);
                        }}
                        onDrop={handleMediaDrop}
                      >
                        <div className={styles.panelHeader}>
                          <div className={styles.tabs} role="tablist" aria-label="Media views">
                            {[
                              ['assets', 'My Assets'],
                              ['library', 'Library'],
                              ...(assets.length ? [['transcript', 'Transcript']] : []),
                            ].map(([value, label]) => (
                              <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === value}
                                className={activeTab === value ? styles.tabActive : ''}
                                onClick={() => setActiveTab(value as typeof activeTab)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {activeTab === 'transcript' ? (
                          <TranscriptPanel
                            query={transcriptSearch}
                            setQuery={setTranscriptSearch}
                            lines={filteredTranscript}
                            activeId={activeTranscriptId}
                            onSeek={(time) => {
                              setPlayhead(time);
                              announce(`Playhead moved to ${formatTime(time)}`);
                            }}
                          />
                        ) : activeTab === 'library' ? (
                          <LibraryPanel onUse={(promptValue) => submitPrompt(promptValue)} />
                        ) : (
                          <>
                            <div className={styles.assetTools}>
                              <label className={styles.searchField}>
                                <Search size={14} />
                                <input
                                  value={assetSearch}
                                  onChange={(event) => setAssetSearch(event.target.value)}
                                  placeholder="Search media"
                                />
                                {assetSearch && (
                                  <button
                                    type="button"
                                    className={styles.clearSearchButton}
                                    onClick={() => setAssetSearch('')}
                                    aria-label="Clear search"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </label>
                              <IconButton label="Import media" onClick={chooseFiles}>
                                <Upload size={14} />
                              </IconButton>
                              <IconButton label="New folder" onClick={() => announce('Folder created')}>
                                <FolderOpen size={14} />
                              </IconButton>
                              <div className={styles.viewToggleGroup}>
                                <button
                                  type="button"
                                  aria-label="Grid view"
                                  className={`${styles.viewToggleButton} ${assetView === 'grid' ? styles.viewToggleActive : ''}`}
                                  onClick={() => setAssetView('grid')}
                                >
                                  <Grid2X2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  aria-label="List view"
                                  className={`${styles.viewToggleButton} ${assetView === 'list' ? styles.viewToggleActive : ''}`}
                                  onClick={() => setAssetView('list')}
                                >
                                  <List size={14} />
                                </button>
                              </div>
                              <IconButton label="Filter assets" onClick={() => announce('Showing all videos')}>
                                <SlidersHorizontal size={14} />
                              </IconButton>
                            </div>

                            {uploadError && (
                              <div className={styles.inlineError} role="alert">
                                <CircleHelp size={14} />
                                <span>{uploadError}</span>
                                <IconButton label="Dismiss error" onClick={() => setUploadError('')}>
                                  <X size={13} />
                                </IconButton>
                              </div>
                            )}

                            <div className={`${styles.assetList} ${assetView === 'list' ? styles.assetListRows : ''} ${!assets.length ? styles.assetListEmpty : ''}`}>
                              {filteredAssets.map((asset) => (
                                <AssetCard
                                  key={asset.id}
                                  asset={asset}
                                  selected={selectedAssetId === asset.id}
                                  view={assetView}
                                  onSelect={() => {
                                    setSelectedAssetId(asset.id);
                                    setVideoLoading(true);
                                  }}
                                  onPreviewFullscreen={() => previewAssetFullscreen(asset.id)}
                                  onAdd={() => addAssetToTimeline(asset.id)}
                                  onRemove={() => setPendingDeleteAssetId(asset.id)}
                                />
                              ))}
                              {!assets.length ? (
                                <div
                                  className={`${styles.emptyAssetsState} ${draggingMedia ? styles.assetDropzoneDragOver : ''}`}
                                  onClick={chooseFiles}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <FolderOpen size={32} className={styles.emptyAssetsIcon} />
                                  <span className={styles.emptyAssetsTitle}>This bin is empty</span>
                                  <span className={styles.emptyAssetsSubtitle}>Import media or drag clips here.</span>
                                </div>
                              ) : !filteredAssets.length ? (
                                <div className={styles.emptyAssets}>
                                  <Search size={18} />
                                  <p>No media matches “{assetSearch}”</p>
                                </div>
                              ) : null}
                            </div>

                            {draggingMedia && (
                              <div className={styles.dropOverlay}>
                                <Upload size={22} />
                                <strong>Drop to add media</strong>
                              </div>
                            )}
                          </>
                        )}
                      </section>
                    </ResizablePanel>

                    <ResizableHandle className={styles.resizeHandle} />

                    <ResizablePanel defaultSize="66%" minSize="45%">
                      <section
                        className={`${styles.viewerPanel} ${draggingMedia ? styles.viewerPanelDragging : ''}`}
                        onDragEnter={(event) => {
                          event.preventDefault();
                          setDraggingMedia(true);
                        }}
                        onDragOver={(event) => event.preventDefault()}
                        onDragLeave={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget as Node)) setDraggingMedia(false);
                        }}
                        onDrop={handleMediaDrop}
                      >
                        <div className={styles.viewerToolbar}>
                          <div className={styles.viewerTitle}>
                            <span>Preview</span>
                            <small>{activeAsset ? '1920 × 1080' : ''}</small>
                          </div>
                          <button
                            type="button"
                            aria-label="Open clip attributes"
                            disabled={!activeAsset}
                            className={`${styles.attributeButton} ${inspectorOpen ? styles.attributeButtonActive : ''}`}
                            onClick={() => setInspectorOpen((current) => !current)}
                          >
                            <SlidersHorizontal size={13} /> Attributes
                          </button>
                        </div>

                        <div className={styles.viewerStage}>
                          {activeAsset ? (
                            <>
                              <video
                                ref={videoRef}
                                key={activeAsset.id}
                                src={activeAsset.url}
                                muted={muted}
                                playsInline
                                preload="auto"
                                onLoadStart={() => setVideoLoading(true)}
                                onLoadedMetadata={(event) => {
                                  setVideoLoading(false);
                                  updateAssetDuration(activeAsset.id, event.currentTarget.duration);
                                }}
                                onLoadedData={() => setVideoLoading(false)}
                                onCanPlay={() => setVideoLoading(false)}
                                onEnded={() => setPlaying(false)}
                                className={fitMode === 'fit' ? styles.videoFit : styles.videoOriginal}
                              />
                              {videoLoading && (
                                <div className={styles.viewerLoading}>
                                  <Loader2 size={19} />
                                  <span>Preparing preview</span>
                                </div>
                              )}

                              <div className={styles.viewerOverlay}>
                                <button
                                  type="button"
                                  className={styles.overlayModeButton}
                                  onClick={() => setFitMode((current) => (current === 'fit' ? 'original' : 'fit'))}
                                  aria-label="Toggle preview sizing"
                                >
                                  <ImageIcon size={14} />
                                  <span>{fitMode === 'fit' ? 'Fit' : 'Original'}</span>
                                </button>
                                <IconButton label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted((current) => !current)}>
                                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </IconButton>
                                <input
                                  aria-label="Preview volume"
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.01"
                                  value={muted ? 0 : volume}
                                  onChange={(event) => {
                                    setMuted(false);
                                    setVolume(Number(event.target.value));
                                  }}
                                  className={styles.overlayVolumeSlider}
                                />
                                <IconButton
                                  label="Fullscreen preview"
                                  onClick={() => {
                                    const stage = videoRef.current?.parentElement;
                                    if (stage?.requestFullscreen) void stage.requestFullscreen();
                                  }}
                                >
                                  <Maximize2 size={14} />
                                </IconButton>
                              </div>
                            </>
                          ) : (
                            <div className={styles.viewerEmptyState} onClick={chooseFiles} role="button" tabIndex={0}>
                              <div className={styles.viewerDropCard}>
                                <Upload size={22} className={styles.viewerDropIcon} />
                                <span>Upload media here</span>
                              </div>
                            </div>
                          )}

                          {inspectorOpen && activeAsset && (
                            <div className={styles.inspector}>
                              <div className={styles.inspectorHeader}>
                                <span>Clip attributes</span>
                                <IconButton label="Close attributes" onClick={() => setInspectorOpen(false)}>
                                  <X size={13} />
                                </IconButton>
                              </div>
                              <AttributeRow label="Position" value="0, 0" />
                              <AttributeRow label="Scale" value="100%" />
                              <AttributeRow label="Rotation" value="0°" />
                              <AttributeRow label="Opacity" value="100%" />
                              <button type="button" className={styles.resetAttributes} onClick={() => announce('Attributes reset')}>
                                <RotateCcw size={12} /> Reset
                              </button>
                            </div>
                          )}
                        </div>
                      </section>
                    </ResizablePanel>

                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle className={styles.resizeHandle} />

                <ResizablePanel defaultSize="32%" minSize="24%" maxSize="55%">
                  <section
                    className={`${styles.timelinePanel} ${timelineDropActive ? styles.timelineDropActive : ''}`}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setTimelineDropActive(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) setTimelineDropActive(false);
                    }}
                    onDrop={dropOnTimeline}
                  >
                    <div className={styles.timelineHeader}>
                      <div className={styles.timelineTools}>
                        <IconButton label="Add media" onClick={chooseFiles}><Plus size={15} /></IconButton>
                        <IconButton label="Selection tool" active><Cursor size={15} /></IconButton>
                        <IconButton label="Split clip" onClick={() => announce('Split tool ready at the playhead')}>
                          <EditorGlyph name="split" size={14} />
                        </IconButton>
                        <IconButton label="Snapping"><EditorGlyph name="snapping" size={14} /></IconButton>
                        <IconButton
                          label="Add subtitles"
                          onClick={() => submitPrompt('Add word-perfect subtitles to video')}
                        >
                          <EditorGlyph name="captions" size={14} />
                        </IconButton>
                        <IconButton label="Record voiceover"><Microphone size={15} /></IconButton>
                        <span className={styles.toolbarDivider} />
                        <span className={styles.clipCount}>{clips.length} {clips.length === 1 ? 'clip' : 'clips'}</span>
                        {aiAffected.length > 0 && <span className={styles.aiTimelineStatus}><Sparkles size={12} /> AI edit</span>}
                      </div>
                      <div className={styles.timelineTransport}>
                        <IconButton label="Previous frame" onClick={() => setPlayhead(Math.max(0, playhead - 1 / 30))}><SkipBack size={14} /></IconButton>
                        <IconButton label={playing ? 'Pause' : 'Play'} onClick={togglePlayback}>{playing ? <Pause size={15} /> : <Play size={15} />}</IconButton>
                        <IconButton label="Next frame" onClick={() => setPlayhead(Math.min(playbackDuration, playhead + 1 / 30))}><SkipForward size={14} /></IconButton>
                        <span className={styles.timecode}>{formatTime(playhead)} <i>/</i> {formatTime(playbackDuration)}</span>
                      </div>
                      <div className={styles.timelineActions}>
                        <IconButton label="Delete selected clip" disabled={!selectedClipId} onClick={deleteSelectedClip}>
                          <Trash2 size={14} />
                        </IconButton>
                        <span className={styles.toolbarDivider} />
                        <IconButton label="Zoom out" onClick={() => setZoom((current) => Math.max(0.65, current - 0.15))}>
                          <ZoomOut size={14} />
                        </IconButton>
                        <input
                          aria-label="Timeline zoom"
                          type="range"
                          min="0.65"
                          max="2"
                          step="0.05"
                          value={zoom}
                          onChange={(event) => setZoom(Number(event.target.value))}
                        />
                        <IconButton label="Zoom in" onClick={() => setZoom((current) => Math.min(2, current + 0.15))}>
                          <ZoomIn size={14} />
                        </IconButton>
                        <span className={styles.zoomPercent}>{Math.round(zoom * 100)}%</span>
                      </div>
                    </div>

                    <div className={styles.timelineBody}>
                      <div className={styles.trackLabels}>
                        <div className={styles.rulerSpacer} />
                        <TrackLabel
                          icon={<Film size={14} />}
                          label="Video 1"
                          kind="video"
                          enabled={videoTrackVisible}
                          onToggle={() => setVideoTrackVisible((current) => !current)}
                        />
                        <TrackLabel
                          icon={<Music2 size={14} />}
                          label="Audio 1"
                          kind="audio"
                          enabled={!muted}
                          onToggle={() => setMuted((current) => !current)}
                        />
                      </div>
                      <div className={styles.timelineScroll}>
                        <div
                          className={styles.timelineCanvas}
                          style={{
                            '--timeline-width': `${Math.max(1080, Math.max(90, projectDuration) * pxPerSecond + 120)}px`,
                            '--minor-grid': `${pxPerSecond}px`,
                            '--major-grid': `${pxPerSecond * 5}px`,
                          } as CSSProperties}
                        >
                          <TimelineRuler duration={Math.max(90, projectDuration)} pxPerSecond={pxPerSecond} />
                          <div
                            ref={timelineRef}
                            className={`${styles.videoTrack} ${videoTrackVisible ? '' : styles.trackDimmed}`}
                            onClick={seekTimeline}
                          >
                            {clipStarts.map(({ clip, start }) => {
                              const asset = assets.find((item) => item.id === clip.assetId);
                              return (
                                <TimelineClipCard
                                  key={clip.id}
                                  clip={clip}
                                  asset={asset}
                                  start={start}
                                  pxPerSecond={pxPerSecond}
                                  selected={selectedClipId === clip.id}
                                  active={activeClipInfo?.clip.id === clip.id}
                                  aiAffected={aiAffected.includes(clip.id)}
                                  onSelect={() => {
                                    setSelectedClipId(clip.id);
                                    if (asset) setSelectedAssetId(asset.id);
                                  }}
                                  onDropClip={(sourceId) => reorderClip(sourceId, clip.id)}
                                />
                              );
                            })}
                            {!clips.length && (
                              <span className={styles.timelineEmptyLabel}>Drag media here to start editing</span>
                            )}
                          </div>
                          <div className={`${styles.audioTrack} ${muted ? styles.trackDimmed : ''}`}>
                            {clipStarts.map(({ clip, start }) => (
                              <div
                                key={`audio-${clip.id}`}
                                className={`${styles.audioClip} ${aiAffected.includes(clip.id) ? styles.clipAiAffected : ''}`}
                                style={{
                                  left: `${start * pxPerSecond}px`,
                                  width: `${Math.max(74, clip.duration * pxPerSecond)}px`,
                                }}
                              >
                                <div className={styles.waveform} aria-hidden="true">
                                  {WAVEFORM.map((height, index) => (
                                    <span key={index} style={{ height: `${height}%` }} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {selectedClipId && <div className={styles.snappingGuide} aria-hidden="true" />}
                          <div
                            className={styles.playhead}
                            style={{ left: `${Math.min(playhead, projectDuration) * pxPerSecond}px` }}
                          >
                            <span />
                            <time>{formatTime(playhead)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>

          {aiDrawerOpen && (
            <div className={styles.drawerBackdrop} onMouseDown={() => setAiDrawerOpen(false)}>
              <aside className={styles.aiDrawer} onMouseDown={(event) => event.stopPropagation()}>
                <div className={styles.drawerTitle}>
                  <span><Sparkles size={15} /> Craon AI</span>
                  <IconButton label="Close AI assistant" onClick={() => setAiDrawerOpen(false)}>
                    <X size={15} />
                  </IconButton>
                </div>
                <AiWorkspace
                  aiState={aiState}
                  lastCommand={lastCommand}
                  prompt={prompt}
                  onSelectChip={handleSelectChip}
                  onKeep={() => {
                    setAiAffected([]);
                    setAiDrawerOpen(false);
                  }}
                  onUndo={() => {
                    setAiState('idle');
                    setAiAffected([]);
                  }}
                  onPreview={() => {
                    setPlayhead(0);
                    setPlaying(true);
                    setAiDrawerOpen(false);
                  }}
                />
                <PromptComposer
                  prompt={prompt}
                  setPrompt={setPrompt}
                  processing={aiState === 'processing'}
                  onSubmit={() => submitPrompt()}
                  onAdd={chooseFiles}
                  onFeedback={announce}
                />
              </aside>
            </div>
          )}

          <Dialog.Root
            open={exportOpen}
            onOpenChange={(open) => {
              if (!exporting) setExportOpen(open);
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay className={styles.modalBackdrop} />
              <Dialog.Content className={styles.exportModal} aria-describedby="export-description">
                <div className={styles.modalHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Delivery</span>
                    <Dialog.Title id="export-title" className={styles.dialogTitle}>Export video</Dialog.Title>
                  </div>
                  <IconButton label="Close export" disabled={exporting} onClick={() => setExportOpen(false)}>
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.5} />
                  </IconButton>
                </div>
                <div className={styles.exportPreview}>
                  <video src={activeAsset?.url} muted preload="metadata" />
                  <div>
                    <strong>{projectName}</strong>
                    <span>{formatTime(projectDuration)} · 16:9</span>
                  </div>
                </div>
                <div className={styles.exportOptions}>
                  <label>
                    <span>Format</span>
                    <select defaultValue="mp4">
                      <option value="mp4">MP4 · H.264</option>
                      <option value="mov">MOV · ProRes</option>
                      <option value="webm">WebM · VP9</option>
                    </select>
                  </label>
                  <label>
                    <span>Resolution</span>
                    <select defaultValue="1080">
                      <option value="1080">1080p</option>
                      <option value="2160">4K</option>
                      <option value="720">720p</option>
                    </select>
                  </label>
                  <label>
                    <span>Frame rate</span>
                    <select defaultValue="30">
                      <option value="30">30 fps</option>
                      <option value="24">24 fps</option>
                      <option value="60">60 fps</option>
                    </select>
                  </label>
                </div>
                {(exporting || exportProgress === 100) && (
                  <div className={styles.exportProgress}>
                    <div>
                      <span>{exportProgress === 100 ? 'Preview ready' : 'Preparing local export preview'}</span>
                      <strong>{exportProgress}%</strong>
                    </div>
                    <span className={styles.progressTrack}>
                      <i style={{ width: `${exportProgress}%` }} />
                    </span>
                  </div>
                )}
                <div className={styles.modalFooter}>
                  <span id="export-description">No files leave your device in this prototype.</span>
                  <ShadcnButton
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={exporting}
                    className={styles.exportConfirm}
                    onClick={startExport}
                  >
                    <HugeiconsIcon icon={Download01Icon} size={14} strokeWidth={1.5} />
                    {exporting ? 'Exporting' : exportProgress === 100 ? 'Ready' : 'Export preview'}
                  </ShadcnButton>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <Dialog.Root
            open={Boolean(pendingDeleteAsset)}
            onOpenChange={(open) => {
              if (!open) setPendingDeleteAssetId(null);
            }}
          >
            <Dialog.Portal>
              <Dialog.Overlay className={styles.modalBackdrop} />
              <Dialog.Content className={`${styles.exportModal} ${styles.deleteAssetModal}`}>
                <div className={styles.modalHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Media library</span>
                    <Dialog.Title className={styles.dialogTitle}>Delete asset?</Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className={styles.modalCloseButton}
                    aria-label="Close confirmation"
                    onClick={() => setPendingDeleteAssetId(null)}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={1.5} />
                  </button>
                </div>
                <Dialog.Description className={styles.deleteDescription}>
                  This will remove <strong>{pendingDeleteAsset?.name}</strong> and any timeline items
                  using it. This action cannot be undone.
                </Dialog.Description>
                <div className={`${styles.modalFooter} ${styles.deleteModalFooter}`}>
                  <ShadcnButton
                    type="button"
                    variant="outline"
                    size="sm"
                    className={styles.cancelDelete}
                    onClick={() => setPendingDeleteAssetId(null)}
                  >
                    Cancel
                  </ShadcnButton>
                  <ShadcnButton
                    type="button"
                    variant="default"
                    size="sm"
                    className={styles.confirmDelete}
                    onClick={() => {
                      if (pendingDeleteAssetId) removeAsset(pendingDeleteAssetId);
                      setPendingDeleteAssetId(null);
                    }}
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.5} />
                    Delete
                  </ShadcnButton>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          {toast && (
            <div className={styles.toast} role="status">
              <Check size={14} />
              {toast}
            </div>
          )}

          <div className={styles.helpDock}>
            {helpOpen && (
              <div className={styles.helpMenu} role="menu" aria-label="Help options">
                <button type="button" role="menuitem" onClick={() => { announce('Feedback form opened'); setHelpOpen(false); }}>
                  <MessageCircle size={15} />
                  Feedback
                </button>
                <button type="button" role="menuitem" onClick={() => { announce('Feature requests opened'); setHelpOpen(false); }}>
                  <CircleHelp size={15} />
                  Feature requests
                </button>
                <button type="button" role="menuitem" onClick={() => { announce('Contact support opened'); setHelpOpen(false); }}>
                  <Microphone size={15} />
                  Contact support
                </button>
              </div>
            )}
            <button
              type="button"
              className={styles.helpButton}
              aria-label="Editor help"
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen((current) => !current)}
            >
              <CircleHelp size={18} />
            </button>
          </div>
        </div>
      </main>
    </Tooltip.Provider>
  );
}

function AiWorkspace({
  aiState,
  lastCommand,
  prompt,
  onSelectChip,
  onKeep,
  onUndo,
  onPreview,
  onHistory,
}: {
  aiState: 'idle' | 'processing' | 'complete';
  lastCommand: string;
  prompt: string;
  onSelectChip: (text: string) => void;
  onKeep: () => void;
  onUndo: () => void;
  onPreview: () => void;
  onCollapse?: () => void;
  onHistory?: () => void;
}) {
  const showEmptyState = aiState === 'idle' && !prompt.trim();

  return (
    <div className={styles.aiWorkspace}>
      <div className={styles.aiHeader}>
        <div className={styles.aiHeaderTitle}>
          <span>AI</span>
        </div>
        <div className={styles.aiHeaderActions}>
          <IconButton label="Edit history" onClick={onHistory}>
            <History size={15} />
          </IconButton>
        </div>
      </div>

      <div className={styles.aiContentBody}>
        {showEmptyState && (
          <div className={styles.aiEmptyStateContainer}>
            <div className={styles.aiEmptyStateGroup}>
              <svg
                width="36"
                height="26"
                viewBox="0 0 36 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.waveformIllustration}
              >
                <rect x="0" y="8" width="2" height="10" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="4" y="4" width="2" height="18" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="8" y="10" width="2" height="6" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="12" y="2" width="2" height="22" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="16" y="12" width="4" height="2" rx="1" fill="var(--editor-accent)" />
                <rect x="22" y="3" width="2" height="20" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="26" y="9" width="2" height="8" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="30" y="6" width="2" height="14" rx="1" fill="rgba(255,255,255,0.34)" />
                <rect x="34" y="10" width="2" height="6" rx="1" fill="rgba(255,255,255,0.34)" />
              </svg>

              <h2 className={styles.aiEmptyHeading}>What are we editing today?</h2>
              <p className={styles.aiEmptyDescription}>
                Upload footage or describe the result you want.
              </p>

              <div className={styles.aiSuggestionChips}>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => onSelectChip('Remove pauses')}
                >
                  Remove pauses
                </button>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => onSelectChip('Add subtitles')}
                >
                  Add subtitles
                </button>
                <button
                  type="button"
                  className={styles.aiChip}
                  onClick={() => onSelectChip('Make a short')}
                >
                  Make a short
                </button>
              </div>
            </div>
          </div>
        )}

        {aiState === 'processing' && (
          <div className={styles.aiConversation}>
            <div className={styles.userMessage}>{lastCommand}</div>
            <div className={styles.aiProcessing}>
              <span className={styles.processingIcon}><Loader2 size={15} /></span>
              <div>
                <strong>Craon is shaping the edit</strong>
                <span>Reading pacing, dialogue, and shot changes</span>
              </div>
            </div>
          </div>
        )}

        {aiState === 'complete' && (() => {
          const summary = getAiEditSummary(lastCommand);
          return (
            <div className={styles.aiConversation}>
              <div className={styles.userMessage}>{lastCommand}</div>
              <div className={styles.aiResult}>
                <div className={styles.resultTitle}>
                  <span><Check size={14} /></span>
                  <div>
                    <strong>{summary.title}</strong>
                    <small>{summary.subtitle}</small>
                  </div>
                </div>
                <ul>
                  {summary.stats.map((s, i) => (
                    <li key={i}>
                      <span>{s.label}</span>
                      <strong>{s.value}</strong>
                    </li>
                  ))}
                </ul>
                <div className={styles.resultActions}>
                  <button type="button" onClick={onPreview}><Play size={12} /> Preview changes</button>
                  <button type="button" onClick={onKeep}><Check size={12} /> Keep</button>
                  <button type="button" onClick={onUndo}><Undo2 size={12} /> Undo</button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function PromptComposer({
  prompt,
  setPrompt,
  textareaRef,
  processing,
  onSubmit,
  onAdd,
  onFeedback,
}: {
  prompt: string;
  setPrompt: (value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  processing: boolean;
  onSubmit: () => void;
  onAdd: () => void;
  onFeedback: (value: string) => void;
}) {
  const [mode, setMode] = useState<'Edit' | 'Ask' | 'Plan'>('Edit');
  const [modeOpen, setModeOpen] = useState(false);
  const [modePos, setModePos] = useState<{ top: number; left: number } | null>(null);
  const modeBtnRef = useRef<HTMLButtonElement>(null);

  const toggleModeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!modeOpen && modeBtnRef.current) {
      const rect = modeBtnRef.current.getBoundingClientRect();
      const menuWidth = 140;
      const left = Math.max(10, Math.min(window.innerWidth - menuWidth - 12, rect.left));
      const top = Math.max(10, rect.top - 125);
      setModePos({ top, left });
    }
    setModeOpen((prev) => !prev);
  };

  const handleSelectMode = (selectedMode: 'Edit' | 'Ask' | 'Plan') => {
    setMode(selectedMode);
    setModeOpen(false);
    onFeedback(`Mode set to ${selectedMode}`);
  };

  return (
    <form
      className={styles.composerCard}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label>
        <span className={styles.srOnly}>Describe to Craon how you want your edit</span>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Describe to Craon how you want your edit"
          rows={3}
        />
      </label>
      <div className={styles.composerBottomBar}>
        <div className={styles.composerLeftControls}>
          <button
            type="button"
            ref={modeBtnRef}
            className={styles.composerModeBtn}
            onClick={toggleModeMenu}
          >
            {mode === 'Edit' && <Pencil size={13} className={styles.modeIcon} />}
            {mode === 'Ask' && <Sparkles size={13} className={styles.modeIcon} />}
            {mode === 'Plan' && <EditorGlyph name="recipe" size={13} className={styles.modeIcon} />}
            <span>{mode}</span>
            <ChevronDown size={11} />
          </button>
          <IconButton label="Add media here" onClick={onAdd}>
            <ImageIcon size={15} />
          </IconButton>
          <IconButton label="Edit parameters" onClick={() => onFeedback('Parameters panel ready')}>
            <SlidersHorizontal size={15} />
          </IconButton>
          <IconButton label="Edit recipes" onClick={() => onFeedback('Recipes library ready')}>
            <EditorGlyph name="recipe" size={15} />
          </IconButton>
        </div>
        <div className={styles.composerRightControls}>
          <button
            type="submit"
            aria-label={processing ? 'Craon is processing' : 'Send instruction'}
            className={styles.composerSendBtn}
            disabled={!prompt.trim() || processing}
          >
            {processing ? <Loader2 size={15} /> : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M3.5 9.5L7.5 5.5L11.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {modeOpen && modePos && createPortal(
        <>
          <div className={styles.menuBackdrop} onClick={(e) => { e.stopPropagation(); setModeOpen(false); }} />
          <div
            className={styles.modeDropdownMenuPortal}
            style={{
              position: 'fixed',
              top: `${modePos.top}px`,
              left: `${modePos.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(['Edit', 'Ask', 'Plan'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={`${styles.modeDropdownItem} ${mode === item ? styles.modeDropdownActive : ''}`}
                onClick={() => handleSelectMode(item)}
              >
                <span>{item}</span>
                {mode === item && <Check size={14} className={styles.modeCheckIcon} />}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </form>
  );
}

function AssetCard({
  asset,
  selected,
  view,
  onSelect,
  onPreviewFullscreen,
  onAdd,
  onRemove,
}: {
  asset: EditorAsset;
  selected: boolean;
  view: 'grid' | 'list';
  onSelect: () => void;
  onPreviewFullscreen: () => void;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!menuOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 210;
      let left = rect.right + 6;
      if (left + menuWidth > window.innerWidth - 12) {
        left = Math.max(10, rect.left - menuWidth - 6);
      }
      const top = Math.max(10, Math.min(window.innerHeight - 270, rect.top - 4));
      setMenuPos({ top, left });
    }
    setMenuOpen((prev) => !prev);
  };

  return (
    <article
      className={`${styles.assetCard} ${selected ? styles.assetSelected : ''} ${view === 'list' ? styles.assetRow : ''}`}
      draggable={asset.status === 'Ready'}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('application/craon-asset', asset.id);
      }}
    >
      <button type="button" className={styles.assetMain} onClick={onSelect} onDoubleClick={onPreviewFullscreen}>
        <span className={styles.assetThumb}>
          <video src={asset.url} muted preload="metadata" playsInline />
          <span className={styles.assetShade} />
          {asset.status === 'Ready' ? (
            <small>{compactDuration(asset.duration)}</small>
          ) : (
            <span className={styles.assetProcessing}><Loader2 size={14} /></span>
          )}
        </span>
        <span className={styles.assetInfo}>
          <strong title={asset.name}>{asset.name}</strong>
          <small>
            {asset.status === 'Ready' ? 'Video · Local' : asset.status}
          </small>
        </span>
      </button>
      <div className={styles.assetHoverActions}>
        <IconButton label="Add clip to timeline" onClick={onAdd}>
          <Plus size={13} />
        </IconButton>
        <IconButton label="Preview asset in fullscreen" onClick={onPreviewFullscreen}>
          <Maximize2 size={13} />
        </IconButton>
        <div className={styles.assetMenuWrapper} ref={triggerRef}>
          <IconButton label="More options" onClick={toggleMenu}>
            <MoreVertical size={13} />
          </IconButton>
        </div>
      </div>

      {menuOpen && menuPos && createPortal(
        <>
          <div className={styles.menuBackdrop} onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
          <div
            className={styles.assetDropdownMenuPortal}
            style={{
              position: 'fixed',
              top: `${menuPos.top}px`,
              left: `${menuPos.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.assetDropdownHeader}>{asset.name}</div>
            <button
              type="button"
              className={styles.assetDropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                onPreviewFullscreen();
                setMenuOpen(false);
              }}
            >
              <Maximize2 size={14} />
              <span>Preview Fullscreen</span>
            </button>
            <button
              type="button"
              className={styles.assetDropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
                setMenuOpen(false);
              }}
              disabled={asset.status !== 'Ready'}
            >
              <Plus size={14} />
              <span>Add to Timeline</span>
            </button>
            <button
              type="button"
              className={`${styles.assetDropdownItem} ${styles.assetDropdownDisabled}`}
              disabled
            >
              <Music2 size={14} />
              <span>AI multicam sync</span>
            </button>
            <button
              type="button"
              className={styles.assetDropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            >
              <Sparkles size={14} />
              <span>Add LUT</span>
              <ChevronRight size={13} className={styles.dropdownSubChevron} />
            </button>
            <div className={styles.assetDropdownDivider} />
            <button
              type="button"
              className={styles.assetDropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              type="button"
              className={styles.assetDropdownItem}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            >
              <Pencil size={14} />
              <span>Rename</span>
            </button>
            <div className={styles.assetDropdownDivider} />
            <button
              type="button"
              className={`${styles.assetDropdownItem} ${styles.assetDropdownDanger}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setMenuOpen(false);
              }}
            >
              <Trash2 size={14} />
              <span>Delete Asset</span>
            </button>
          </div>
        </>,
        document.body
      )}

      {asset.status !== 'Ready' && (
        <span className={styles.assetProgress}>
          <i className={
            asset.status === 'Reading file'
              ? styles.progressReading
              : asset.status === 'Generating preview'
                ? styles.progressPreview
                : styles.progressAudio
          } />
        </span>
      )}
    </article>
  );
}

function TranscriptPanel({
  query,
  setQuery,
  lines,
  activeId,
  onSeek,
}: {
  query: string;
  setQuery: (value: string) => void;
  lines: TranscriptLine[];
  activeId: string;
  onSeek: (time: number) => void;
}) {
  return (
    <div className={styles.transcriptPanel}>
      <label className={styles.searchField}>
        <Search size={13} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transcript" />
      </label>
      <div className={styles.transcriptMeta}>
        <span><MessageCircle size={12} /> Speaker 1</span>
        <span>English</span>
      </div>
      <div className={styles.transcriptLines}>
        {lines.map((line) => {
          const active = activeId === line.id;
          const words = line.text.split(' ');
          return (
            <button
              type="button"
              key={line.id}
              className={active ? styles.transcriptActive : ''}
              onClick={() => onSeek(line.time)}
            >
              <time>{compactDuration(line.time)}</time>
              <span>
                <small>{line.speaker}</small>
                <p>
                  {words.map((word, index) => (
                    <mark key={`${word}-${index}`} className={active && index === 3 ? styles.activeWord : ''}>
                      {word}{' '}
                    </mark>
                  ))}
                </p>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LibraryPanel({ onUse }: { onUse: (value: string) => void }) {
  const [selectedRecipe, setSelectedRecipe] = useState('Craon edit recipes');
  const items: Array<{ glyph: EditorGlyphName; title: string; copy: string }> = [
    { glyph: 'subtitles', title: 'Bold subtitle kit', copy: 'Kinetic captions with safe-area layouts' },
    { glyph: 'dialogue', title: 'Clean dialogue', copy: 'Balanced voice and reduced room noise' },
    { glyph: 'grade', title: 'Warm cinema grade', copy: 'Shot-matched contrast and warm highlights' },
    { glyph: 'callout', title: 'Product callouts', copy: 'Minimal labels and tracked feature notes' },
  ];
  return (
    <div className={styles.libraryPanel}>
      <button
        type="button"
        className={`${styles.libraryIntro} ${selectedRecipe === 'Craon edit recipes' ? styles.librarySelected : ''}`}
        onClick={() => {
          setSelectedRecipe('Craon edit recipes');
          onUse('Apply a focused Craon edit recipe');
        }}
      >
        <EditorGlyph name="recipe" />
        <span>
          <strong>Craon edit recipes</strong>
          <small>Apply a focused look or treatment to the current sequence.</small>
        </span>
        <ChevronRight size={13} />
      </button>
      {items.map(({ glyph, title, copy }) => (
        <button
          type="button"
          key={title}
          className={selectedRecipe === title ? styles.librarySelected : ''}
          onClick={() => {
            setSelectedRecipe(title);
            onUse(`Apply ${title.toLowerCase()}`);
          }}
        >
          <EditorGlyph name={glyph} />
          <span><strong>{title}</strong><small>{copy}</small></span>
          <ChevronRight size={13} />
        </button>
      ))}
    </div>
  );
}

function TimelineRuler({ duration, pxPerSecond }: { duration: number; pxPerSecond: number }) {
  const markers = Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, index) => index * 5);
  return (
    <div className={styles.ruler}>
      {markers.map((second) => (
        <span key={second} style={{ left: `${second * pxPerSecond}px` }}>
          <i />
          <time>{compactDuration(second)}</time>
        </span>
      ))}
    </div>
  );
}

function TimelineClipCard({
  clip,
  asset,
  start,
  pxPerSecond,
  selected,
  active,
  aiAffected,
  onSelect,
  onDropClip,
}: {
  clip: TimelineClip;
  asset?: EditorAsset;
  start: number;
  pxPerSecond: number;
  selected: boolean;
  active: boolean;
  aiAffected: boolean;
  onSelect: () => void;
  onDropClip: (sourceId: string) => void;
}) {
  return (
    <button
      type="button"
      draggable
      className={`${styles.timelineClip} ${selected ? styles.clipSelected : ''} ${active ? styles.clipActive : ''} ${aiAffected ? styles.clipAiAffected : ''}`}
      style={{
        left: `${start * pxPerSecond}px`,
        width: `${Math.max(84, clip.duration * pxPerSecond)}px`,
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('application/craon-clip', clip.id);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDropClip(event.dataTransfer.getData('application/craon-clip'));
      }}
    >
      <span className={styles.trimHandle} />
      <span className={styles.thumbnailStrip} aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <video key={index} src={asset?.url} muted preload="metadata" />
        ))}
      </span>
      <span className={styles.clipOverlay} />
      <span className={styles.clipName}>
        <GripVertical size={11} />
        <strong>{asset?.name ?? 'Missing media'}</strong>
        <small>{compactDuration(clip.duration)}</small>
      </span>
      <span className={`${styles.trimHandle} ${styles.trimHandleRight}`} />
    </button>
  );
}

function TrackLabel({
  icon,
  label,
  kind,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  label: string;
  kind: 'video' | 'audio';
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.trackLabel}>
      <span>{icon}{label}</span>
      <div className={styles.trackControls}>
        <IconButton label={kind === 'video' ? `${enabled ? 'Hide' : 'Show'} ${label}` : `${enabled ? 'Mute' : 'Unmute'} ${label}`} onClick={onToggle}>
          {kind === 'video'
            ? enabled ? <Eye size={13} /> : <EyeSlash size={13} />
            : enabled ? <Volume2 size={13} /> : <SpeakerSimpleX size={13} />}
        </IconButton>
        <IconButton label={`${label} track options`}><MoreHorizontal size={13} /></IconButton>
      </div>
    </div>
  );
}

function AttributeRow({ label, value }: { label: string; value: string }) {
  return (
    <label className={styles.attributeRow}>
      <span>{label}</span>
      <input defaultValue={value} />
    </label>
  );
}
