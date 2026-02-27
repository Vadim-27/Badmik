'use client';

import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import styles from './LocationImagesScreen.module.scss';

import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

import AddButtonImage from '@/app/components/ui/Buttons/AddButtonImage/AddButtonImage';
import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';

// ✅ ваші вже написані хуки
import {
  useLocationLogo,
  useLocationImages,
  useUploadLocationLogo,
  useUploadLocationImages,
  useDeleteLocationLogo,
  useDeleteLocationImage,
  useUpdateLocationImagesOrder,
} from '@/services/locationMedia/queries.client';

// ✅ контекст екшен-хедера табів (як у Player)
import { useLocationTabsHeaderAction } from '../../LocationTabsLayout/LocationTabsHeaderActionContext';

import PositionDialog from '../PositionDialog/PositionDialog';

type Props = {
  clubId: string;
  locationId: string;
};

type MediaItem = {
  id: string;
  url: string;
  thumbUrl?: string | null;
  contentType?: string | null;
  createdAt?: string | null;
  sortOrder?: number | null;
  fileName?: string | null;
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? 'https://staging.api.badmik.com.ua';

function absUrl(raw?: string | null) {
  const s = String(raw ?? '').trim();
  if (!s) return '';
  return s.startsWith('http') ? s : `${API_ORIGIN}${s}`;
}

function fileNameFromUrl(url?: string | null) {
  if (!url) return null;
  const s = String(url).split('?')[0] ?? '';
  const parts = s.split('/');
  return parts[parts.length - 1] || null;
}

export default function LocationImagesScreen({ locationId }: Props) {
  const t = useTranslations('locationImages');
  const tPD = useTranslations('locationImages.positionDialog'); 
  const { setHeaderAction } = useLocationTabsHeaderAction();

  const inputLogoRef = useRef<HTMLInputElement | null>(null);
  const inputImagesRef = useRef<HTMLInputElement | null>(null);

  // ✅ DATA з танстаку (після SSR prefetch + RQHydrate має прийти одразу)
  const qLogo = useLocationLogo(locationId, { enabled: !!locationId });
  const qImages = useLocationImages(locationId, { enabled: !!locationId });

  const mUploadLogo = useUploadLocationLogo(locationId);
  const mUploadImages = useUploadLocationImages(locationId);
  const mDeleteLogo = useDeleteLocationLogo(locationId);
  const mDeleteImage = useDeleteLocationImage(locationId);
  const mOrder = useUpdateLocationImagesOrder(locationId);

  const isInitialLoading =
    !!locationId && (qLogo.isLoading || qImages.isLoading) && !qLogo.data && !qImages.data;

  const isBusy =
    qLogo.isFetching ||
    qImages.isFetching ||
    mUploadLogo.isPending ||
    mUploadImages.isPending ||
    mDeleteLogo.isPending ||
    mDeleteImage.isPending ||
    mOrder.isPending;

  const onPickLogo = useCallback(() => inputLogoRef.current?.click(), []);
  const onPickImages = useCallback(() => inputImagesRef.current?.click(), []);

  // ✅ екшен-хедер: Upload images (як на мокапі)
  useEffect(() => {
    if (!locationId) return;

    setHeaderAction(
      <AddButtonImage
        label="buttons.uploadImages"
        onClick={onPickImages}
        disabled={isBusy || !locationId}
      />,
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, onPickImages, isBusy, locationId]);

  const onLogoSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;

      mUploadLogo.mutate(f);
      e.currentTarget.value = '';
    },
    [mUploadLogo],
  );

  const onImagesSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      mUploadImages.mutate(files);
      e.currentTarget.value = '';
    },
    [mUploadImages],
  );

  const logo: MediaItem | null = useMemo(() => {
    const d: any = qLogo.data ?? null;
    if (!d) return null;

    return {
      id: d.id,
      url: absUrl(d.url),
      thumbUrl: d.thumbUrl ? absUrl(d.thumbUrl) : null,
      sortOrder: d.sortOrder,
      contentType: d.contentType,
      createdAt: d.createdAt,
      fileName: d.fileName ?? fileNameFromUrl(d.url) ?? 'logo',
    };
  }, [qLogo.data]);

  const gallery: MediaItem[] = useMemo(() => {
    const arr: any[] = (qImages.data as any[]) ?? [];
    return arr.map((d) => ({
      id: d.id,
      url: absUrl(d.url),
      thumbUrl: d.thumbUrl ? absUrl(d.thumbUrl) : null,
      sortOrder: d.sortOrder,
      contentType: d.contentType,
      createdAt: d.createdAt,
      fileName: d.fileName ?? fileNameFromUrl(d.url) ?? 'image',
    }));
  }, [qImages.data]);

  // ====== SORT / ORDER helpers ======
  const sortedGallery = useMemo(() => {
    return gallery.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [gallery]);

  // якщо бек іноді повертає 0-based, іноді 1-based — визначаємо базу
  const sortBase = useMemo(() => {
    const vals = sortedGallery
      .map((x, idx) => (typeof x.sortOrder === 'number' ? x.sortOrder : idx + 1))
      .filter((n) => Number.isFinite(n));
    const min = vals.length ? Math.min(...vals) : 1;
    return min === 0 ? 0 : 1;
  }, [sortedGallery]);

  function uiPosFromItem(img: MediaItem, fallbackIdx0: number) {
    const v = typeof img.sortOrder === 'number' ? img.sortOrder : sortBase + fallbackIdx0;
    return sortBase === 0 ? v + 1 : v;
  }

  // ====== Position modal state ======
  const [posOpen, setPosOpen] = useState(false);
  const [posImageId, setPosImageId] = useState<string | null>(null);
  const [posInitial, setPosInitial] = useState<number>(1);

  const openPositionModal = useCallback(
    (img: MediaItem, fallbackIdx0: number) => {
      setPosImageId(img.id);
      setPosInitial(uiPosFromItem(img, fallbackIdx0)); // UI 1..N
      setPosOpen(true);
    },
    [sortBase],
  );

  const closePositionModal = useCallback(() => {
    if (mOrder.isPending) return;
    setPosOpen(false);
    setPosImageId(null);
  }, [mOrder.isPending]);

  const buildOrderDto = useCallback(
    (moveId: string, newUiPos: number) => {
      // newUiPos: 1..N
      const arr = sortedGallery.slice();
      const fromIdx = arr.findIndex((x) => x.id === moveId);
      if (fromIdx === -1) return null;

      const toIdx = Math.max(0, Math.min(arr.length - 1, newUiPos - 1));

      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);

      return {
        items: arr.map((x, idx) => ({
          id: x.id,
          sortOrder: sortBase + idx,
        })),
      };
    },
    [sortedGallery, sortBase],
  );

  return (
    <section className={styles.wrapper}>
      {isInitialLoading || isBusy ? <SpinnerOverlay fullscreen={false} /> : null}

      {/* hidden inputs */}
      <input
        ref={inputLogoRef}
        type="file"
        hidden
        // SVG теж дозволяємо
        accept="image/*,.svg"
        onChange={onLogoSelected}
      />
      <input ref={inputImagesRef} type="file" hidden multiple accept="image/*" onChange={onImagesSelected} />

      {/* Logo card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderTitle}>{t('logo.title')}</div>
        </div>

        <div className={styles.logoRow}>
          <div className={styles.logoPreview}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo.thumbUrl ?? logo.url} alt="logo" className={styles.logoImg} />
            ) : (
              <div className={styles.logoPlaceholder}>logo</div>
            )}
          </div>

          <div className={styles.logoMeta}>
            <div className={styles.logoName}>{t('logo.title')}</div>
            <div className={styles.logoHint}>{t('logo.hint')}</div>
          </div>

          <div className={styles.logoActions}>
            <AddButtonImage label="buttons.uploadLogo" onClick={onPickLogo} disabled={isBusy} />
            <DeleteButton
              label="buttons.delete"
              disabled={!logo || isBusy}
              onClick={() => mDeleteLogo.mutate()}
            />
          </div>
        </div>
      </div>

      {/* Gallery card */}
      <div className={styles.card}>
        <div className={styles.cardHeaderRow}>
          <div className={styles.cardHeaderTitle}>{t('gallery.title')}</div>
          <div className={styles.cardHeaderRight}>
            {t('gallery.count', { count: sortedGallery.length })}
          </div>
        </div>

        <div className={styles.list}>
          {sortedGallery.length === 0 ? (
            <div className={styles.empty}>{t('gallery.empty')}</div>
          ) : (
            sortedGallery.map((img, idx) => (
              <div key={img.id} className={styles.row}>
                <div className={styles.dragStub} aria-hidden />

                <div className={styles.thumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.fileName ?? 'image'} className={styles.thumbImg} />
                </div>

                <div className={styles.meta}>
                  <div className={styles.fileName}>{t('gallery.fileFallback')}</div>

                  <button
                    type="button"
                    className={styles.position}
                    disabled={isBusy}
                    onClick={() => openPositionModal(img, idx)}
                  >
                    {t('gallery.position')} <span>{uiPosFromItem(img, idx)}</span>
                  </button>
                </div>

                <div className={styles.rowActions}>
                  <DeleteButton
                    label="buttons.delete"
                    disabled={isBusy}
                    onClick={() => mDeleteImage.mutate(img.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

  {/* ===== Position dialog ===== */}
  <PositionDialog
    open={posOpen}
    initialValue={posInitial}
    min={1}
    max={Math.max(1, sortedGallery.length)}
    isLoading={mOrder.isPending}
    title={t('positionDialog.title')}
    message={t('positionDialog.message')}
    label={t('positionDialog.label')}
    hint={t('positionDialog.hint', { min: 1, max: Math.max(1, sortedGallery.length) })}
    confirmLabel={t('positionDialog.confirm')}
    cancelLabel={t('positionDialog.cancel')}
        onCancel={closePositionModal}
        onConfirm={(newPos) => {
          if (!posImageId) return;

          const dto = buildOrderDto(posImageId, newPos);
          if (!dto) return;

          mOrder.mutate(dto, {
            onSuccess: () => closePositionModal(),
          });
        }}
      />
    </section>
  );
}
