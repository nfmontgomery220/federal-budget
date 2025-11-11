# Federal Budget Analysis Tool

A comprehensive Next.js application for analyzing federal spending, revenue, and policy impacts.

## Features

- **Budget Builder**: Interactive tool to balance the federal budget
- **Analytics Dashboard**: Real-time insights and data visualization
- **Tax Design Calculator**: Design and test tax policy scenarios
- **Military Spending Analysis**: Detailed defense budget breakdown
- **Revenue Analysis**: Comprehensive revenue source analysis
- **Policy Impact Tools**: Analyze effects of different policy choices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd federal-budget-analysis-tool
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Copy `.env.local` and fill in your Supabase credentials

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database scripts and migrations
├── utils/                 # Helper functions
└── public/               # Static assets
\`\`\`

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.
