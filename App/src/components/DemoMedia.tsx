import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Props = {
  src: string;
  videoSrc?: string;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
  "data-kind"?: string;
  alt?: string;
  children?: ReactNode;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Tries a public image; optional muted loop video with PNG poster. */
export function DemoMedia({ src, videoSrc, eager, className, style, alt = "", children, ...rest }: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showVideo = Boolean(videoSrc) && !videoFailed && !prefersReducedMotion();

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !showVideo || !videoSrc) return;

    const loadAndPlay = () => {
      if (!node.getAttribute("src")) node.src = videoSrc;
      node.muted = true;
      void node.play().catch(() => {});
    };

    if (eager || !("IntersectionObserver" in window)) {
      loadAndPlay();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) loadAndPlay();
          else node.pause();
        }
      },
      { rootMargin: "96px 0px", threshold: 0.12 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [eager, showVideo, videoSrc]);

  if (imgFailed && !showVideo) {
    return (
      <div className={className} style={style} aria-hidden {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={style} {...rest}>
      {!imgFailed ? (
        <img
          src={src}
          alt={alt}
          className="demo-media__img"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      ) : null}
      {showVideo ? (
        <video
          ref={videoRef}
          className="demo-media__img demo-media__video"
          poster={src}
          muted
          loop
          playsInline
          autoPlay={Boolean(eager)}
          preload={eager ? "metadata" : "none"}
          aria-hidden
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      {children}
    </div>
  );
}
