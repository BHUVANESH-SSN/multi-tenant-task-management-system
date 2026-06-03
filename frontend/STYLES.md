# TaskFlow UI Styles Reference

This document captures the styling tokens, Tailwind utilities, and component/page class usage currently used in this frontend. It is meant as a portability guide to reuse the same look and feel in another timetable management application.

## 1) Styling System

- Framework: Tailwind CSS utilities only.
- Custom CSS: none beyond font setup.
- Dark mode: class-based; the HTML element toggles the "dark" class.
- Base font: Inter.

## 2) Global and Base Setup

### Fonts
- Google Fonts: Inter (weights 300-800) loaded in index.html.
- Tailwind font family extension:
  - sans: ["Inter", ...defaultTheme.fontFamily.sans]

### Base CSS
- index.css:
  - @tailwind base
  - @tailwind components
  - @tailwind utilities
  - html font-family set to Inter

### Dark Mode Strategy
- Dark mode is controlled by the presence of the "dark" class on <html>.
- Theme toggle updates localStorage and adds/removes the class.

## 3) Color Tokens Used

### Primary Palette (custom)
Defined in tailwind.config.js:
- primary-50:  #eff6ff
- primary-100: #dbeafe
- primary-200: #bfdbfe
- primary-300: #93c5fd
- primary-400: #60a5fa
- primary-500: #3b82f6
- primary-600: #4F46E5 (indigo-600 as primary)
- primary-700: #4338ca
- primary-800: #3730a3
- primary-900: #312e81
- primary-950: #1e1b4b

### Utility Palette (Tailwind defaults)
Frequently used utility colors (not custom-defined):
- gray (text, background, borders)
- indigo (accent, buttons, gradients)
- blue (status badges)
- green (status badges, success)
- red (errors, destructive)
- yellow (priority)
- amber (dashboard card)
- emerald (dashboard card)
- purple (admin role badge)

## 4) Layout and Spacing Patterns

- Overall app layout: flex column on small, flex row with sidebar on md+.
- Containers: max-w-7xl mx-auto, min-h-screen, overflow handling.
- Cards: white/dark backgrounds, border-2, rounded-xl/lg, shadow-sm.
- Tables: divide-y and striped hover rows.
- Buttons: rounded-md/lg, shadow-sm, focus:ring, transition-colors.
- Forms: inputs with border-2, focus ring on indigo, dark variants.

## 5) Page and Component Class Inventory

This is a direct inventory of Tailwind class usage by file. Use these as reference patterns.

### Layout (Layout.jsx)
- Root app wrapper:
  - min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans text-gray-900 dark:text-gray-100
- Mobile overlay:
  - fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden transition-opacity
  - opacity-100 | opacity-0 pointer-events-none
- Sidebar:
  - fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-600 z-50 transform transition-transform duration-300 md:relative md:translate-x-0
  - translate-x-0 | -translate-x-full
- Sidebar header:
  - h-16 flex items-center px-6 border-b-2 border-gray-300 dark:border-gray-600
  - logo icon: w-8 h-8 text-indigo-600 mr-3
  - brand text: text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800
- Nav items:
  - container: space-y-1
  - item base: flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
  - active: bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400
  - inactive: text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100
  - icon: w-5 h-5 mr-3 with active/inactive text colors
- User card:
  - avatar: w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-bold uppercase
  - name: text-sm font-medium text-gray-900 dark:text-gray-100 truncate
  - org: text-xs text-gray-500 dark:text-gray-400 truncate
- Logout button:
  - w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
- Header:
  - bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 sticky top-0 z-30
  - height: h-16, padding: px-4 sm:px-6 lg:px-8
  - role pill: text-sm font-medium px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800 shadow-sm
- Main content:
  - flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8
  - inner: max-w-7xl mx-auto drop-shadow-sm

### Theme Toggle (ThemeToggle.jsx)
- Button:
  - p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none
- Icon size:
  - w-5 h-5

### Modal (Modal.jsx)
- Backdrop:
  - absolute inset-0 bg-gray-900/70 backdrop-blur-sm
- Container:
  - w-full max-w-lg (default), max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border-2 border-gray-300 bg-white shadow-2xl dark:border-gray-600 dark:bg-gray-800
- Header:
  - flex items-center justify-between border-b-2 border-gray-300 px-4 py-4 dark:border-gray-600 sm:px-6
- Close button:
  - rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200

### Protected Route + Auth Callback
- Uses class names "spinner-overlay" and "spinner".
- NOTE: These classes are referenced but not defined in CSS in this repo. You should define them in your new app or add them to index.css.

### Login (Login.jsx)
- Auth page wrapper:
  - bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 min-h-screen flex items-center justify-center relative p-4
- Auth card:
  - w-full max-w-md backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 p-8 transform transition-all hover:scale-[1.01]
