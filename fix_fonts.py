from pathlib import Path
from fontTools.ttLib import TTFont

font_files = [
    "Pretendard-Regular.woff2",
    "Pretendard-Medium.woff2",
    "Pretendard-SemiBold.woff2",
    "Pretendard-Bold.woff2",
]

font_dir = Path("./fonts")
output_dir = Path("./fonts-fixed")
output_dir.mkdir(exist_ok=True)

for filename in font_files:
    source = font_dir / filename

    font = TTFont(source)

    name_table = font["name"]

    name_table.names.sort(
        key=lambda record: (
            record.platformID,
            record.platEncID,
            record.langID,
            record.nameID,
        )
    )

    font.save(output_dir / filename)
    font.close()

    print(f"완료: {filename}")