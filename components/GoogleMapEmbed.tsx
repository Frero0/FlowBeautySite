type GoogleMapEmbedProps = {
  address: string;
  className?: string;
};

const buildEmbedUrl = (address: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const buildLinkUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export function GoogleMapEmbed({ address, className }: GoogleMapEmbedProps) {
  const mapSrc = buildEmbedUrl(address);
  const linkHref = buildLinkUrl(address);

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-nude-100 ring-1 ring-ink/5">
        <iframe
          title={`Mappa ${address}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-ink/70">
        <a
          href={linkHref}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 hover:text-ink"
        >
          Apri in Google Maps
        </a>
        <noscript>
          <a
            href={linkHref}
            className="rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold text-ink"
            target="_blank"
            rel="noreferrer"
          >
            Apri in Google Maps
          </a>
        </noscript>
      </div>
    </div>
  );
}
