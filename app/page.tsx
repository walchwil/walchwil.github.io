import { ProblemCatalog } from "../components/problem-catalog";
import { SiteHeader } from "../components/site-header";
import { completedProblems, problems } from "../content/problems";

export default function Home() {
  const completedCount = completedProblems.length;
  const currentProblem = completedProblems.at(-1);
  const currentFocus = currentProblem?.topics[0] ?? "基础结构";
  const currentTag = currentProblem?.article?.focusTag ?? "base";
  const currentDescription = currentProblem?.article?.focusDescription ?? "从基础概念出发，把新题拆成可以解释的结构。";

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-main">
          <p className="eyebrow"><span>{String(completedCount).padStart(2, "0")}</span> 从基础出发的刷题实验</p>
          <h1>不背题解。<br /><em>建立能迁移的直觉。</em></h1>
          <p className="hero-lede">
            这里记录的不是一串 AC，而是我如何把陌生术语拆回基础结构、
            如何从暴力解法走向更好的思路，以及每次卡住后真正补上的东西。
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#problems">浏览题册 <span>↘</span></a>
            <a className="text-action" href="#method">我的刷题原则</a>
          </div>
        </div>

        <aside className="focus-card" aria-label="当前学习焦点">
          <div className="focus-orbit"><span>{currentTag}</span></div>
          <p className="focus-label">CURRENT FOCUS / 当前焦点</p>
          <h2>{currentFocus}</h2>
          <p>{currentDescription}</p>
          <dl>
            <div><dt>Hot 100</dt><dd>{completedCount} / 100</dd></div>
            <div><dt>语言</dt><dd>Python</dd></div>
          </dl>
        </aside>
      </section>

      <section className="ticker" aria-label="学习状态">
        <div><span>{String(completedCount).padStart(2, "0")}</span> 已完成</div>
        <div><span>{String(100 - completedCount).padStart(2, "0")}</span> 待探索</div>
        <div><span>1 → 100</span> 持续生长</div>
        <p>每题独立成页，目录永远轻盈。</p>
      </section>

      <section className="problem-section" id="problems">
        <div className="section-heading">
          <div>
            <p className="kicker">THE PROBLEM INDEX</p>
            <h2>Hot 100 题册</h2>
          </div>
          <p>首页只做索引。点击已完成题目，进入它自己的阅读空间。</p>
        </div>
        <ProblemCatalog problems={problems} />
      </section>

      <section className="method-section" id="method">
        <div className="method-statement">
          <p className="kicker">HOW I PRACTICE</p>
          <h2>充分刷题经验<br />伴我行。</h2>
          <p>我不把博客当答案仓库，而把它当成一份逐渐变清晰的认知地图。</p>
        </div>
        <div className="method-list">
          <article><span>01</span><div><h3>先补一小块基础</h3><p>遇到新结构或算法，先给出正式定义，再把它映射到题目里的具体对象。</p></div></article>
          <article><span>02</span><div><h3>保留思路是怎么长出来的</h3><p>从第一反应开始，明确暴力解法哪里重复，优化到底消除了什么工作。</p></div></article>
          <article><span>03</span><div><h3>只学当下真正需要的 Python</h3><p>每题顺手积累一两个语法或 API，让实现能力和算法直觉一起增长。</p></div></article>
          <article><span>04</span><div><h3>刷完即归档</h3><p>每次讨论结束，自动整理成独立题解页；首页只增加一个入口。</p></div></article>
        </div>
      </section>

      <footer id="about">
        <div className="footer-mark">D.</div>
        <div>
          <p className="kicker">ABOUT THIS LOG</p>
          <h2>一名 AI 学习者的<br />算法基础建设现场。</h2>
        </div>
        <p className="footer-copy">持续更新于 2026<br />Built with questions, not shortcuts.</p>
        <a href="#top" aria-label="返回顶部">↑</a>
      </footer>
    </main>
  );
}
