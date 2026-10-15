import type { Community, Host } from "./types";

export const communities: Community[] = [
  {
    "id": "sri-songkhram",
    "name": "Sri Songkhram",
    "nameTh": "ศรีสงคราม",
    "country": "Thailand",
    "countryCode": "TH",
    "blurb": "Indigo dye, riverside living, and homestays that feel like visiting relatives.",
    "blurbTh": "ย้อมคราม วิถีริมน้ำ และโฮมสเตย์ที่เหมือนไปเยี่ยมญาติ",
    "story": "Before dawn, indigo vats steam by the river. Guests wake to relatives-style breakfast, then help rinse cloth until the blue deepens. Evenings are for porch stories — not hotel lobbies.",
    "storyTh": "ก่อนรุ่งสาง หม้อครามริมน้ำเริ่มอุ่น ผู้เยี่ยมตื่นมากินเช้าแบบญาติ แล้วช่วยล้างผ้าจนสีเข้มขึ้น เย็นนี้คือเรื่องเล่าบนระเบียง — ไม่ใช่ล็อบบี้โรงแรม",
    "accent": "#3D5A80",
    "simulated": true
  },
  {
    "id": "chiang-khan",
    "name": "Chiang Khan riverside",
    "nameTh": "ริมโขงเชียงคาน",
    "country": "Thailand",
    "countryCode": "TH",
    "blurb": "Catch fish, sunset boats, porch music, and soft community care by the Mekong.",
    "blurbTh": "หาปลา เรือชมพระอาทิตย์ตก ดนตรีหน้าบ้าน และพื้นที่อบอุ่นริมโขง",
    "story": "Wooden walkways creak above the Mekong. Hosts mend nets at dawn, share grilled fish at dusk, and keep a porch open for neighbors who need company — Simulated demo of a riverside welcome.",
    "storyTh": "สะพานไม้ริมโขงดังเอี๊ยด โฮสต์ซ่อมแหตอนเช้า แชร์ปลาปิ้งตอนเย็น และเปิดระเบียงให้คนที่อยากมีเพื่อนคุย — เดโมวิถีต้อนรับริมน้ำ",
    "accent": "#4A6FA5",
    "simulated": true
  },
  {
    "id": "nan-orchard",
    "name": "Nan orchard hills",
    "nameTh": "สวนผลไม้เนินน่าน",
    "country": "Thailand",
    "countryCode": "TH",
    "blurb": "Pick fruit, taste garden cocoa, and slow mornings among misty hills.",
    "blurbTh": "เก็บผลไม้ ชิมโกโก้จากสวน และเช้าช้าๆ ท่ามกลางเนินหมอก",
    "story": "Orchard paths smell of ripe mango and drying cocoa. Guests fill a basket, grind beans by hand, and sit with hosts under shade trees — Simulated demo of highland hospitality.",
    "storyTh": "ทางเดินในสวนหอมมะม่วงสุกและโกโก้ตากแห้ง ผู้เยี่ยมเก็บใส่ตะกร้า บดเมล็ดด้วยมือ และนั่งกับโฮสต์ใต้ร่มไม้ — เดโมการต้อนรับบนเนินเขา",
    "accent": "#6B8F4E",
    "simulated": true
  },
  {
    "id": "phayao-lake",
    "name": "Phayao lake villages",
    "nameTh": "หมู่บ้านริมกว๊านพะเยา",
    "country": "Thailand",
    "countryCode": "TH",
    "blurb": "Birdwatching, soft yoga by the water, and quiet journaling mornings.",
    "blurbTh": "ดูนก โยคะเบาๆ ริมน้ำ และเช้าเขียนไดอารี่อย่างสงบ",
    "story": "Mist sits on the lake while birds skim the reeds. Hosts offer warm herbal tea, stretch mats under a tree, and space to breathe — Simulated demo for gentle countryside pause.",
    "storyTh": "หมอกนอนบนกว๊าน นกเฉียดต้นกก โฮสต์ชงชาสมุนไพร ปูเสื่อยืดเหยียดใต้ต้นไม้ และเปิดพื้นที่ให้หายใจ — เดโมช่วงพักชนบทอย่างอ่อนโยน",
    "accent": "#5A7D8C",
    "simulated": true
  },
  {
    "id": "luang-prabang",
    "name": "Luang Prabang outskirts",
    "nameTh": "ชานเมืองหลวงพระบาง",
    "country": "Laos",
    "countryCode": "LA",
    "blurb": "Temple mornings, river crafts, and quiet village kitchens.",
    "blurbTh": "เช้าวัด งานฝีมือริมน้ำ และครัวหมู่บ้านที่เงียบสงบ",
    "story": "Alms bowls pass at sunrise. Later, guests shape sticky rice and river herbs with a host family — a slow afternoon that feels like kinship, not a tour bus stop.",
    "storyTh": "เช้านี้บาตรเรียงกัน บ่ายผู้เยี่ยมปั้นข้าวเหนียวและสมุนไพรริมน้ำกับครอบครัวโฮสต์ — ช้าๆ เหมือนญาติ ไม่ใช่จุดจอดทัวร์",
    "accent": "#7A9E7E",
    "simulated": true
  },
  {
    "id": "sapa",
    "name": "Sapa terraces",
    "nameTh": "นาขั้นบันไดซาปา",
    "country": "Vietnam",
    "countryCode": "VN",
    "blurb": "Mountain walks, homegrown tea, and community storytelling.",
    "blurbTh": "เดินเขา ชาบ้าน และเรื่องราวจากชุมชน",
    "story": "Mist lifts over the terraces while a local guide names each ridge. Tea from the garden is poured with stories of harvest seasons — Simulated demo narrative.",
    "storyTh": "หมอกเหนือนาค่อยจาง ไกด์ท้องถิ่นชี้สันเขาทีละลูก ชาจากสวนถูกรินพร้อมเรื่องฤดูเก็บเกี่ยว — เรื่องเล่าจำลองสำหรับเดโม",
    "accent": "#5B8A72",
    "simulated": true
  },
  {
    "id": "shan-hills",
    "name": "Shan hills",
    "nameTh": "เนินเขาฉาน",
    "country": "Myanmar region (Demo)",
    "countryCode": "MM",
    "blurb": "Hill gardens, woven textiles, and slow hospitality.",
    "blurbTh": "สวนบนเนิน ผ้าทอ และการต้อนรับแบบช้าๆ",
    "story": "Looms click under bamboo roofs. Guests walk hill gardens, learn a weave pattern, and share a quiet meal — a Demo window into rural hospitality beyond cities.",
    "storyTh": "กี่ทอใต้หลังคาไผ่ ผู้เยี่ยมเดินสวนบนเนิน เรียนลายทอ และแชร์มื้อเงียบๆ — หน้าต่างเดโมสู่วิถีต้อนรับชนบท",
    "accent": "#6B8F71",
    "simulated": true
  },
  {
    "id": "island-coast",
    "name": "Island coast village",
    "nameTh": "หมู่บ้านชายฝั่งเกาะ",
    "country": "Island region (Demo)",
    "countryCode": "ID",
    "blurb": "Fishing mornings, palm shade, and relatives-style coastal stays.",
    "blurbTh": "เช้าหาปลา ร่มมะพร้าว และโฮมสเตย์ชายฝั่งแบบญาติ",
    "story": "Boats rest in shallow turquoise water while hosts share a simple coastal breakfast. Guests learn net mending and evening stories — Simulated demo narrative for island rural life.",
    "storyTh": "เรือจอดน้ำธาราใส โฮสต์แชร์อาหารเช้าชายฝั่ง ผู้เยี่ยมเรียนซ่อมแหและฟังเรื่องเย็น — เรื่องเล่าจำลองวิถีเกาะชนบท",
    "accent": "#4A7C8C",
    "simulated": true
  },
  {
    "id": "african-village",
    "name": "Savanna village market",
    "nameTh": "ตลาดหมู่บ้านสะวันนา",
    "country": "Africa region (Demo)",
    "countryCode": "XX",
    "blurb": "Open-air crafts, shade-tree welcome, and dignified rural hospitality.",
    "blurbTh": "งานฝีมือกลางแจ้ง ต้อนรับใต้ร่มไม้ และการต้อนรับชนบทอย่างภาคภูมิ",
    "story": "Under a wide shade tree, hosts greet travelers with handmade baskets and shared meals. The market is a meeting place — not a stage — Simulated demo for respectful rural exchange.",
    "storyTh": "ใต้ร่มไม้กว้าง โฮสต์ต้อนรับด้วยตะกร้าทำมือและมื้อร่วม ตลาดคือที่พบปะ — ไม่ใช่เวที — เดโมการแลกเปลี่ยนชนบทอย่างเคารพ",
    "accent": "#A67C52",
    "simulated": true
  }
];

