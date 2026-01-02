# 🍯 Pharma Ruche - مناحل أسامة الصغير

Professional e-commerce website for natural honey and bee products.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example file
   copy .env.example .env
   
   # Edit .env and add your configuration
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

## ⚙️ Configuration

Edit `.env` file to customize:
- Admin password
- Contact information
- Social media links

## 🔐 Admin Panel Access

**⚠️ IMPORTANT SECURITY NOTICE:**

The current admin panel is a basic client-side implementation suitable for small projects. For production use with sensitive data:

1. **Recommended:** Use a separate admin dashboard with proper backend authentication
2. **Alternative:** Implement server-side authentication with JWT tokens
3. **Current limitation:** Data stored in browser localStorage (not persistent across devices)

### Accessing Admin Panel
- Click "Admin" button in navigation bar
- Default password: Set in `.env` file (VITE_ADMIN_PASSWORD)

## 📱 Features

- ✅ Multilingual (Arabic, French, English)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Product catalog
- ✅ Customer reviews
- ✅ Contact form
- ✅ Admin panel for content management

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **localStorage** - Client-side data storage

## 📞 Support

For customization requests or issues, contact your developer.

---

Made with ❤️ for Pharma Ruche
