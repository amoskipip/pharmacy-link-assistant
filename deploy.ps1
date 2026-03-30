# Deploy Script for Nyagah Chemist

# Run this script from the nyagachem directory

Write-Host "Deploying Nyagah Chemist to Vercel..." -ForegroundColor Green

# 1. Clean and generate Prisma client
Write-Host "`n[1/5] Generating Prisma client..." -ForegroundColor Yellow
node -e "const fs=require('fs'); try{fs.rmSync('node_modules/.prisma',{recursive:true,force:true});console.log('Cleaned');}catch(e){}"
npx prisma generate

# 2. Push database schema
Write-Host "`n[2/5] Make sure you have a Neon database created at https://neon.tech" -ForegroundColor Yellow
Write-Host "Update .env with your DATABASE_URL before continuing." -ForegroundColor Yellow

# 3. Install Vercel CLI if needed
Write-Host "`n[3/5] Installing Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel

# 4. Login to Vercel
Write-Host "`n[4/5] Run 'vercel login' to authenticate" -ForegroundColor Yellow

# 5. Deploy
Write-Host "`n[5/5] Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "`nDone! Your app should be live on Vercel." -ForegroundColor Green
