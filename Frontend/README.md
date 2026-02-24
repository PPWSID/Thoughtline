# Thoughtline - Frontend

Thoughtline เป็นโครงการเว็บไซต์บทความสมัยใหม่ พัฒนาด้วยเทคโนโลยีล่าสุดเพื่อให้ได้ประสิทธิภาพและความปลอดภัยสูงสุด

## 📂 Exhaustive Project Structure

โครงสร้างโฟลเดอร์และหน้าที่ของแต่ละไฟล์ในโปรเจกต์ (ยกเว้นโฟลเดอร์ data):

### 📁 Root Directory

- `.env`: เก็บตัวแปรสภาพแวดล้อม (Environment Variables) เช่น `VITE_API_URL`
- `index.html`: ไฟล์ HTML หลักที่เป็นจุดเริ่มต้นของแอปพลิเคชัน
- `package.json`: รายการไลบรารีที่ใช้ (Dependencies) และคำสั่งสคริปต์ต่างๆ
- `tailwind.config.js`: การตั้งค่าธีม สี และฟอนต์สำหรับ Tailwind CSS
- `tsconfig.json`: การตั้งค่า TypeScript สำหรับโปรเจกต์
- `vite.config.ts`: การตั้งค่าสำหรับ Vite Bundler

---

### � `src/` - Source Code

โฟลเดอร์หลักสำหรับเก็บโค้ดการทำงานทั้งหมด:

#### 📂 `src/components/` - คอมโพเนนท์ส่วนกลาง

- `ArticleCard.tsx`: การ์ดแสดงพรีวิวบทความ พร้อมปุ่ม Favorite
- `Footer.tsx`: ส่วนท้ายของเว็บไซต์
- `Navbar.tsx`: แถบนำทางด้านบน (Navigation Bar) ที่เปลี่ยนตามสิทธิ์ผู้ใช้
- `ProtectedRoute.tsx`: ตัวป้องกัน Route ที่ต้องล็อกอินก่อนถึงจะเข้าได้

#### � `src/pages/` - หน้าเพจหลัก (Routes)

- `ArticleDetail.tsx`: หน้าอ่านเนื้อหาบทความแบบเต็ม
- `ArticleList.tsx`: หน้าแรกแสดงรายการบทความทั้งหมด
- `Auth.tsx`: หน้าล็อกอินและสมัครสมาชิก
- `CreateArticle.tsx`: หน้าเขียนบทความใหม่ หรือแก้ไขบทความเดิม
- `Favorites.tsx`: หน้าแสดงรายการบทความที่ชื่นชอบ
- `MyArticles.tsx`: หน้าจัดการบทความส่วนตัวของผู้เขียน
- `Profile.tsx`: หน้าโปรไฟล์และการตั้งค่าผู้ใช้

#### 📂 `src/service/` - การเชื่อมต่อ API

- `articleservice.ts`: ฟังก์ชันสำหรับจัดการข้อมูลบทความ (Get, Create, Update, Delete)
- `favoriteservice.ts`: ฟังก์ชันสำหรับระบบรายการโปรด (Toggle, Check Status)
- `userservice.ts`: ฟังก์ชันสำหรับระบบผู้ใช้ (Login, Register, Profile)

#### 📂 `src/httpsRequest/` - การตั้งค่าการส่งข้อมูล (HTTP)

- `createHttpRequest.ts`: การสร้าง Axios Instance ที่ตั้งค่า `withCredentials: true` เพื่อรองรับ Cookie
- `index.ts`: จุดส่งออก (Export) ตัว Axios ที่ตั้งค่าสำเร็จรูปแล้ว

#### 📂 `src/types/` - ไทป์และอินเตอร์เฟส

- `article.ts`: กำหนดโครงสร้างข้อมูล (Type Definition) ของบทความทั่วทั้งระบบ

---

### 📄 ไฟล์หลักใน `src/`

- `App.tsx`: จุดรวมการกำหนดเส้นทาง (Routing) และการจัดวาง Layout หลัก
- `AuthContext.tsx`: ระบบ Global State สำหรับจัดการข้อมูลผู้ใช้และระบบล็อกอิน
- `main.tsx`: ไฟล์ Entry Point ของ React ที่รันแอปเข้ากับไฟล์ HTML
- `index.css`: ไฟล์ CSS หลักที่เก็บ Tailwind Directives และ Custom Styles เช่น Glassmorphism

---

## �️ Tech Stack หลัก

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

---

_README นี้ถูกสร้างขึ้นเพื่ออธิบายโครงสร้างโปรเจกต์ Frontend ของ Thoughtline อย่างครบถ้วน_
