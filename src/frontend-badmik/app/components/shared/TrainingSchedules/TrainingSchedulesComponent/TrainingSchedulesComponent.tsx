'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './TrainingSchedulesComponent.module.scss';

import TrainingSchedulesCreateModal from '../TrainingSchedulesCreateModal/TrainingSchedulesCreateModal';
import TrainingScheduleEventCard from './TrainingScheduleEventCard/TrainingScheduleEventCard';

import {
  useTrainingSchedulesList,
  useCreateTrainingSchedule,
  useTrainingScheduleById,
  useUpdateTrainingSchedule,
} from '@/services/trainingSchedules/queries.client';
import { useLocationById } from '@/services/locations/queries.client';

import type {
  TrainingSchedule,
  TrainingSchedulesListParams,
  CreateTrainingScheduleDto,
  UpdateTrainingScheduleDto,
} from '@/services/types/trainingSchedules.dto';

type DayKey =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

type Selection = {
  courtFrom: number;
  courtTo: number;
  startMin: number;
  endMin: number;
};

type SportOption = {
  value: string;
  courtsCount: number;
};

const DAYS: DayKey[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TYPES = ['All', 'Kids', 'Individual', 'Educational', 'Group', 'CourtRental'] as const;
const LEVELS = ['All', 'A', 'B', 'C', 'D', 'Master'] as const;
const ALLOWED_LEVELS = ['A', 'B', 'C', 'D', 'Master'] as const;

const TIME_COL_WIDTH = 72;
const MIN_COURT_COL_WIDTH = 200;
const HOUR_HEIGHT_PX = 100;

type Props = {
  clubId: string;
  locationId?: string;
};

type UiEvent = {
  id: string;
  top: number;
  height: number;
  left: number;
  width: number;
  timeText: string;
  sport: string;
  type: string;
  levels: string[];
  maxPlayers: number | null;
};

export default function TrainingSchedulesComponent({ clubId, locationId }: Props) {
  const tT = useTranslations('trainingType');
  const tS = useTranslations('sportType');
  const tR = useTranslations('TrainingSchedules');

  const [activeDay, setActiveDay] = useState<DayKey>('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);

  const [sport, setSport] = useState<string>('');
  const [type, setType] = useState<(typeof TYPES)[number]>('All');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');

  const [selection, setSelection] = useState<Selection | null>(null);

  const [dragBox, setDragBox] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const courtsAreaRef = useRef<HTMLDivElement | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isSelectingRef = useRef(false);

  const startHour = 6;
  const endHour = 22;
  const hourHeightPx = HOUR_HEIGHT_PX;
  const pxPerMinute = hourHeightPx / 60;
  const snapMinutes = 15;

  const qLocation = useLocationById(locationId ?? '', {
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
  }

  function snap(mins: number) {
    return Math.round(mins / snapMinutes) * snapMinutes;
  }

  function minsToTimeString(totalMinsFromStart: number) {
    const absoluteMins = startHour * 60 + totalMinsFromStart;
    const h = Math.floor(absoluteMins / 60);
    const m = absoluteMins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function minsToTimeStringWithSeconds(totalMinsFromStart: number) {
    return `${minsToTimeString(totalMinsFromStart)}:00`;
  }

  function parseTimeToMinutesFromMidnight(value?: string | null) {
    if (!value) return null;

    const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
    if (!m) return null;

    const hh = Number(m[1]);
    const mm = Number(m[2]);

    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;

    return hh * 60 + mm;
  }

  function normalizeLevels(input: unknown): string[] {
    if (!Array.isArray(input)) return [];

    return input
      .map((x) => String(x))
      .filter(
        (x): x is string =>
          ALLOWED_LEVELS.includes(x as (typeof ALLOWED_LEVELS)[number]),
      );
  }

  function normalizeSportName(value: unknown): string {
    return String(value ?? '').trim();
  }

  function extractSportOptions(location: any): SportOption[] {
    if (!location) return [];

    const result: SportOption[] = [];

    const pushOption = (sportName: unknown, courtsCount: unknown) => {
      const value = normalizeSportName(sportName);
      if (!value) return;

      const parsedCourts = Number(courtsCount);
      const safeCourts = Number.isFinite(parsedCourts) && parsedCourts > 0 ? parsedCourts : 1;

      const existing = result.find((x) => x.value === value);
      if (existing) {
        existing.courtsCount = Math.max(existing.courtsCount, safeCourts);
        return;
      }

      result.push({
        value,
        courtsCount: safeCourts,
      });
    };

    const sportCourts =
      location?.sportCourts ??
      location?.sportsCourts ??
      location?.sportsConfiguration ??
      location?.sportsConfig ??
      location?.sportTypes ??
      location?.sports;

    if (Array.isArray(sportCourts)) {
      for (const item of sportCourts) {
        pushOption(
          item?.sport ?? item?.sportType ?? item?.type ?? item?.name,
          item?.courtsCount ?? item?.courtCount ?? item?.count ?? item?.numberOfCourts,
        );
      }
    }

    if (!result.length && Array.isArray(location?.sports)) {
      for (const item of location.sports) {
        if (typeof item === 'string') {
          pushOption(item, location?.courtsCount ?? location?.courtCount ?? 1);
        } else {
          pushOption(
            item?.sport ?? item?.sportType ?? item?.type ?? item?.name,
            item?.courtsCount ?? item?.courtCount ?? item?.count ?? 1,
          );
        }
      }
    }

    if (!result.length && Array.isArray(location?.sportTypes)) {
      for (const item of location.sportTypes) {
        if (typeof item === 'string') {
          pushOption(item, location?.courtsCount ?? location?.courtCount ?? 1);
        } else {
          pushOption(
            item?.sport ?? item?.sportType ?? item?.type ?? item?.name,
            item?.courtsCount ?? item?.courtCount ?? item?.count ?? 1,
          );
        }
      }
    }

    if (!result.length) {
      const fallbackSport =
        location?.sport ??
        location?.defaultSport ??
        location?.sportType ??
        location?.type;

      const fallbackCourts =
        location?.courtsCount ??
        location?.courtCount ??
        location?.numberOfCourts ??
        location?.courts_number ??
        (Array.isArray(location?.courts) ? location.courts.length : 1);

      if (fallbackSport) {
        pushOption(fallbackSport, fallbackCourts);
      }
    }

    return result;
  }

  const sportOptions = useMemo(() => {
    return extractSportOptions(qLocation.data as any);
  }, [qLocation.data]);

  useEffect(() => {
    if (!sportOptions.length) return;

    const hasSelected = sportOptions.some((x) => x.value === sport);

    if (!sport || !hasSelected) {
      setSport(sportOptions[0].value);
    }
  }, [sportOptions, sport]);

  const selectedSportOption = useMemo(() => {
    return sportOptions.find((x) => x.value === sport) ?? sportOptions[0] ?? null;
  }, [sportOptions, sport]);

  const courtsCount = selectedSportOption?.courtsCount ?? 1;

  const hours = useMemo(() => {
    const res: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      res.push(String(h).padStart(2, '0') + ':00');
    }
    return res;
  }, [startHour, endHour]);

  const gridHeight = hours.length * hourHeightPx;
  const maxMinutes = (endHour - startHour) * 60;
  const gridMinWidth = TIME_COL_WIDTH + courtsCount * MIN_COURT_COL_WIDTH;

  function getCourtsAreaMetrics() {
    const el = courtsAreaRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const totalWidth = el.scrollWidth || rect.width;
    const colWidth = totalWidth / courtsCount;

    return { rect, totalWidth, colWidth };
  }

  function computeSelectionFromPixels(
    rect: DOMRect,
    leftPx: number,
    rightPx: number,
    topPx: number,
    bottomPx: number,
  ): Selection {
    const colWidth = rect.width / courtsCount;

    let courtFrom = Math.floor(leftPx / colWidth) + 1;
    let courtTo = Math.floor((rightPx - 1) / colWidth) + 1;

    courtFrom = clamp(courtFrom, 1, courtsCount);
    courtTo = clamp(courtTo, 1, courtsCount);

    if (courtTo < courtFrom) {
      [courtFrom, courtTo] = [courtTo, courtFrom];
    }

    let startMin = snap(topPx / pxPerMinute);
    let endMin = snap(bottomPx / pxPerMinute);

    startMin = clamp(startMin, 0, maxMinutes);
    endMin = clamp(endMin, 0, maxMinutes);

    if (endMin <= startMin) {
      endMin = clamp(startMin + snapMinutes, 0, maxMinutes);
    }

    return { courtFrom, courtTo, startMin, endMin };
  }

  function openModal(sel: Selection) {
    setSelection(sel);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelection(null);
    setDragBox((s) => ({ ...s, visible: false }));
  }

  function openEditModal(scheduleId: string) {
    setSelectedScheduleId(scheduleId);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setSelectedScheduleId(null);
  }

  function onPointerDown(e: React.PointerEvent) {
    const el = courtsAreaRef.current;
    if (!el) return;

    const target = e.target as HTMLElement;
    if (target.closest('[data-training-event-card="true"]')) return;
    if (e.button !== 0) return;

    const rect = el.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    isSelectingRef.current = true;
    startPointRef.current = { x, y };
    el.setPointerCapture(e.pointerId);

    setDragBox({ left: x, top: y, width: 0, height: 0, visible: true });
    setSelection(null);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isSelectingRef.current) return;

    const el = courtsAreaRef.current;
    const start = startPointRef.current;
    if (!el || !start) return;

    const rect = el.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    const left = Math.min(start.x, x);
    const top = Math.min(start.y, y);
    const right = Math.max(start.x, x);
    const bottom = Math.max(start.y, y);

    setDragBox({
      left,
      top,
      width: right - left,
      height: bottom - top,
      visible: true,
    });

    setSelection(computeSelectionFromPixels(rect, left, right, top, bottom));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!isSelectingRef.current) return;

    const el = courtsAreaRef.current;
    const start = startPointRef.current;

    isSelectingRef.current = false;
    startPointRef.current = null;

    if (!el || !start) return;

    const rect = el.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left, 0, rect.width);
    const y = clamp(e.clientY - rect.top, 0, rect.height);

    const left = Math.min(start.x, x);
    const top = Math.min(start.y, y);
    const right = Math.max(start.x, x);
    const bottom = Math.max(start.y, y);

    if (right - left < 6 || bottom - top < 10) {
      setDragBox((s) => ({ ...s, visible: false }));
      setSelection(null);
      return;
    }

    const sel = computeSelectionFromPixels(rect, left, right, top, bottom);
    setDragBox((s) => ({ ...s, visible: false }));
    openModal(sel);
  }

  const listParams: TrainingSchedulesListParams = useMemo(() => {
    const p: TrainingSchedulesListParams = {
      clubId,
      locationId,
      isActive: true,
      dayOfWeek: activeDay,
      page: 1,
      pageSize: 200,
    };

    if (sport) p.sport = sport;
    if (type !== 'All') p.type = type;
    if (level !== 'All') p.level = level;

    return p;
  }, [clubId, locationId, activeDay, sport, type, level]);

  const q = useTrainingSchedulesList(listParams, {
    enabled: !!clubId && !!locationId && !!sport,
  });

  const schedules: TrainingSchedule[] = q.data?.list ?? [];

  const createM = useCreateTrainingSchedule();
  const updateM = useUpdateTrainingSchedule();

  const scheduleByIdQuery = useTrainingScheduleById(selectedScheduleId ?? '', {
    enabled: !!selectedScheduleId && isEditModalOpen,
    refetchOnWindowFocus: false,
  });

  async function handleCreateFromModal(payload: {
    name: string;
    maxPlayers: number | null;
    trainingType: string;
    levels: string[];
  }) {
    if (!selection || !clubId || !locationId || !sport) return;

    const courtsRequired = selection.courtTo - selection.courtFrom + 1;

    const dto: CreateTrainingScheduleDto = {
      clubId,
      locationId,
      isActive: true,
      dayOfWeek: activeDay,
      startTime: minsToTimeStringWithSeconds(selection.startMin),
      endTime: minsToTimeStringWithSeconds(selection.endMin),
      sport,
      type: payload.trainingType as any,
      levels: normalizeLevels(payload.levels),
      courtsRequired,
      maxParticipants: payload.maxPlayers ?? undefined,
    } as any;

    try {
      await createM.mutateAsync(dto);
      await q.refetch();
      closeModal();
    } catch (e) {
      console.error('[trainingSchedules] create failed', e);
    }
  }

  async function handleUpdateFromModal(payload: {
    name: string;
    maxPlayers: number | null;
    trainingType: string;
    levels: string[];
  }) {
    const current = scheduleByIdQuery.data;
    if (!selectedScheduleId || !current) return;

    const dto: UpdateTrainingScheduleDto = {
      clubId: (current as any).clubId ?? clubId,
      locationId: (current as any).locationId ?? locationId,
      isActive: (current as any).isActive ?? true,
      dayOfWeek: (current as any).dayOfWeek ?? activeDay,
      startTime: (current as any).startTime,
      endTime: (current as any).endTime,
      sport: (current as any).sport,
      type: payload.trainingType as any,
      levels: normalizeLevels(payload.levels),
      courtsRequired: Number((current as any).courtsRequired ?? 1),
      maxParticipants: payload.maxPlayers ?? undefined,
    } as any;

    try {
      await updateM.mutateAsync({
        scheduleId: selectedScheduleId,
        dto,
      });
      await q.refetch();
      closeEditModal();
    } catch (e) {
      console.error('[trainingSchedules] update failed', e);
    }
  }

  const [colWidth, setColWidth] = useState<number>(0);

  useEffect(() => {
    const el = courtsAreaRef.current;
    if (!el) return;

    const calc = () => {
      const totalWidth = el.scrollWidth || el.getBoundingClientRect().width;
      setColWidth(totalWidth / courtsCount);
    };

    calc();

    const ro = new ResizeObserver(() => calc());
    ro.observe(el);

    return () => ro.disconnect();
  }, [courtsCount, gridMinWidth]);

  function mapScheduleToEvent(s: TrainingSchedule): UiEvent | null {
    const startAbs = parseTimeToMinutesFromMidnight((s as any).startTime);
    const endAbs = parseTimeToMinutesFromMidnight((s as any).endTime);
    if (startAbs == null || endAbs == null) return null;

    let startMin = startAbs - startHour * 60;
    let endMin = endAbs - startHour * 60;

    startMin = clamp(startMin, 0, maxMinutes);
    endMin = clamp(endMin, 0, maxMinutes);
    if (endMin <= startMin) return null;

    const top = startMin * pxPerMinute;
    const height = Math.max(8, (endMin - startMin) * pxPerMinute);

    const courtsRequired = Number((s as any).courtsRequired ?? 1);
    const span = clamp(Number.isFinite(courtsRequired) ? courtsRequired : 1, 1, courtsCount);

    const courtFromRaw =
      (s as any).courtFrom ?? (s as any).courtNumber ?? (s as any).courtIndex ?? 1;
    const courtFrom = clamp(Number(courtFromRaw), 1, courtsCount);

    const timeText = `${minsToTimeString(startMin)}–${minsToTimeString(endMin)}`;
    const levels = normalizeLevels((s as any).levels);

    return {
      id: String((s as any).id ?? `${startAbs}-${endAbs}`),
      top,
      height,
      left: (courtFrom - 1) * colWidth,
      width: span * colWidth,
      timeText,
      sport: String((s as any).sport ?? ''),
      type: String((s as any).type ?? ''),
      levels,
      maxPlayers: (s as any).maxParticipants ?? null,
    };
  }

  const uiEvents = useMemo(() => {
    if (!colWidth) return [];
    return schedules.map(mapScheduleToEvent).filter(Boolean) as UiEvent[];
  }, [schedules, colWidth]);

  const tiles = useMemo(() => {
    if (!selection) return [];

    const metrics = getCourtsAreaMetrics();
    if (!metrics) return [];

    const { colWidth: cw } = metrics;

    const y1 = selection.startMin * pxPerMinute;
    const y2 = selection.endMin * pxPerMinute;

    const out: Array<{
      left: number;
      top: number;
      width: number;
      height: number;
      key: string;
    }> = [];

    for (let c = selection.courtFrom; c <= selection.courtTo; c++) {
      out.push({
        key: `tile-${c}`,
        left: (c - 1) * cw,
        top: y1,
        width: cw,
        height: Math.max(0, y2 - y1),
      });
    }

    return out;
  }, [selection, courtsCount, pxPerMinute]);

  const selectionLabel = useMemo(() => {
    if (!selection) return null;
    const cCount = selection.courtTo - selection.courtFrom + 1;

    return {
      courts: `${tR('courts')} ${selection.courtFrom} → ${tR('courts')} ${selection.courtTo}`,
      courtsCount: String(cCount),
      time: `${minsToTimeString(selection.startMin)} → ${minsToTimeString(selection.endMin)}`,
    };
  }, [selection, tR]);

  const editSelectionLabel = useMemo(() => {
    const current = scheduleByIdQuery.data;
    if (!current) return null;

    const startAbs = parseTimeToMinutesFromMidnight((current as any).startTime);
    const endAbs = parseTimeToMinutesFromMidnight((current as any).endTime);

    const courtsRequired = Number((current as any).courtsRequired ?? 1);
    const span = clamp(Number.isFinite(courtsRequired) ? courtsRequired : 1, 1, courtsCount);

    const courtFromRaw =
      (current as any).courtFrom ??
      (current as any).courtNumber ??
      (current as any).courtIndex ??
      1;
    const courtFrom = clamp(Number(courtFromRaw), 1, courtsCount);
    const courtTo = clamp(courtFrom + span - 1, 1, courtsCount);

    return {
      courts: `${tR('courts')} ${courtFrom} → ${tR('courts')} ${courtTo}`,
      courtsCount: String(span),
      time:
        startAbs != null && endAbs != null
          ? `${minsToTimeString(startAbs - startHour * 60)} → ${minsToTimeString(endAbs - startHour * 60)}`
          : '—',
    };
  }, [scheduleByIdQuery.data, tR, courtsCount]);

  const editInitialValues = useMemo(() => {
    const current = scheduleByIdQuery.data;
    if (!current) return undefined;

    const levels = normalizeLevels((current as any).levels);

    return {
      name: '',
      maxPlayers: (current as any).maxParticipants ?? null,
      trainingType: ((current as any).type ?? 'Group') as
        | 'Kids'
        | 'Individual'
        | 'Educational'
        | 'Group'
        | 'CourtRental',
      levels: levels.length ? levels : ['All'],
    };
  }, [scheduleByIdQuery.data]);

  const isSingleSport = sportOptions.length <= 1;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.filters}>
          <div className={styles.filterBox}>
            <span className={styles.filterLabel}>{tR('filters.sport')}</span>
            <select
              className={styles.select}
              value={sport}
              disabled={isSingleSport || !sportOptions.length}
              onChange={(e) => setSport(e.target.value)}
            >
              {sportOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {tS(item.value as any)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterBox}>
            <span className={styles.filterLabel}>{tR('filters.type')}</span>
            <select
              className={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              {TYPES.map((x) => (
                <option key={x} value={x}>
                  {tT(x)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.levelsBox}>
            <span className={styles.filterLabelInline}>{tR('filters.level')}</span>
            <div className={styles.levelsRow}>
              {LEVELS.map((l) => {
                const isActive = level === l;
                return (
                  <button
                    key={l}
                    type="button"
                    className={isActive ? styles.levelPillActive : styles.levelPill}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.filtersRight}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                const firstSport = sportOptions[0]?.value ?? '';
                setSport(firstSport);
                setType('All');
                setLevel('All');
              }}
            >
              Clear
            </button>

            <button type="button" className={styles.btnPrimary} onClick={() => q.refetch()}>
              Apply
            </button>
          </div>
        </div>

        <div className={styles.gridCard}>
          <div className={styles.dayRow}>
            <span className={styles.dayLabel}>{tR('weekdays.day')}</span>
            <div className={styles.dayButtons}>
              {DAYS.map((d) => {
                const isActive = d === activeDay;
                return (
                  <button
                    key={d}
                    type="button"
                    className={isActive ? styles.dayBtnActive : styles.dayBtn}
                    onClick={() => setActiveDay(d)}
                  >
                    {tR(`weekdays.${d}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={styles.courtHeaderRow}
            style={{
              gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${courtsCount}, minmax(${MIN_COURT_COL_WIDTH}px, 1fr))`,
              minWidth: `${gridMinWidth}px`,
            }}
          >
            <div className={styles.timeHeader}>{tR('time')}</div>
            {Array.from({ length: courtsCount }).map((_, idx) => (
              <div key={idx} className={styles.courtHeaderCell}>
                {tR('courts')} {idx + 1}
              </div>
            ))}
          </div>

          <div
            className={styles.bodyGrid}
            style={{
              gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${courtsCount}, minmax(${MIN_COURT_COL_WIDTH}px, 1fr))`,
              minWidth: `${gridMinWidth}px`,
            }}
          >
            <div className={styles.timeCol}>
              <div className={styles.timeColInner} style={{ height: gridHeight }}>
                {hours.map((hh) => (
                  <div key={hh} className={styles.timeRow} style={{ height: hourHeightPx }}>
                    {hh}
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={courtsAreaRef}
              className={styles.courtsArea}
              style={{
                height: gridHeight,
                gridColumn: `2 / span ${courtsCount}`,
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <div
                className={styles.courtsBg}
                style={{
                  gridTemplateColumns: `repeat(${courtsCount}, minmax(${MIN_COURT_COL_WIDTH}px, 1fr))`,
                }}
              >
                {Array.from({ length: courtsCount }).map((_, cIdx) => (
                  <div key={cIdx} className={styles.courtCol}>
                    {hours.map((hh) => (
                      <div
                        key={`${cIdx}-${hh}`}
                        className={styles.bgRow}
                        style={{ height: hourHeightPx }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className={styles.tileLayer} aria-hidden="true">
                {tiles.map((t) => (
                  <div
                    key={t.key}
                    className={styles.tile}
                    style={{ left: t.left, top: t.top, width: t.width, height: t.height }}
                  />
                ))}
              </div>

              {dragBox.visible && (
                <div
                  className={styles.selectionBox}
                  aria-hidden="true"
                  style={{
                    left: dragBox.left,
                    top: dragBox.top,
                    width: dragBox.width,
                    height: dragBox.height,
                  }}
                />
              )}

              {uiEvents.map((ev) => (
                <TrainingScheduleEventCard
                  key={ev.id}
                  id={ev.id}
                  top={ev.top}
                  height={ev.height}
                  left={ev.left}
                  width={ev.width}
                  timeText={ev.timeText}
                  sport={ev.sport}
                  type={ev.type}
                  levels={ev.levels}
                  maxPlayers={ev.maxPlayers}
                  onClick={openEditModal}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <TrainingSchedulesCreateModal
        open={isModalOpen}
        mode="create"
        selectionLabel={selectionLabel}
        onClose={closeModal}
        onCreate={handleCreateFromModal}
        submitting={createM.isPending}
      />

      <TrainingSchedulesCreateModal
        open={isEditModalOpen}
        mode="edit"
        loading={scheduleByIdQuery.isLoading}
        submitting={updateM.isPending}
        selectionLabel={editSelectionLabel}
        initialValues={editInitialValues}
        onClose={closeEditModal}
        onUpdate={handleUpdateFromModal}
      />
    </div>
  );
}

//=================================================================================