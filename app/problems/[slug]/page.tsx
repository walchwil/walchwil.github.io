import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyCodeButton } from "../../../components/copy-code-button";
import { SiteHeader } from "../../../components/site-header";
import { completedProblems, getProblemBySlug } from "../../../content/problems";

type ProblemPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return completedProblems.map((problem) => ({ slug: problem.slug }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return {};

  return {
    title: `${problem.id}. ${problem.titleZh} | Dakai 的 LeetCode 刷题博客`,
    description: problem.note,
  };
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem?.article) notFound();

  const article = problem.article;
  const currentIndex = completedProblems.findIndex((item) => item.slug === problem.slug);
  const previous = completedProblems[currentIndex - 1];
  const next = completedProblems[currentIndex + 1];

  return (
    <main className="article-page">
      <SiteHeader inverse />

      <div className="reading-toolbar">
        <a href="/#problems">← 返回 Hot 100 题册</a>
        <span>{String(currentIndex + 1).padStart(2, "0")} / {String(completedProblems.length).padStart(2, "0")} 已发布</span>
      </div>

      <article className="featured-article">
        <header className="article-header">
          <div className="article-number">{problem.id}</div>
          <div className="article-title-block">
            <p className="kicker">{article.focus}</p>
            <h1>{problem.titleZh}</h1>
            <p className="article-en">{problem.title} — {article.subtitle}</p>
          </div>
          <div className="article-meta">
            <span>{problem.date}</span>
            <span>{article.readTime}</span>
            <span>PYTHON</span>
          </div>
        </header>

        <div className="article-grid">
          <aside className="article-aside">
            <p>这题补上的基础</p>
            <a href="#definition">01 / {article.foundation.name.replace("？", "")}</a>
            <a href="#translation">02 / 思路如何转向</a>
            <a href="#solution">03 / 最终实现</a>
            <a href="#takeaway">04 / 可迁移的认识</a>
          </aside>

          <div className="article-body">
            <section className="article-intro">
              <p className="drop-cap">{article.essence}</p>
              <div className="equation-card">
                <span>{article.equation.currentLabel}</span><b>{article.equation.current}</b><i>{article.equation.operator}</i>
                <span>{article.equation.neededLabel}</span><b>{article.equation.needed}</b><i>{article.equation.relation}</i><b>{article.equation.target}</b>
              </div>
            </section>

            <section className="lesson-block" id="definition">
              <div className="lesson-marker">01</div>
              <div>
                <p className="lesson-label">TEXTBOOK DEFINITION</p>
                <h2>{article.foundation.name}</h2>
                <p>{article.foundation.definition}</p>
                <div className="demystify">
                  <span>去掉术语</span>
                  <p>{article.foundation.mapping}</p>
                </div>
              </div>
            </section>

            <section className="translation" id="translation">
              <div>
                <p className="lesson-label">{article.initialApproach.label}</p>
                <h2>{article.initialApproach.title}</h2>
                <p>{article.initialApproach.description}</p>
                <strong>{article.initialApproach.complexity}</strong>
              </div>
              <div className="turn-arrow">→</div>
              <div className="better-path">
                <p className="lesson-label">{article.optimizedApproach.label}</p>
                <h2>{article.optimizedApproach.title}</h2>
                <p>{article.optimizedApproach.description}</p>
                <strong>{article.optimizedApproach.complexity}</strong>
              </div>
            </section>

            <section className="solution-block" id="solution">
              <div className="solution-heading">
                <div>
                  <p className="lesson-label">FINAL IMPLEMENTATION</p>
                  <h2>{article.codeTitle}</h2>
                </div>
                <CopyCodeButton code={article.code} />
              </div>
              <pre><code>{article.code}</code></pre>
              <div className="syntax-note">
                <span>PYTHON 小补丁</span>
                <p>{article.syntaxNote}</p>
              </div>
            </section>

            <section className="takeaway" id="takeaway">
              <p className="lesson-label">WHAT ACTUALLY STUCK</p>
              <h2>这道题真正留下的，不是一个模板</h2>
              <ol>
                {article.takeaways.map((takeaway, index) => (
                  <li key={takeaway.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p><b>{takeaway.title}</b>{takeaway.detail}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </article>

      <nav className="problem-switcher" aria-label="题解前后导航">
        {previous ? <a href={`/problems/${previous.slug}`}>← {previous.titleZh}</a> : <span>这是第一篇题解</span>}
        <a className="index-link" href="/#problems">查看全部题目</a>
        {next ? <a href={`/problems/${next.slug}`}>{next.titleZh} →</a> : <span>下一题，等你解锁 →</span>}
      </nav>
    </main>
  );
}
