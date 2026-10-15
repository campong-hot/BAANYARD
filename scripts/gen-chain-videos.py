"""Ken Burns MP4s from web/images/chain-*.png (muted H.264). Lemonade has no video API."""
from __future__ import annotations

import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "web" / "images"
OUT = ROOT / "web" / "videos"
APP = ROOT / "App" / "public" / "videos"

CHAIN_IDS = [
    "skn-sato",
    "skn-indigo",
    "skn-plara",
    "lei-fishsauce",
    "lei-herb",
    "lei-honey",
    "nan-cocoa",
    "nan-preserve",
    "nan-coffee",
    "pyo-tea",
    "pyo-silk",
    "pyo-rice",
    "cnx-coffee",
    "cnx-silk",
    "cnx-herb",
    "srt-cocoa",
    "srt-preserve",
    "srt-honey",
    "ubn-silk",
    "ubn-indigo",
    "ubn-rice",
]

VARIANTS = [
    ("min(1+0.001*on,1.1)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
    ("min(1+0.0012*on,1.12)", "(iw-iw/zoom)*0.22", "ih/2-(ih/zoom/2)"),
    ("min(1+0.0009*on,1.08)", "iw/2-(iw/zoom/2)", "(ih-ih/zoom)*0.28"),
]


def encode(index: int, chain_id: str) -> Path:
    inp = SRC / f"chain-{chain_id}.png"
    if not inp.is_file():
        raise FileNotFoundError(inp)
    dest = OUT / f"chain-{chain_id}.mp4"
    fps = 24
    dur = 4.5
    frames = int(fps * dur)
    z, x, y = VARIANTS[index % 3]
    vf = (
        f"scale=960:540:force_original_aspect_ratio=increase,crop=960:540,"
        f"zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s=640x360:fps={fps}"
    )
    cmd = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-loop",
        "1",
        "-i",
        str(inp),
        "-vf",
        vf,
        "-t",
        str(dur),
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "30",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(dest),
    ]
    subprocess.check_call(cmd)
    return dest


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    APP.mkdir(parents=True, exist_ok=True)
    errors = []
    with ThreadPoolExecutor(max_workers=3) as pool:
        futs = {pool.submit(encode, i, cid): cid for i, cid in enumerate(CHAIN_IDS)}
        for fut in as_completed(futs):
            cid = futs[fut]
            try:
                dest = fut.result()
                shutil.copy2(dest, APP / dest.name)
                print(f"ok {cid} {dest.stat().st_size}")
            except Exception as exc:
                errors.append(f"{cid}: {exc}")
                print(f"fail {cid}: {exc}", file=sys.stderr)
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