export const hosts: Host[] = [
  {
    "id": "host-mae-wan",
    "name": "Mae Wan",
    "nameTh": "แม่หวาน",
    "communityId": "sri-songkhram",
    "primaryLanguage": "th",
    "bio": "Indigo artisan hosting relatives-style stays by the river.",
    "bioTh": "ช่างย้อมคราม เปิดบ้านต้อนรับแบบญาติริมน้ำ",
    "simulated": true
  },
  {
    "id": "host-boun",
    "name": "Boun",
    "nameTh": "บุญ",
    "communityId": "luang-prabang",
    "primaryLanguage": "en",
    "bio": "Village cook sharing river recipes with travelers.",
    "bioTh": "พ่อครัวหมู่บ้านแบ่งปันสูตรอาหารริมน้ำ",
    "simulated": true
  },
  {
    "id": "host-dr-nim",
    "name": "Nim",
    "nameTh": "นิ่ม",
    "communityId": "sri-songkhram",
    "primaryLanguage": "th",
    "bio": "Community psychologist hosting joyful outdoor wellness & peer circles (Demo — not a clinic).",
    "bioTh": "นักจิตวิทยาชุมชน จัดกิจกรรมสุขภาพใจกลางแจ้งและวงแชร์ประสบการณ์ (เดโม — ไม่ใช่คลินิก)",
    "simulated": true
  },
  {
    "id": "host-lung-chai",
    "name": "Lung Chai",
    "nameTh": "ลุงชัย",
    "communityId": "chiang-khan",
    "primaryLanguage": "th",
    "bio": "Riverside fisher who teaches guests to catch and cook fish with the family.",
    "bioTh": "ชาวประมงริมโขง สอนหาปลาและทำอาหารกับครอบครัว",
    "simulated": true
  },
  {
    "id": "host-mae-dao",
    "name": "Mae Dao",
    "nameTh": "แม่ดาว",
    "communityId": "nan-orchard",
    "primaryLanguage": "th",
    "bio": "Orchard host for fruit picking, garden cocoa, and warm coffee mornings.",
    "bioTh": "โฮสต์สวนผลไม้ พาเก็บผล ทำโกโก้จากสวน และชิมกาแฟอุ่นๆ",
    "simulated": true
  },
  {
    "id": "host-kru-pla",
    "name": "Kru Pla",
    "nameTh": "ครูปลา",
    "communityId": "sri-songkhram",
    "primaryLanguage": "th",
    "bio": "Kids nature guide — walks, bamboo craft, and weaving workshops for little hands.",
    "bioTh": "ไกด์ธรรมชาติสำหรับเด็ก — เดินป่า งานไผ่ และเวิร์กช็อปทอผ้าสำหรับมือน้อยๆ",
    "simulated": true
  },
  {
    "id": "host-aoy",
    "name": "Aoy",
    "nameTh": "ออย",
    "communityId": "chiang-khan",
    "primaryLanguage": "th",
    "bio": "Evening porch musician — acoustic sets and sing-alongs for neighbors and guests.",
    "bioTh": "นักดนตรีหน้าบ้านตอนเย็น — เซ็ตอคูสติกและร้องเพลงด้วยกันกับเพื่อนบ้าน",
    "simulated": true
  },
  {
    "id": "host-som",
    "name": "Som",
    "nameTh": "ส้ม",
    "communityId": "phayao-lake",
    "primaryLanguage": "th",
    "bio": "Lake-side host for birdwatching, soft stretch, and quiet journaling mornings.",
    "bioTh": "โฮสต์ริมกว๊าน พาดูนก ยืดเหยียดเบาๆ และเช้าเขียนไดอารี่อย่างสงบ",
    "simulated": true
  },
  {
    "id": "host-lin",
    "name": "Lin",
    "nameTh": "ลิน",
    "communityId": "sapa",
    "primaryLanguage": "en",
    "bio": "Terrace guide sharing harvest seasons, herbal tea, and hillside storytelling.",
    "bioTh": "ไกด์นาขั้นบันได แบ่งปันฤดูเก็บเกี่ยว ชาสมุนไพร และเรื่องเล่าบนเนิน",
    "simulated": true
  }
];
