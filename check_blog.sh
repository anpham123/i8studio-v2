echo "=== Testing blog detail routes ==="
# Test each slug
for slug in "cg" "architectural-perspective-basics" "mastering-architectural-cg-process"; do
  code=$(docker exec i8studio_app wget -q -O /dev/null -S "http://localhost:3000/ja/blogs/$slug" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')
  echo "  /ja/blogs/$slug => HTTP $code"
done

# Test the Unicode slug  
code=$(docker exec i8studio_app wget -q -O /dev/null -S "http://localhost:3000/ja/blogs/%E5%BB%BA%E7%AF%89%E3%83%8F%E3%82%9A%E3%83%BC%E3%82%B9%E3%81%AE%E5%88%B6%E4%BD%9C%E3%83%95%E3%83%AD%E3%83%BC" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')
echo "  /ja/blogs/建築パースの制作フロー (decomposed) => HTTP $code"

# Test with NFC normalized
code=$(docker exec i8studio_app wget -q -O /dev/null -S "http://localhost:3000/ja/blogs/%E5%BB%BA%E7%AF%89%E3%83%91%E3%83%BC%E3%82%B9%E3%81%AE%E5%88%B6%E4%BD%9C%E3%83%95%E3%83%AD%E3%83%BC" 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')
echo "  /ja/blogs/建築パースの制作フロー (NFC composed) => HTTP $code"

echo ""
echo "=== Check middleware ==="
docker exec i8studio_app ls middleware* src/middleware* 2>&1
echo "=== Check next.config ==="
docker exec i8studio_app cat next.config.mjs 2>/dev/null || docker exec i8studio_app cat next.config.js 2>/dev/null
