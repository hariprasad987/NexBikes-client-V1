"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BikeImage } from "@/components/ui/bike-image/bike-image";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { SearchableSelectField } from "@/components/ui/searchable-select-field/searchable-select-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";

import {
  getBikeBrands,
  getBikeModels,
  getBikeSeries,
  getBikeSizes,
  getBikes,
  getBikeYears,
  type BikeCatalogQuery,
} from "../../data";
import type {
  BikeBrand,
  BikeCatalogOption,
  BikeCatalogPage,
  BikeModel,
  BikeOption,
  BikeSeries,
} from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./bike-search-step.module.scss";

type BikeSearchStepProps = {
  onContinue: () => void;
  onPrevious?: () => void;
  onSelectBike: (bike: BikeOption) => void;
  onSkip: () => void;
  selectedBikeId: string;
};

type BikeResultCardProps = {
  bike: BikeOption;
  isSelected: boolean;
  onSelectBike: (bike: BikeOption) => void;
};

type CatalogLoader<T extends BikeCatalogOption> = (
  query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>,
) => Promise<BikeCatalogPage<T>>;

function mergeCatalogItems<T extends BikeCatalogOption>(current: T[], incoming: T[]) {
  const merged = new Map(current.map((item) => [item.id, item]));

  incoming.forEach((item) => merged.set(item.id, item));

  return Array.from(merged.values());
}

