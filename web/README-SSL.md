# SSL + กล้องบน campong.co.th

`getUserMedia` (เปิดกล้อง/ไมค์) ทำงานได้เฉพาะ **secure context** — คือ **HTTPS** หรือ `http://localhost`  
ถ้าเปิดด้วย `http://` ธรรมดา ปุ่มกล้องจะแจ้งว่าต้องใช้ HTTPS และจะไม่พังแอป

---

## 1) อัปโหลดอะไร

อัปโหลด**ทั้งเนื้อหาในโฟลเดอร์ `web/`** ไปที่ document root ของโดเมน เช่น:

- `public_html/` สำหรับ `campong.co.th` หรือ
- โฟลเดอร์ subdomain / addon domain ที่ชี้มาที่โดเมนนี้

ต้องมีอย่างน้อย:

| รายการ | หมายเหตุ |
|--------|----------|
| `index.html` | รากของไซต์ |
| `css/`, `js/`, `data/`, `images/` | path แบบ relative ทั้งหมด |
| `.htaccess` | บังคับ HTTPS + อนุญาต camera/microphone (Apache/cPanel) |
| `site.webmanifest` | start_url แบบ relative (`./`) |

ไม่ต้อง `npm install` / ไม่ต้อง build

---

## 2) เปิด SSL (Let's Encrypt) บน cPanel

1. ใน cPanel เปิด **SSL/TLS Status** หรือ **Let's Encrypt™ SSL**
2. เลือกโดเมน **campong.co.th** (และ www ถ้ามี) → **Issue / Run AutoSSL**
3. รอจนสถานะเป็น Active / Issued
4. ใน **Domains** ให้โดเมนชี้ document root ไปที่โฟลเดอร์ที่อัปโหลด `web/` ไว้
5. เปิด `https://campong.co.th` — ต้องเห็นแม่กุญแจ / ไม่มีคำเตือน certificate

`.htaccess` จะ redirect `http://…` → `https://…` โดย**คง hostname เดิม** (ไม่บังคับ www หรือตัด subdomain ผิดพลาด)  
ถ้าต้องการให้ www และ non-www เป็นตัวเดียวกัน ให้ตั้ง redirect ใน cPanel Domains ตามที่ต้องการ

---

## 3) ทดสอบกล้อง

1. เปิด `https://campong.co.th` (หรือ subdomain ที่ติด SSL แล้ว)
2. เข้าเดโม Guest → โปรไฟล์โฮสต์หรือรายการ → **วิดีโอคอล**
3. กด **เปิดกล้อง / Start camera** → อนุญาตกล้อง+ไมค์ในเบราว์เซอร์
4. ควรเห็นพรีวิวสดในแผงวิดีโอ
5. กด **วางสาย** — กล้องต้องดับ (ไฟกล้อง/indicator ปิด)

ถ้ายังเป็น `http://` จะเห็นข้อความว่าต้องใช้ HTTPS (ไทย+อังกฤษ)

ทดสอบบนเครื่อง: `localhost` นับเป็น secure context ได้ — `npx serve web -l 3000` แล้วเปิด `http://localhost:3000`

---

## 4) Netlify / Cloudflare Pages (ทางเลือก)

- Publish directory = `web`
- ใช้ `_headers` หรือ `netlify.toml` สำหรับ `Permissions-Policy: camera=(self), microphone=(self)`
- ผูก custom domain `campong.co.th` แล้วรอ certificate

---

## Checklist สั้นๆ

- [ ] อัปโหลดทั้ง `web/` รวม `.htaccess`
- [ ] AutoSSL / Let's Encrypt Active บน campong.co.th
- [ ] เปิดได้ที่ `https://campong.co.th`
- [ ] Guest → Video call → Start camera ได้พรีวิว
- [ ] End call ปิดแทร็กกล้องแล้ว
