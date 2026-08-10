"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { Problem } from "../content/problems";

const PAGE_SIZE = 8;
const ALL_TOPICS = "全部知识点";
const FAVORITES_KEY = "dakai-leetcode-favorites";
const FAVORITES_EVENT = "dakai-leetcode-favorites-changed";
type ViewFilter = "全部题目" | "已完成" | "收藏";

function completionTime(problem: Problem) {
  if (problem.status !== "completed") return Number.NEGATIVE_INFINITY;
  const parsed = Date.parse(problem.date.replaceAll(".", "-"));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function subscribeToFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function getFavoritesSnapshot() {
  try {
    return window.localStorage.getItem(FAVORITES_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function ProblemCatalog({ problems }: { problems: Problem[] }) {
  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [viewFilter, setViewFilter] = useState<ViewFilter>("全部题目");
  const [page, setPage] = useState(1);

  const favoritesSnapshot = useSyncExternalStore(subscribeToFavorites, getFavoritesSnapshot, () => "[]");
  const favoriteIds = useMemo(() => {
    try {
      const parsed = JSON.parse(favoritesSnapshot);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
    } catch {
      return [];
    }
  }, [favoritesSnapshot]);

  const chronologicalProblems = useMemo(
    () =>
      problems
        .map((problem, originalIndex) => ({ problem, originalIndex }))
        .sort((a, b) => {
          const dateDifference = completionTime(b.problem) - completionTime(a.problem);
          if (dateDifference !== 0) return dateDifference;
          return a.originalIndex - b.originalIndex;
        })
        .map(({ problem }) => problem),
    [problems],
  );

  const topics = useMemo(
    () => Array.from(new Set(problems.flatMap((problem) => problem.topics))),
    [problems],
  );

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filteredProblems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return chronologicalProblems.filter((problem) => {
      const matchesTopic = selectedTopics.every((topic) => problem.topics.includes(topic));
      const matchesView =
        viewFilter === "全部题目" ||
        (viewFilter === "已完成" && problem.status === "completed") ||
        (viewFilter === "收藏" && favoriteSet.has(problem.id));
      const matchesQuery =
        !normalized ||
        `${problem.id} ${problem.title} ${problem.titleZh} ${problem.topics.join(" ")}`
          .toLowerCase()
          .includes(normalized);
      return matchesTopic && matchesView && matchesQuery;
    });
  }, [chronologicalProblems, favoriteSet, query, selectedTopics, viewFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const visibleProblems = filteredProblems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function toggleTopicFilter(value: string) {
    setSelectedTopics((current) =>
      current.includes(value)
        ? current.filter((topic) => topic !== value)
        : [...current, value],
    );
    setPage(1);
  }

  function clearTopicFilters() {
    setSelectedTopics([]);
    setPage(1);
  }

  function updateViewFilter(value: ViewFilter) {
    setViewFilter(value);
    setPage(1);
  }

  function toggleFavorite(id: string) {
    const next = favoriteIds.includes(id)
      ? favoriteIds.filter((item) => item !== id)
      : [...favoriteIds, id];
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(FAVORITES_EVENT));
    } catch {
      // The rest of the catalog remains usable when storage is unavailable.
    }
  }

  function clearFilters() {
    setQuery("");
    setSelectedTopics([]);
    setViewFilter("全部题目");
    setPage(1);
  }

  return (
    <>
      <div className="problem-tools">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索题号、题名或知识点"
            aria-label="搜索题解"
          />
        </label>
        <div className="filter-cluster">
          <div className="filters filters-primary" aria-label="按记录状态筛选">
            {(["全部题目", "已完成", "收藏"] as ViewFilter[]).map((item) => (
              <button
                key={item}
                className={viewFilter === item ? "active" : ""}
                aria-pressed={viewFilter === item}
                onClick={() => updateViewFilter(item)}
              >
                {item === "收藏" ? `☆ 收藏 ${favoriteIds.length}` : item}
              </button>
            ))}
          </div>
          <span className="filter-divider" aria-hidden="true" />
          <div className="filters" aria-label="按知识点组合筛选">
            <button
              className={selectedTopics.length === 0 ? "active" : ""}
              aria-pressed={selectedTopics.length === 0}
              onClick={clearTopicFilters}
            >
              {ALL_TOPICS}
            </button>
            {topics.map((item) => (
              <button
                key={item}
                className={selectedTopics.includes(item) ? "active" : ""}
                aria-pressed={selectedTopics.includes(item)}
                onClick={() => toggleTopicFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-count">
        <span aria-live="polite">{String(filteredProblems.length).padStart(2, "0")} records</span>
        <span>
          {selectedTopics.length > 0
            ? `同时包含：${selectedTopics.join(" + ")}`
            : `按完成时间 · 最新优先 / 每页最多 ${PAGE_SIZE} 题`}
        </span>
      </div>

      <div className="problem-list">
        {visibleProblems.map((problem) => {
          const globalIndex = chronologicalProblems.findIndex((item) => item.id === problem.id) + 1;
          const isFavorite = favoriteSet.has(problem.id);
          const isCompleted = problem.status === "completed";

          return (
            <article
              className={`problem-row ${isCompleted ? "has-link" : "planned"}`}
              key={problem.id}
              aria-label={isCompleted ? undefined : `${problem.titleZh}尚未完成`}
            >
              {isCompleted && (
                <a
                  className="row-hit-area"
                  href={`/problems/${problem.slug}`}
                  aria-label={`阅读${problem.titleZh}题解`}
                />
              )}
              <div className="problem-index">{String(globalIndex).padStart(2, "0")}</div>
              <div className="problem-id">LC {problem.id}<span>{problem.date}</span></div>
              <div className="problem-title">
                <div className="badges">
                  <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                  {problem.topics.map((topic) => <span key={topic}>{topic}</span>)}
                </div>
                <h3>{problem.titleZh} <small>/ {problem.title}</small></h3>
                <p>{problem.note}</p>
              </div>
              <div className="problem-status">{problem.statusLabel}</div>
              <button
                className={`favorite-button ${isFavorite ? "active" : ""}`}
                type="button"
                aria-label={isFavorite ? `取消收藏${problem.titleZh}` : `收藏${problem.titleZh}`}
                aria-pressed={isFavorite}
                onClick={() => toggleFavorite(problem.id)}
              >
                {isFavorite ? "★" : "☆"}
              </button>
              <span className="row-arrow" aria-hidden="true">{isCompleted ? "↗" : "·"}</span>
            </article>
          );
        })}
        {visibleProblems.length === 0 && (
          <div className="empty-state">
            <span>00 / NO MATCH</span>
            <h3>{viewFilter === "收藏" ? "收藏夹还是空的" : "暂时没有匹配的记录"}</h3>
            <p>{viewFilter === "收藏" ? "点题目右侧的星标，之后就能从这里快速找回。" : "换一个题号、题名或知识点试试。"}</p>
            <button type="button" onClick={clearFilters}>清空筛选条件</button>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <nav className="pagination" aria-label="题解分页">
          <button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>← 上一页</button>
          <span>{page} / {pageCount}</span>
          <button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>下一页 →</button>
        </nav>
      )}
    </>
  );
}
