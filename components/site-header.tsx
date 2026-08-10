type SiteHeaderProps = {
  inverse?: boolean;
};

export function SiteHeader({ inverse = false }: SiteHeaderProps) {
  return (
    <header className={`site-header${inverse ? " inverse" : ""}`}>
      <a className="brand" href="/" aria-label="返回题解目录">
        <span className="brand-mark">D.</span>
        <span className="brand-copy">algorithm<br />field notes</span>
      </a>
      <nav aria-label="主导航">
        <a href="/#problems">题解</a>
        <a href="/#method">方法</a>
        <a href="/#about">关于</a>
      </nav>
      <div className="issue">HOT 100 · BUILDING IN PUBLIC</div>
    </header>
  );
}
