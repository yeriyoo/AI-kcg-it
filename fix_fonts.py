from pathlib import Path
from fontTools.ttLib import TTFont

source_dir = Path("fonts")
output_dir = Path("fonts-fixed")

output_dir.mkdir(exist_ok=True)

font_paths = sorted(source_dir.glob("Pretendard-*.woff2"))

if not font_paths:
    raise SystemExit("fonts 폴더에서 Pretendard WOFF2 파일을 찾지 못했습니다.")

for source in font_paths:
    with TTFont(source) as font:
        font["name"].names.sort(
            key=lambda record: (
                record.platformID,
                record.platEncID,
                record.langID,
                record.nameID,
            )
        )

        font.flavor = "woff2"
        destination = output_dir / source.name
        font.save(destination)

    print(f"저장 완료: {destination}")