function usePaginatedCatalog<T extends BikeCatalogOption>(
  loadPage: CatalogLoader<T>,
  errorMessage: string,
) {
  const { showToast } = useToast();
  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    const nextRequestId = requestId.current + 1;
    requestId.current = nextRequestId;
    let cancelled = false;

    const timeout = window.setTimeout(async () => {
      setItems([]);
      setPage(1);
      setHasMore(false);
      setIsLoading(true);

      try {
        const result = await loadPage({ limit: 20, page: 1, search });

        if (cancelled || nextRequestId !== requestId.current) return;

        setItems(result.items);
        setPage(result.pagination.page);
        setHasMore(result.pagination.page < result.pagination.totalPages);
      } catch {
        if (!cancelled && nextRequestId === requestId.current) {
          showToast({ message: errorMessage, tone: "error" });
        }
      } finally {
        if (!cancelled && nextRequestId === requestId.current) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [errorMessage, loadPage, search, showToast]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    const currentRequestId = requestId.current;
    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const result = await loadPage({ limit: 20, page: nextPage, search });

      if (currentRequestId !== requestId.current) return;

      setItems((current) => mergeCatalogItems(current, result.items));
      setPage(result.pagination.page);
      setHasMore(result.pagination.page < result.pagination.totalPages);
    } catch {
      if (currentRequestId === requestId.current) {
        showToast({ message: errorMessage, tone: "error" });
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [errorMessage, hasMore, isLoading, loadPage, page, search, showToast]);

  return { hasMore, isLoading, items, loadMore, search, setSearch };
}

function BikeSkeleton() {
  return (
    <div aria-hidden="true" className={styles.skeletonCard}>
      <div className={styles.skeletonImage}>
        <Icon name="bike" size={84} />
      </div>
      <span className={styles.skeletonLine} />
      <span className={styles.skeletonLineShort} />
    </div>
  );
}

function BikeResultCard({ bike, isSelected, onSelectBike }: BikeResultCardProps) {
  return (
    <button
      aria-checked={isSelected}
      className={`${styles.bikeCard} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelectBike(bike)}
      role="radio"
      type="button"
    >
      <span className={styles.imageFrame}>
        <BikeImage
          alt={bike.name}
          height={800}
          priority={isSelected}
          src={bike.image}
          width={1200}
        />
      </span>
      <span className={styles.bikeDetails}>
        <strong className={isSelected ? styles.selectedName : ""}>{bike.name}</strong>
        <span className={styles.meta}>
          {bike.brand} <span aria-hidden="true">|</span> {bike.year}
        </span>
      </span>
    </button>
  );
}

export function BikeSearchStep({
  onContinue,
  onPrevious,
  onSelectBike,
  onSkip,
  selectedBikeId,
}: BikeSearchStepProps) {
  const { showToast } = useToast();
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedBrandName, setSelectedBrandName] = useState("");
  const [selectedSeriesId, setSelectedSeriesId] = useState("");
  const [selectedSeriesName, setSelectedSeriesName] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedModelName, setSelectedModelName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [bikes, setBikes] = useState<BikeOption[]>([]);
  const [bikePage, setBikePage] = useState(1);
  const [bikeHasMore, setBikeHasMore] = useState(false);
  const [isLoadingBikes, setIsLoadingBikes] = useState(true);
  const bikeRequestId = useRef(0);
  const bikeLoaderRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const loadBrands = useCallback(
    (query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>) => getBikeBrands(query),
    [],
  );
  const loadSeries = useCallback(
    (query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>) => getBikeSeries({
      ...query,
      brandId: selectedBrandId,
    }),
    [selectedBrandId],
  );
  const loadModels = useCallback(
    (query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>) => getBikeModels({
      ...query,
      brandId: selectedBrandId,
      series: selectedSeriesName,
    }),
    [selectedBrandId, selectedSeriesName],
  );
  const loadYears = useCallback(
    (query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>) => getBikeYears({
      ...query,
      brandId: selectedBrandId,
      modelName: selectedModelName,
      series: selectedSeriesName,
    }),
    [selectedBrandId, selectedModelName, selectedSeriesName],
  );
  const loadSizes = useCallback(
    (query: Required<Pick<BikeCatalogQuery, "limit" | "page" | "search">>) => getBikeSizes({
      ...query,
      brandId: selectedBrandId,
      modelName: selectedModelName,
      series: selectedSeriesName,
    }),
    [selectedBrandId, selectedModelName, selectedSeriesName],
  );

  const brandCatalog = usePaginatedCatalog<BikeBrand>(loadBrands, "Unable to load bike brands. Please try again.");
  const seriesCatalog = usePaginatedCatalog<BikeSeries>(loadSeries, "Unable to load bike series. Please try again.");
  const modelCatalog = usePaginatedCatalog<BikeModel>(loadModels, "Unable to load bike models. Please try again.");
  const yearCatalog = usePaginatedCatalog<BikeCatalogOption>(loadYears, "Unable to load bike years. Please try again.");
  const sizeCatalog = usePaginatedCatalog<BikeCatalogOption>(loadSizes, "Unable to load bike sizes. Please try again.");

  const loadBikePage = useCallback(
    (page: number) => getBikes({
      brandId: selectedBrandId,
      limit: 10,
      modelName: selectedModelName,
      page,
      series: selectedSeriesName,
      size: selectedSize,
      year: selectedYear,
    }),
    [selectedBrandId, selectedModelName, selectedSeriesName, selectedSize, selectedYear],
  );

  useEffect(() => {
    const nextRequestId = bikeRequestId.current + 1;
    bikeRequestId.current = nextRequestId;
    let cancelled = false;

    galleryRef.current?.scrollTo({ behavior: "auto", top: 0 });

    const requestFrame = window.setTimeout(() => {
      setIsLoadingBikes(true);
      setBikes([]);
      setBikePage(1);
      setBikeHasMore(false);

      void loadBikePage(1)
        .then((result) => {
          if (cancelled || nextRequestId !== bikeRequestId.current) return;

          setBikes(result.items);
          setBikePage(result.pagination.page);
          setBikeHasMore(result.pagination.page < result.pagination.totalPages);
          setSelectedBrandId(result.filters.brandId);
          setSelectedSeriesName(result.filters.series);
          setSelectedModelName(result.filters.modelName);
          setSelectedYear(result.filters.year);
          setSelectedSize(result.filters.size);
        })
        .catch(() => {
          if (!cancelled && nextRequestId === bikeRequestId.current) {
            showToast({ message: "Unable to load matching bikes. Please try again.", tone: "error" });
          }
        })
        .finally(() => {
          if (!cancelled && nextRequestId === bikeRequestId.current) {
            setIsLoadingBikes(false);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(requestFrame);
    };
  }, [loadBikePage, showToast]);

  const loadMoreBikes = useCallback(async () => {
    if (isLoadingBikes || !bikeHasMore) return;

    const currentRequestId = bikeRequestId.current;
    const nextPage = bikePage + 1;
    setIsLoadingBikes(true);

    try {
      const result = await loadBikePage(nextPage);

      if (currentRequestId !== bikeRequestId.current) return;

      setBikes((current) => mergeCatalogItems(current, result.items));
      setBikePage(result.pagination.page);
      setBikeHasMore(result.pagination.page < result.pagination.totalPages);
    } catch {
      if (currentRequestId === bikeRequestId.current) {
        showToast({ message: "Unable to load more bikes. Please try again.", tone: "error" });
      }
    } finally {
      if (currentRequestId === bikeRequestId.current) {
        setIsLoadingBikes(false);
      }
    }
  }, [bikeHasMore, bikePage, isLoadingBikes, loadBikePage, showToast]);

  useEffect(() => {
    const loader = bikeLoaderRef.current;

    if (!loader || !bikeHasMore || isLoadingBikes) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadMoreBikes();
        }
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [bikeHasMore, isLoadingBikes, loadMoreBikes]);

  function handleBrandChange(value: string) {
    const brand = brandCatalog.items.find((item) => item.id === value);

    setSelectedBrandId(value);
    setSelectedBrandName(brand?.name ?? "");
  }

  function handleSeriesChange(value: string) {
    const series = seriesCatalog.items.find((item) => item.id === value);

    setSelectedSeriesId(value);
    setSelectedSeriesName(series?.name ?? "");
  }

  function handleModelChange(value: string) {
    const model = modelCatalog.items.find((item) => item.id === value);

    setSelectedModelId(value);
    setSelectedModelName(model?.name ?? "");
  }

  function clearBrand() {
    setSelectedBrandId("");
    setSelectedBrandName("");
  }

  function clearSeries() {
    setSelectedSeriesId("");
    setSelectedSeriesName("");
  }

  function clearModel() {
    setSelectedModelId("");
    setSelectedModelName("");
  }

  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Add your bikes to your garage so we can provide accurate maintenance, parts and recommendations."
        title="Add Your Bike"
      />

      <div className={styles.body}>
        <form className={styles.filters} noValidate>
          <SearchableSelectField
            className={styles.searchField}
            hasMore={brandCatalog.hasMore}
            id="bike-brand"
            info="Search by the manufacturer shown on your bike frame."
            isLoading={brandCatalog.isLoading}
            label="Bike Brand"
            name="bikeBrand"
            onClear={clearBrand}
            onLoadMore={brandCatalog.loadMore}
            onSearchChange={brandCatalog.setSearch}
            onValueChange={handleBrandChange}
            options={brandCatalog.items.map((brand) => ({ label: brand.name, value: brand.id }))}
            placeholder="Bike Brand"
            searchPlaceholder="Search for bike brand"
            searchValue={brandCatalog.search}
            selectedContent={selectedBrandName}
            value={selectedBrandId}
          />
          <SearchableSelectField
            className={styles.searchField}
            hasMore={seriesCatalog.hasMore}
            id="bike-series"
            info="Narrows the results to the product family your bike belongs to."
            isLoading={seriesCatalog.isLoading}
            label="Bike Series"
            name="bikeSeries"
            onClear={clearSeries}
            onLoadMore={seriesCatalog.loadMore}
            onSearchChange={seriesCatalog.setSearch}
            onValueChange={handleSeriesChange}
            options={seriesCatalog.items.map((series) => ({ label: series.name, value: series.id }))}
            placeholder="Bike Series"
            searchPlaceholder="Search for bike series"
            searchValue={seriesCatalog.search}
            selectedContent={selectedSeriesName}
            value={selectedSeriesId}
          />
          <SearchableSelectField
            className={styles.filterSelect}
            hasMore={modelCatalog.hasMore}
            id="bike-model"
            info="Select the exact model name printed on your bike or purchase record."
            isLoading={modelCatalog.isLoading}
            label="Bike Model"
            name="bikeModel"
            onClear={clearModel}
            onLoadMore={modelCatalog.loadMore}
            onSearchChange={modelCatalog.setSearch}
            onValueChange={handleModelChange}
            options={modelCatalog.items.map((model) => ({ label: model.name, value: model.id }))}
            placeholder="Bike Model"
            searchPlaceholder="Search for bike model"
            searchValue={modelCatalog.search}
            selectedContent={selectedModelName}
            value={selectedModelId}
          />
          <SearchableSelectField
            className={styles.filterSelect}
            hasMore={yearCatalog.hasMore}
            id="bike-year"
            info="Select the model year so specifications and compatible parts match your bike."
            isLoading={yearCatalog.isLoading}
            label="Year"
            name="bikeYear"
            onClear={() => setSelectedYear("")}
            onLoadMore={yearCatalog.loadMore}
            onSearchChange={yearCatalog.setSearch}
            onValueChange={setSelectedYear}
            options={yearCatalog.items.map((year) => ({ label: year.name, value: year.id }))}
            placeholder="Search for year"
            searchPlaceholder="Search for year"
            searchValue={yearCatalog.search}
            value={selectedYear}
          />
          <SearchableSelectField
            className={styles.filterSelect}
            hasMore={sizeCatalog.hasMore}
            id="frame-size"
            info="Select the frame size printed on the bike frame or purchase record."
            isLoading={sizeCatalog.isLoading}
            label="Frame Size"
            name="frameSize"
            onClear={() => setSelectedSize("")}
            onLoadMore={sizeCatalog.loadMore}
            onSearchChange={sizeCatalog.setSearch}
            onValueChange={setSelectedSize}
            options={sizeCatalog.items.map((size) => ({ label: size.name, value: size.id }))}
            placeholder="Search for frame size"
            searchPlaceholder="Search for frame size"
            searchValue={sizeCatalog.search}
            value={selectedSize}
          />

          <aside className={styles.help}>
            <div>
              <strong><Icon name="help-question" size={19} /> Can’t find your bike?</strong>
              <p>Raise a ticket so that we can help you find your bike.</p>
            </div>
            <Button fullWidth variant="secondary">
              Raise a Ticket
            </Button>
          </aside>
        </form>

        <div aria-busy={isLoadingBikes} aria-live="polite" className={styles.gallery} ref={galleryRef}>
          <span className={styles.loadingAnnouncement}>
            {isLoadingBikes ? "Loading matching bikes" : `${bikes.length} matching bikes loaded`}
          </span>
          <div className={styles.bikeGrid} role={isLoadingBikes ? undefined : "radiogroup"}>
            {isLoadingBikes && bikes.length === 0
              ? Array.from({ length: 6 }, (_, index) => <BikeSkeleton key={index} />)
              : bikes.map((bike) => (
                <BikeResultCard
                  bike={bike}
                  isSelected={bike.id === selectedBikeId}
                  key={`${bike.id}-${bike.image}`}
                  onSelectBike={onSelectBike}
                />
              ))}
          </div>
          {!isLoadingBikes && bikes.length === 0 && <p className={styles.emptyResults}>No bikes match these filters.</p>}
          {bikeHasMore && (
            <div aria-label="Loading more bikes" className={styles.listLoader} ref={bikeLoaderRef} role="status">
              <span aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <OnboardingActions onContinue={onContinue} onPrevious={onPrevious} onSkip={onSkip} />
    </section>
  );
}
