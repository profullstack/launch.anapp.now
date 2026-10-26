import { Footer as PfsFooter } from "@profullstack/footer/react";

// The Profullstack fleet footer, after the site's own footer:
//  1. @profullstack/footer: the << Profullstack >> webring row (rssamplifier.com
//     ring previous/next), copyright and the pit.world newsletter form. A server
//     component, so the ring verifier sees it in the HTML.
//  2. The clearnet network line ("launch.anapp.now is part of the Profullstack
//     network") from pit.world's footer snippet, fetched on the server and cached
//     for an hour. Any failure renders nothing: it must never break the page.
const SITE = "https://launch.anapp.now/";
const NET_FOOTER_URL = "https://pit.world/snippets/footer.html?site=launch.anapp.now";

async function NetFooter() {
  try {
    const res = await fetch(NET_FOOTER_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (!html.includes("data-net-footer") && !html.includes("data-pit-footer")) return null;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return null;
  }
}

export function FleetFooter() {
  return (
    <div className="fleet-foot">
      <PfsFooter site={SITE} />
      <NetFooter />
    </div>
  );
}
