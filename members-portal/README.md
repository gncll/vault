# LearnAI Premium Members Portal

A premium content portal for LearnAI Substack subscribers. This website provides exclusive access to Custom GPTs, Project Guides (PDFs), and a Prompt Library.

## Features

- 🔐 **Authentication** - Clerk-powered user authentication
- 💳 **Subscription Verification** - Stripe integration to verify premium Substack subscriptions
- 🤖 **Custom GPTs** - Direct links to specialized AI assistants
- 📁 **Project Guides** - PDF viewer for comprehensive project documentation
- ✨ **Prompt Library** - Searchable, categorized collection of high-quality prompts
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Payments**: Stripe
- **PDF Viewer**: react-pdf
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Clerk account (free)
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd members-portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your credentials (see Configuration section below)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Configuration

### 1. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy the API keys from the Clerk dashboard
4. Add to `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the Stripe dashboard
3. Create a subscription product in Stripe
4. Add to `.env.local`:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_PREMIUM_PRICE_ID` (your subscription price ID)

### 3. Add Your Content

#### Custom GPTs
Edit `app/customgpts/page.tsx` and update the `customGPTs` array with your GPT links.

#### Projects
1. Add your PDF files to `public/pdfs/`
2. Edit `app/projects/page.tsx` and update the `projects` array
3. Make sure the `pdfUrl` matches your file names

#### Prompts
Edit `app/prompts/page.tsx` and update the `prompts` array with your custom prompts.

## Deployment to Vercel

1. Push your code to GitHub

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Add environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add all variables from your `.env.local` file

4. Deploy!

### Important: Vercel Configuration

Make sure to set these environment variables in Vercel:
- All Clerk variables
- All Stripe variables
- Any custom configuration

## How It Works

1. **User Authentication**: Users sign in with Clerk using their Substack email
2. **Subscription Check**: When accessing premium content, the app queries Stripe to verify if the user has an active subscription
3. **Protected Content**: Only verified premium subscribers can access Custom GPTs, Projects, and Prompts
4. **Free Users**: Users without an active subscription see a paywall with a link to subscribe on Substack

## Project Structure

```
members-portal/
├── app/
│   ├── api/
│   │   └── check-subscription/    # API route for subscription verification
│   ├── components/
│   │   └── SubscriptionCheck.tsx  # Protected content wrapper
│   ├── customgpts/                # Custom GPTs page
│   ├── dashboard/                 # Main dashboard
│   ├── projects/                  # Projects list and PDF viewer
│   │   └── [id]/                  # Individual project viewer
│   ├── prompts/                   # Prompts library
│   ├── layout.tsx                 # Root layout with Clerk provider
│   └── page.tsx                   # Landing page
├── lib/
│   └── stripe.ts                  # Stripe utility functions
├── public/
│   └── pdfs/                      # PDF files for projects
├── middleware.ts                  # Clerk authentication middleware
└── .env.local                     # Environment variables (not committed)
```

## Customization

### Branding
- Update the brand name in header components
- Change colors in Tailwind classes (search for "indigo-600" to replace with your brand color)
- Update the Substack link in the CTA sections

### Content
- Add more categories in the prompts library
- Create more project guides
- Add additional Custom GPT links

## Security Notes

- Never commit `.env.local` to version control
- Keep your Stripe and Clerk API keys secret
- Use Stripe test mode during development
- Always verify user authentication on the server side

## Support

For issues or questions:
- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Clerk documentation](https://clerk.com/docs)
- Check [Stripe documentation](https://stripe.com/docs)

## License

This project is for personal use with your Substack subscription service.

---

Built with ❤️ for LearnAIWithMe Premium Subscribers
