
import html2canvas from "html2canvas";

function proxify(originalUrl: string): string {
  const stripped = originalUrl.replace(/^https?:\/\//, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&output=png`;
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(proxify(url));
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadBouquetPng(
  node: HTMLElement,
  filename = `buque-${Date.now()}.png`,
) {
  const imgs = Array.from(
    node.querySelectorAll<HTMLImageElement>("img[data-bouquet-img]"),
  ).filter((img) => img.style.display !== "none");

  const uniqueUrls = Array.from(new Set(imgs.map((i) => i.src)));

  const entries = await Promise.all(
    uniqueUrls.map(async (url) => [url, await fetchAsDataUrl(url)] as const),
  );
  const map = new Map<string, string>();
  for (const [url, dataUrl] of entries) {
    if (dataUrl) map.set(url, dataUrl);
  }

  const canvas = await html2canvas(node, {
    backgroundColor: "#fcfbf8",
    scale: 2,
    useCORS: false,
    allowTaint: false,
    logging: false,
    onclone: (_doc, clonedNode) => {
      const clonedImgs = clonedNode.querySelectorAll<HTMLImageElement>(
        "img[data-bouquet-img]",
      );
      clonedImgs.forEach((img) => {
        const replacement = map.get(img.src);
        if (replacement) {
          img.src = replacement;
        }
      });
    },
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
