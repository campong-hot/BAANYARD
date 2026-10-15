# BAANYARD — Docker

ไซต์ static ใน `web/` รันด้วย **nginx:alpine** แล้วให้โฮสต์ทำ HTTPS

**URL จริง:** https://campong.online/projects/baanyard/

## รัน

จากรากโปรเจกต์ `BAANYARD/`:

```bash
docker compose up -d --build
```

ภายในเครื่องเปิด [http://localhost:8502/projects/baanyard/](http://localhost:8502/projects/baanyard/)  
(`localhost` เป็น secure context สำหรับกล้องได้)

บน **campong.online** คอนเทนเนอร์ฟังแค่ `127.0.0.1:8502` — ไม่เปิดพอร์ต 80/443 สาธารณะ

## Reverse proxy (`/projects/baanyard`)

โฮสต์ campong.online เป็น nginx + Let's Encrypt อยู่แล้ว (HTTP → HTTPS + HSTS)

แมปแบบเดียวกับ Picklung (ส่ง path เต็มเข้าคอนเทนเนอร์):

```nginx
# HTTP → HTTPS อยู่ที่ server :80 ของโฮสต์แล้ว
# TLS: ใบ cert ของ campong.online บนโฮสต์

location = /projects/baanyard {
    return 301 /projects/baanyard/;
}
location /projects/baanyard/ {
    proxy_pass http://127.0.0.1:8502;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
```

nginx ในคอนเทนเนอร์เสิร์ฟไฟล์ที่ `/projects/baanyard/` (ตรงกับ URL สาธารณะ)  
asset ใช้ relative path + `<base href="/projects/baanyard/">`

กล้อง (`getUserMedia`) ใช้ได้บน **https://campong.online/projects/baanyard/** เท่านั้น ไม่ใช่ HTTP สาธารณะ
