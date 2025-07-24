# Welcome to your Expo app 👋

Bunk App is a smart attendance and academic tracker designed for students. It helps you monitor class attendance, manage bunks, receive timely notifications, and sync your academic schedule with Google Calendar. With PDF upload and LLM-powered extraction, you can easily import timetables and syllabi, track syllabus coverage, and get insights on your academic progress. Built with a modern mobile stack and a robust backend, Bunk App aims to simplify student life and boost productivity.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Tech Stack

This tech stack outlines the core technologies for building the Bunk App, which helps students track class attendance, bunks, and sync with calendars. LLMs (like Gemini) are used to extract structured data from PDF inputs (e.g., timetable, calendar).

### Frontend (Mobile App)
- **React Native (Expo)** – for cross-platform development
- **React Navigation** – screen transitions and stack/tab navigation
- **React Native Calendars** – display bunks on a calendar
- **React Native Paper** – clean UI components

### Backend
- **FastAPI (Python)** – lightweight REST API server
- **LlamaIndex** – index and query extracted PDF data
- **Gemini API** – extract insights from PDFs (timetable, calendar)
- **Google Calendar API** – create & sync events with user's calendar

### Database & Storage
- **Supabase** – for PostgreSQL DB, auth, and file storage
- **Tables:** users, subjects, bunks, syllabus, notifications

### Notifications
- **Expo Notifications** – to alert before classes or exams
- **Custom Logic** – detect critical attendance thresholds

### Optional Features
- **Syllabus Coverage Tracker** – match lecture topics with uploaded syllabus
- **Progress Tracking** – estimate syllabus completion 15 days before exams

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