- Brand:
  - flex items-center gap-2 mb-6 justify-center
  - logo icon: text-indigo-600 dark:text-indigo-400 text-2xl
  - title: text-xl font-bold text-gray-900 dark:text-white
- Headings:
  - text-2xl font-bold text-gray-900 dark:text-white text-center
  - subtitle: text-gray-500 dark:text-gray-400 text-center mb-6
- Error alert:
  - bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4
- Form inputs:
  - w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors
  - password input adds pr-10
- Show password button:
  - absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none
- Primary submit button:
  - w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2
- Divider:
  - flex items-center my-6
  - flex-grow border-t border-gray-300 dark:border-gray-700
  - or label: text-sm text-gray-500 dark:text-gray-400
- OAuth buttons:
  - Google: flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
  - GitHub: flex items-center justify-center w-full px-4 py-2 border border-gray-800 dark:border-gray-600 rounded-lg text-white bg-[#24292e] dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors
- Link:
  - text-indigo-600 dark:text-indigo-400 font-medium hover:underline

### Register (Register.jsx)
- Same auth page layout as Login.
- Submit button:
  - w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4
- Organization slug field uses opacity-75 on input.

### Dashboard (Dashboard.jsx)
- Page wrapper:
  - space-y-6
- Header:
  - text-2xl font-bold text-gray-900 dark:text-white
  - greeting text: text-sm text-gray-500 dark:text-gray-400 with name in font-semibold text-gray-900 dark:text-white
- Stat cards:
  - bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-600 p-6 flex items-center
  - icons: w-8 h-8
  - labels: text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
  - values: text-3xl font-bold text-gray-900 dark:text-white
  - per-card accent:
    - indigo: bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400
    - amber: bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500
    - emerald: bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400
- Quick actions card:
  - bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-600 overflow-hidden
  - header row: px-6 py-5 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50
  - button: inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors

### Tasks (Tasks.jsx)
- Page wrapper: space-y-6
- Primary button: same as dashboard button
- Table card:
  - bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex flex-col
- Table:
  - min-w-full divide-y divide-gray-200 dark:divide-gray-700
  - header: bg-gray-50 dark:bg-gray-800/50
  - header cells: px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
  - body rows: hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
- Loading state:
  - animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500
- Empty state:
  - text-center text-sm text-gray-500 dark:text-gray-400 font-medium
- Status badges:
  - To Do: bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300
  - In Progress: bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300
  - Done: bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300
- Priority badges:
  - High: bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300
  - Medium: bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300
  - Low: bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300
- Status select pill:
  - text-sm font-semibold cursor-pointer rounded-full px-3 py-1 border border-transparent shadow-sm focus:ring-2 focus:ring-indigo-500 transition-colors
  - TODO: bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
  - IN_PROGRESS: bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60
  - DONE: bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60
- Destructive delete:
  - text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1 rounded-md transition-colors
- Modal form fields:
  - label: block text-sm font-medium text-gray-700 dark:text-gray-300
  - inputs/textarea/select: mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm
- Modal info banner:
  - border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-900/20 dark:text-indigo-300
- Modal footer:
  - border-t-2 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/80
- Toast:
  - fixed bottom-4 right-4 z-[90]
  - success: bg-green-600 text-white
  - error: bg-red-600 text-white

### Audit Logs (AuditLogs.jsx)
- Table card:
  - bg-white dark:bg-gray-800 shadow-sm rounded-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden
- Empty state:
  - icon circle: w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400
  - text: text-lg font-medium text-gray-900 dark:text-white
- Table rows:
  - hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
- Action badges:
  - Created: bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400
  - Updated: bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400
  - Deleted: bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400
- Pagination buttons:
  - border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600

### Admin Panel (AdminPanel.jsx)
- Cards:
  - bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-gray-300 dark:border-gray-600 p-6
- Organization slug:
  - text-xl text-gray-600 dark:text-gray-300 font-mono
- Edit name button:
  - text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1
- Add Member button:
  - inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
- Role badge:
  - ADMIN: bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400
  - MEMBER: bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400
- Role select:
  - block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white
- Remove button:
  - text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1 rounded-md transition-colors
- Toast:
  - fixed bottom-4 right-4 z-50 animate-fade-in-up
  - success: bg-green-600 text-white
  - error: bg-red-600 text-white

## 6) Utility Class Notes

- animate-fade-in-up is used for a toast in AdminPanel but not defined in CSS. If you want this animation, add a custom @keyframes and utility (via Tailwind or plain CSS).
- spinner-overlay and spinner classes are used but not defined. You will need to add those definitions manually in your new app.

## 7) Suggested Porting Checklist

1) Copy tailwind.config.js primary palette and font extension.
2) Load Inter in your HTML and keep base font family in index.css.
3) Reuse the class patterns above for layout, cards, tables, forms, and buttons.
4) Add missing custom classes (spinner-overlay, spinner, animate-fade-in-up) as needed.
