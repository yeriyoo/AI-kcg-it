
from pathlib import Path
from fontTools.ttLib import TTFont

source_dir = Path("./fonts")
output_dir = Path("./fonts-test")
output_dir.mkdir(exist_ok=True)

for source in sorted(source_dir.glob("Pretendard-*.woff2")):
    print(f"처리 중: {source.name}")

    font = TTFont(source)
    font.flavor = "woff2"

    destination = output_dir / source.name
    font.save(destination)
    font.close()

    # 저장된 파일을 다시 열어 구조 확인
    test_font = TTFont(destination)
    assert "name" in test_font
    test_font.close()

    print(f"완료: {destination}")

print("모든 폰트 처리 완료")
