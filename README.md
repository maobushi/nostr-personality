# Nostr Personality Analyzer
[Click here!](https://nostr-personality.vercel.app)

Nostr Personality Analyzer is a web application that provides insights from Nostr posts. This app analyzes users' Nostr profiles and offers unique perspectives.
<img width="1440" alt="Screenshot 2024-09-10 at 15 41 02" src="https://github.com/user-attachments/assets/a422f468-8b4a-4792-b15e-99a5ca348477">
<img width="1436" alt="Screenshot 2024-09-10 at 15 41 33" src="https://github.com/user-attachments/assets/ca1ea03c-338e-4a49-918a-27e625022990">
<img width="1431" alt="Screenshot 2024-09-10 at 15 40 08" src="https://github.com/user-attachments/assets/608237b8-d42e-40d8-9b3e-3f6742cdf10a">

## Support the Project
We use GPT4 for this project, which incurs API costs. If you find this tool useful, please consider making a donation to help keep it running!

**Bitcoin Address**
`bc1qmpsd298hs9anwetalnrntq55fen994mht60w5d`

**Lightning Network**
`secretbeef91@walletofsatoshi.com`

**Buy Me a coffee**
[Buy me a coffee](buymeacoffee.com/maobushi)

Your support is greatly appreciated!

## Tech Stack
- **Next.js**: For server-side rendering and routing
- **Supabase**: For save AI generated information
  
## Installation
1. Clone the repository.
   ```bash
   git clone git@github.com:maobushi/nostr-personality.git
   ```
2. Navigate to the directory.
   ```bash
   cd nostr-personality
   ```
3. Install dependencies.
   ```bash
   pnpm install
   ```
4. Add `.env` file
   `OPENAI_API_KEY`
   `NEXT_PUBLIC_SUPABASE_URL`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Setting up Database Client.
   ```bash
   npx supabase login
   ```
6. Start the development server.
   ```bash
   pnpm run dev
   ```

## Usage
Once the application is running, access it in your browser at `http://localhost:3000`. You can start the personality analysis by entering a Nostr npub.

## Contributing
Contributions are welcome! If you find a bug or have a feature suggestion, please create an issue.

## Note
Note: As this was created in just about a day, I am aware that there are various bugs. (For example, using "use client" for almost everything despite using Next.js, thus not utilizing SSR; outputting results in Japanese even when tweeting in English; for some reason, it blacks out and doesn't display when run locally, but somehow displays when built, etc.) I can't be very involved, but bug fixes and refactoring are very welcome. It would be a great help.

## Special Thanks
[@renchon](https://x.com/ren_Nevermind)
Massive shoutout for letting me crash at your pad during my dev marathon. Without your roof, I might've been coding under the stars (romantic, but not great for WiFi). 

## License
Nostr Personality Analyzer © 2024 by maobushi is licensed under Creative Commons Attribution-ShareAlike 4.0 International
